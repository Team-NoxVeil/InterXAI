import React from "react";

interface LogoProps {
  className?: string;
  dark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", dark = false }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="34" height="34" rx="8" fill={dark ? "#1e40af" : "#2563eb"} />
      <text
        x="17"
        y="23"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        X
      </text>
    </svg>
    <span
      className={`font-bold text-lg tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
    >
      InterXAI
    </span>
  </div>
);

export default Logo;
