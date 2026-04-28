import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Hexagon icon */}
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        fill="none"
        stroke="#3ddc84"
        strokeWidth="2"
      />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#3ddc84"
        fontSize="13"
        fontWeight="bold"
        fontFamily="monospace"
      >
        X
      </text>
    </svg>
    <span className="text-white font-bold text-lg tracking-wide">InterXAI</span>
  </div>
);

export default Logo;
