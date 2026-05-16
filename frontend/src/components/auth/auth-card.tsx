"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden bg-white/50 backdrop-blur-[40px] border-[1.5px] border-white/80 shadow-[0_32px_64px_-12px_rgba(0,40,120,0.15),inset_0_0_24px_rgba(255,255,255,0.8)] rounded-[40px] p-10 sm:p-12 ${className}`}
    >
      <div className="relative z-10">
        <Logo />
        {children}
      </div>
      {/* 3D Glass edge highlight */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[40px] border border-white/40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
    </motion.div>
  );
}
