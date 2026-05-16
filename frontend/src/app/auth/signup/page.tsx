"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialLogins } from "@/components/auth/social-logins";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/verify");
    }, 1500);
  };

  return (
    <div className="w-full">
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-[26px] font-bold text-[#191c1e] mb-2 tracking-tight">Create your account</h1>
          <p className="text-[15px] text-gray-500 font-medium">Start your journey with AI-powered interviews.</p>
        </div>

        <SocialLogins />

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4 mb-8">
            <AuthInput
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="john.doe@email.com"
              required
              disabled={isLoading}
            />
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
              showPasswordToggle
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2563eb] text-white py-4 rounded-xl text-[16px] font-medium hover:bg-[#1d4ed8] active:scale-[0.98] transition-all flex items-center justify-center shadow-md disabled:opacity-70"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-gray-400 leading-relaxed font-medium">
          By creating an account, you agree to our <br />
          <Link href="#" className="text-[#2563eb] hover:underline transition-all">Terms of Service</Link> and <Link href="#" className="text-[#2563eb] hover:underline transition-all">Privacy Policy</Link>
        </p>
      </AuthCard>

      <footer className="mt-8 text-center">
        <p className="text-[15px] text-gray-500 font-medium">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#2563eb] font-bold hover:underline transition-all">
            Sign In
          </Link>
        </p>
      </footer>
    </div>
  );
}
