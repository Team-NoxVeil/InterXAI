import { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#eaf2ff]">
      {/* Absolute Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/icy-bg.png" 
          alt="Icy Glass Background" 
          fill 
          className="object-cover opacity-90"
          priority
        />
      </div>

      <main className="relative z-10 w-full max-w-[520px]">
        {children}
      </main>
    </div>
  );
}

