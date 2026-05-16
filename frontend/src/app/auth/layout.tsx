"use client";

import { ReactNode, useEffect, useRef } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const orbsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      orbsRef.current.forEach((orb, index) => {
        if (!orb) return;
        const speed = (index + 1) * 20;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Atmospheric Background Orbs */}
      <div
        ref={(el) => { if (el) orbsRef.current[0] = el; }}
        className="orb w-[500px] h-[500px] bg-primary/20 top-[-10%] left-[-10%]"
      />
      <div
        ref={(el) => { if (el) orbsRef.current[1] = el; }}
        className="orb w-[400px] h-[400px] bg-accent/20 bottom-[-5%] right-[-5%]"
        style={{ animationDelay: "-5s" }}
      />
      <div
        ref={(el) => { if (el) orbsRef.current[2] = el; }}
        className="orb w-[300px] h-[300px] bg-primary/10 top-[20%] right-[15%]"
        style={{ animationDelay: "-10s" }}
      />

      <main className="relative z-10 w-full max-w-[520px] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-10">
          <span className="material-symbols-outlined text-primary text-4xl">blur_on</span>
          <span className="font-bold text-3xl tracking-tighter text-primary">InterXAI</span>
        </div>
        
        {children}
      </main>
    </div>
  );
}

