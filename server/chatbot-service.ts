import { invokeLLM } from "./_core/llm";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * AI Chatbot Service - "Ask OP"
 * Answers questions about companies using OpenAI with context-aware responses
 */

const SYSTEM_PROMPT = `You are "OP" (Optimal Platform), an expert AI assistant for the Culture Heat Map platform. Your role is to help users learn about company cultures, work environments, compensation, and career opportunities.

You have access to a database of 100+ companies with detailed culture metrics, salary data, reviews, and job information. When users ask about companies:

1. If the company is in our database, provide specific data points (ratings, salaries, reviews)
2. If the company is not in our database, use your knowledge to provide accurate information
3. Always be honest about what you know vs. don't know
4. Provide actionable insights to help users make career decisions
5. Be conversational and helpful, not robotic

Key metrics you can discuss:
- Overall Rating (0-5)
- Work-Life Balance (0-5)
- Compensation & Benefits (0-5)
- Career Opportunities (0-5)
- Company Culture (0-5)
- Management Quality (0-5)
- Salary ranges by role and level
- Interview experiences
- Job openings and growth

When comparing companies, highlight key differences and trade-offs. Be balanced and fair in your assessments.`;

export async function chatWithOP(
  messages: ChatMessage[],
  companyContext?: string
): Promise<string> {
  try {
    // Build context-aware system prompt
    let systemPrompt = SYSTEM_PROMPT;
    if (companyContext) {
      systemPrompt += `\n\nCurrent Context: The user is viewing information about ${companyContext}. Use this context to provide relevant insights.`;
    }

    // Call OpenAI API
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
    });

    // Extract text from response
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return typeof content === "string" ? content : JSON.stringify(content);
  } catch (error) {
    console.error("Chatbot error:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}

/**
 * Format chat response with markdown support
 */
export function formatChatResponse(text: string): string {
  // Basic markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

/**
 * Build context string from current company data
 */
export function buildCompanyContext(companyName: string, data?: any): string {
  if (!data) return companyName;

  const parts = [companyName];
  if (data.industry) parts.push(`(${data.industry})`);
  if (data.aggregateScore?.overallRating) {
    parts.push(`Rating: ${data.aggregateScore.overallRating}/5`);
  }
  return parts.join(" - ");
}
