import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "cyan" | "purple" | "pink" | "green";
  animated?: boolean;
}

export default function AnimatedCard({
  children,
  className = "",
  glowColor = "blue",
  animated = true,
}: AnimatedCardProps) {
  const glowClasses = {
    blue: "hover:shadow-lg hover:shadow-blue-500/20",
    cyan: "hover:shadow-lg hover:shadow-cyan-400/20",
    purple: "hover:shadow-lg hover:shadow-purple-500/20",
    pink: "hover:shadow-lg hover:shadow-pink-500/20",
    green: "hover:shadow-lg hover:shadow-green-400/20",
  };

  return (
    <Card
      className={`
        bg-white/5 border-white/10 backdrop-blur-sm
        transition-all duration-300
        ${animated ? "hover:bg-white/10 hover:border-white/20 hover:scale-105" : ""}
        ${glowClasses[glowColor]}
        ${className}
      `}
    >
      {children}
    </Card>
  );
}
