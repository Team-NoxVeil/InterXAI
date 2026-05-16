"use client";

import { InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
}

export function AuthInput({ 
  label, 
  icon, 
  showPasswordToggle, 
  type, 
  className = "", 
  id,
  ...props 
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={id} className="text-[13px] font-medium text-gray-500 ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2563eb] transition-colors">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={currentType}
          className={`
            w-full bg-[#f9fafb] border border-gray-100 rounded-2xl px-4 py-3.5
            ${icon ? "pl-11" : ""} 
            ${showPasswordToggle ? "pr-11" : ""}
            focus:outline-none focus:ring-2 focus:ring-[#2563eb]/10 focus:border-[#2563eb]/30
            transition-all duration-200 placeholder:text-gray-300 text-[#191c1e] text-[15px]
            hover:bg-gray-50
            ${className}
          `}
          {...props}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
