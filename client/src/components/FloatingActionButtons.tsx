import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageSquare, Home } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface FloatingActionButtonsProps {
  showFavorite?: boolean;
  onFavoriteClick?: () => void;
  isFavorited?: boolean;
}

export default function FloatingActionButtons({
  showFavorite = false,
  onFavoriteClick,
  isFavorited = false,
}: FloatingActionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-4">
      {/* Floating Menu Items */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {showFavorite && (
            <Button
              onClick={onFavoriteClick}
              size="icon"
              className={`rounded-full shadow-lg transition-all ${
                isFavorited
                  ? "bg-pink-500 hover:bg-pink-600 glow-pink"
                  : "bg-white/10 hover:bg-white/20 border border-white/20"
              }`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
          )}

          <Button
            size="icon"
            className="rounded-full shadow-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full shadow-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            title="Feedback"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Link href="/">
            <Button
              size="icon"
              className="rounded-full shadow-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              title="Back to Home"
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`rounded-full shadow-xl transition-all duration-300 ${
          isOpen
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-pink"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 glow"
        } w-14 h-14 flex items-center justify-center`}
        title="Toggle menu"
      >
        <div
          className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
        >
          <span className="text-2xl">+</span>
        </div>
      </Button>
    </div>
  );
}
