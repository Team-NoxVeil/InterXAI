"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialLogins } from "@/components/auth/social-logins";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading and redirect
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full">
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-[26px] font-bold text-[#191c1e] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[15px] text-gray-500 font-medium">Elevate your workflow with InterXAI.</p>
        </div>

        <SocialLogins />

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="john.doe@email.com"
            icon={<Mail size={18} />}
            required
          />
          
          <div className="space-y-3">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              showPasswordToggle
              required
            />
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-[#2563eb] focus:ring-[#2563eb]/10 bg-gray-50" />
                <span className="text-[14px] text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-[14px] font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2563eb] text-white py-4 rounded-2xl text-[16px] font-semibold hover:bg-[#1d4ed8] disabled:opacity-70 active:scale-[0.98] transition-all shadow-md shadow-[#2563eb]/20 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
          </button>
        </form>
      </AuthCard>
      
      <footer className="mt-8 text-center">
        <p className="text-[15px] text-gray-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-[#2563eb] font-bold hover:underline transition-all">
            Sign Up
          </Link>
        </p>
      </footer>
    </div>
  );
}
