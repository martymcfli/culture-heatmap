import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, MessageCircle } from "lucide-react";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  companyContext?: string;
}

export default function ChatBox({ companyContext }: ChatBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm OP, your AI assistant. Ask me anything about companies, salaries, culture, or careers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chatbot.chat.useMutation();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect if user is asking to compare companies
  const detectComparison = (text: string): { companies: string[]; isComparison: boolean } => {
    const lowerText = text.toLowerCase();
    const comparisonPatterns = [
      /compare\s+([a-z0-9\s&]+?)\s+(?:and|vs|with|to)\s+([a-z0-9\s&]+?)(?:\?|$)/i,
      /([a-z0-9\s&]+?)\s+vs\s+([a-z0-9\s&]+?)(?:\?|$)/i,
      /what's\s+the\s+difference\s+between\s+([a-z0-9\s&]+?)\s+and\s+([a-z0-9\s&]+?)(?:\?|$)/i,
    ];

    for (const pattern of comparisonPatterns) {
      const match = text.match(pattern);
      if (match) {
        const company1 = match[1]?.trim().replace(/^(the|a)\s+/i, "");
        const company2 = match[2]?.trim().replace(/^(the|a)\s+/i, "");
        if (company1 && company2) {
          return {
            isComparison: true,
            companies: [company1, company2],
          };
        }
      }
    }

    return { isComparison: false, companies: [] };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if user is asking for a comparison
    const { isComparison, companies } = detectComparison(input);

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // If comparison detected, offer to navigate to comparison page
      if (isComparison && companies.length === 2) {
        const [company1, company2] = companies;
        const assistantMessage: Message = {
          role: "assistant",
          content: `I detected you want to compare ${company1} and ${company2}. Let me fetch their data and show you a detailed comparison. I'll also answer any specific questions you have about how they differ.`,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Store comparison request for later use
        sessionStorage.setItem(
          "pendingComparison",
          JSON.stringify({ company1, company2 })
        );

        // Navigate to comparison page after a short delay
        setTimeout(() => {
          window.location.href = `/compare?companies=${encodeURIComponent(
            company1
          )},${encodeURIComponent(company2)}`;
        }, 1500);
      } else {
        // Regular chat response
        const result = await chatMutation.mutateAsync({
          messages: [...messages, userMessage],
          companyContext,
        });

        // Add assistant response
        const assistantMessage: Message = {
          role: "assistant",
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all group"
          title="Ask OP - AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute bottom-full left-0 mb-2 px-3 py-1 bg-slate-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask OP
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 z-50 w-96 h-[600px] bg-slate-900 border-slate-700 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between rounded-t-lg">
            <div>
              <h3 className="font-bold text-white text-lg">Ask OP</h3>
              <p className="text-cyan-100 text-xs">AI Assistant for Company Info</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-700 text-slate-100 rounded-bl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Streamdown>{msg.content}</Streamdown>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything... e.g. 'compare Google vs Meta' or 'What's the average turnover at Apple?'"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
