import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  type?: "fade" | "slide";
}

export default function PageTransition({ children, type = "fade" }: PageTransitionProps) {
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const variants = type === "slide" ? slideVariants : fadeVariants;

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={variants}>
      {children}
    </motion.div>
  );
}
