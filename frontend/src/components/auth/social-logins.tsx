"use client";

import Image from "next/image";

export function SocialLogins() {
  return (
    <div className="space-y-4">
      <button
        type="button"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#191c1e] text-[15px] font-medium shadow-sm active:scale-[0.98]"
      >
        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#191c1e] text-[15px] font-medium shadow-sm active:scale-[0.98]"
      >
        <Image src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" width={20} height={20} />
        <span>Continue with LinkedIn</span>
      </button>
      
      <div className="relative flex items-center justify-center py-4">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="px-4 text-[13px] text-gray-400 font-medium">or</span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>
    </div>
  );
}
