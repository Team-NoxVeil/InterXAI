"use client";

import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center justify-center mb-6"
    >
      <div className="w-12 h-12 rounded-[14px] border-[1px] border-gray-300 flex items-center justify-center bg-white shadow-sm">
        <span className="text-[#191c1e] text-2xl font-light">X</span>
      </div>
    </motion.div>
  );
}
