"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthCard } from "@/components/auth/auth-card";
import { motion } from "framer-motion";

export default function VerifyPage() {
  return (
    <div className="w-full">
      <AuthCard>
        <div className="text-center">
          <h1 className="text-[26px] font-bold text-[#191c1e] mb-2 tracking-tight">Verify your email</h1>
          <p className="text-[15px] text-gray-500 font-medium mb-8 leading-relaxed max-w-[320px] mx-auto">
            We&apos;ve sent a verification link to your email. Please click the link to confirm your account.
          </p>

          <div className="relative w-full aspect-[4/3] max-w-[300px] mx-auto mb-6 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full mix-blend-darken"
            >
              <Image 
                src="/icy-envelope.png" 
                alt="Verification Email" 
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>


          <div className="space-y-6 mt-4">
            <div className="space-y-1">
              <p className="text-[14px] text-gray-500 font-medium">
                Didn&apos;t receive the email?
              </p>
              <button className="text-gray-400 font-medium text-[14px] hover:text-gray-600 transition-all">
                Resend link (56s)
              </button>
            </div>

            <div className="pt-4">
              <Link 
                href="/auth/signin"
                className="w-full bg-[#f8fafc] border border-gray-100 text-[#191c1e] py-4 rounded-full text-[16px] font-bold hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center shadow-sm"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
