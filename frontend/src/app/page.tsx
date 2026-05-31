/* eslint-disable */
// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Activity, Users, Mic } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900 font-sans overflow-hidden selection:bg-blue-500/20">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-[-20%] w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="absolute top-0 inset-x-0 z-50 bg-transparent">
        <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border-[1.5px] border-blue-500 text-blue-500 flex items-center justify-center font-bold text-lg">
              X
            </div>
            <span className="font-bold text-[22px] tracking-tight text-slate-800">
              InterXAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-semibold text-[14px] text-slate-600">
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              Solutions <span className="text-[10px]">▼</span>
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              For Users
            </Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              Resources <span className="text-[10px]">▼</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="hidden sm:block text-[15px] font-bold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all flex items-center gap-2 shadow-[0_8px_20px_rgba(59,130,246,0.3)]"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative min-h-[90vh] flex items-center max-w-[1400px] mx-auto px-8 pt-32 pb-12">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="relative z-20 w-full lg:w-[45%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-600 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[12px] font-bold tracking-wide uppercase">
                AI-Powered Interview Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[64px] lg:text-[80px] font-extrabold leading-[1.05] tracking-tight mb-6 text-[#0f172a]"
            >
              Ace <span className="text-blue-600">Interviews.</span>
              <br />
              Advance Your
              <br />
              Career.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[18px] text-slate-500 leading-[1.6] max-w-md mb-10 font-medium"
            >
              InterXAI conducts intelligent interviews, evaluates skills, and
              delivers actionable feedback to help you get hired faster and grow
              your career.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <Link
                href="/auth/signup"
                className="group bg-[#2563eb] hover:bg-blue-700 text-white pl-6 pr-2 py-2 rounded-full text-[15px] font-bold transition-all flex items-center gap-4 shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
              >
                Start AI Interview
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
              <button className="bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-full text-[15px] font-bold transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100">
                Watch Demo <Play className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[18px] font-extrabold text-slate-800">
                    10,000+
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    Interviews Run
                  </div>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[18px] font-extrabold text-slate-800">
                    82%
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    Avg. Confidence Score
                  </div>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-[18px] font-extrabold text-slate-800 flex items-baseline gap-1">
                    4.9<span className="text-[12px] text-slate-400">/5</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-400">
                    User Rating
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Full CSS 3D Scene */}
          <div className="relative w-full lg:w-[55%] h-[700px] flex items-center justify-center perspective-[2000px] transform-style-3d mt-10 lg:mt-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[600px] h-[650px] flex items-center justify-center transform-style-3d"
            >
              {/* --- THE CSS 3D PODIUM BASE --- */}
              <div className="absolute top-[460px] left-1/2 -translate-x-1/2 w-[480px] h-[160px] transform-style-3d">
                {/* Base Shadow */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[520px] h-[100px] bg-[#a8c7fa] rounded-[50%] blur-[30px] opacity-60" />

                {/* Layer 1 (Bottom Segmented Chrome Ring Rim) */}
                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[450px] h-[120px] bg-[linear-gradient(180deg,#ffffff,#cbd5e1)] rounded-[50%] shadow-[0_20px_40px_rgba(15,23,42,0.15)] border-b-[8px] border-slate-300 flex items-center justify-center">
                  {/* Conic pattern for segmented metal blocks */}
                  <div className="absolute inset-0 rounded-[50%] bg-[repeating-conic-gradient(from_0deg,#ffffff_0deg,#ffffff_12deg,#e2e8f0_12deg,#e2e8f0_13deg,#94a3b8_13deg,#94a3b8_25deg)] opacity-40 mix-blend-multiply" />

                  {/* Layer 2 (Vibrant Glowing Blue Neon Ring) */}
                  <div className="absolute top-[5px] w-[410px] h-[105px] bg-[#0284c7]/20 rounded-[50%] border-[4px] border-[#0ea5e9] shadow-[0_0_35px_rgba(14,165,233,0.85),inset_0_0_20px_rgba(14,165,233,0.7)] flex items-center justify-center">
                    {/* Layer 3 (Polished Silver Plate with radial tracks) */}
                    <div className="absolute top-[6px] w-[390px] h-[85px] bg-[linear-gradient(180deg,#f8fafc,#cbd5e1)] rounded-[50%] shadow-[inset_0_5px_15px_rgba(255,255,255,1),inset_0_-5px_15px_rgba(0,0,0,0.1)] border-[1px] border-slate-300 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-[50%] bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_10deg,rgba(0,0,0,0.04)_10deg,rgba(0,0,0,0.04)_11deg)]" />

                      {/* Layer 4 (Top Glass-Cap Cap Ring) */}
                      <div className="absolute top-[8px] w-[330px] h-[65px] bg-white/30 backdrop-blur-[6px] rounded-[50%] border-[2px] border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)]" />
                      {/* Inner glowing core */}
                      <div className="absolute top-[18px] w-[260px] h-[48px] rounded-[50%] border-[2px] border-blue-300/40 shadow-[0_0_15px_rgba(147,197,253,0.4)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- ORBITING GLASS ARCHES (THREE THICK CONCENTRIC NEON LOOPS) --- */}
              {/* Loop 1: Outer vertical loop */}
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[460px] h-[460px] rounded-full border-[5px] border-white/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.2)] bg-white/5 backdrop-blur-[1px] transform-style-3d scale-y-[0.8] rotate-x-[60deg] pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full" />
              </motion.div>

              {/* Loop 2: Middle diagonal loop */}
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[410px] h-[410px] rounded-full border-[4px] border-white/45 shadow-[inset_0_0_15px_rgba(255,255,255,0.3),0_0_20px_rgba(59,130,246,0.15)] bg-white/5 transform-style-3d scale-y-[0.85] rotate-x-[50deg] rotate-y-[15deg] pointer-events-none"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] rounded-full" />
              </motion.div>

              {/* Loop 3: Inner diagonal loop */}
              <motion.div
                animate={{ rotateZ: 280 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full border-[3px] border-white/40 shadow-[inset_0_0_10px_rgba(255,255,255,0.3)] bg-white/5 transform-style-3d scale-y-[0.88] rotate-x-[55deg] rotate-y-[-10deg] pointer-events-none"
              >
                <div className="absolute top-10 right-10 w-2 h-2 bg-cyan-300 shadow-[0_0_10px_#67e8f9] rounded-full" />
              </motion.div>

              {/* --- THE ECHOING BALL NEBULOUS RINGS (PULSING CONCENTRIC RADAR WAVE EFFECT) --- */}
              <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] flex items-center justify-center transform-style-3d pointer-events-none">
                {/* Backlight / Soft Radial Blue Glow */}
                <div className="absolute w-[240px] h-[240px] rounded-full bg-blue-400/25 blur-[50px]" />

                {/* Echo Wave 1 */}
                <div className="echo-ring w-[320px] h-[320px] animate-ripple-1" />
                {/* Echo Wave 2 */}
                <div className="echo-ring w-[400px] h-[400px] animate-ripple-2" />
                {/* Echo Wave 3 */}
                <div className="echo-ring w-[480px] h-[480px] animate-ripple-3" />
              </div>

              {/* --- THE METALLIC CHROME ORB (GROOVED CHROME SPLIT) --- */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-[170px] left-1/2 -translate-x-1/2 z-10 w-[260px] h-[260px] rounded-full flex items-center justify-center shadow-[0_45px_70px_-15px_rgba(15,23,42,0.3)] transform-style-3d overflow-hidden"
              >
                {/* 1. Outer Metallic Chrome Shell */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_20%,#ffffff_0%,#f1f5f9_15%,#cbd5e1_35%,#475569_70%,#0f172a_100%)] border border-white/40 z-[2]" />

                {/* 2. Chrome Horizontal Groove Belt (horizontal split indentation) */}
                <div className="absolute w-full h-[36px] bg-[#020617] border-y-[2px] border-white/20 shadow-[inset_0_4px_8px_rgba(0,0,0,0.85),inset_0_-4px_8px_rgba(0,0,0,0.85)] z-[3]" />

                {/* 3. Outer Chrome Specular Highlights */}
                <div className="absolute top-[2%] left-[6%] w-[130px] h-[90px] bg-white rounded-full blur-[15px] opacity-90 rotate-[-28deg] z-[4]" />
                <div className="absolute bottom-[2%] right-[6%] w-[110px] h-[45px] bg-blue-100 rounded-full blur-[12px] opacity-45 rotate-[28deg] z-[4]" />

                {/* 4. Middle Step-down Ring (Etched Silver Chrome) */}
                <div className="absolute w-[204px] h-[204px] rounded-full bg-[radial-gradient(circle_at_35%_25%,#f8fafc_0%,#cbd5e1_40%,#475569_100%)] border-[3.5px] border-slate-300 shadow-[inset_0_4px_6px_rgba(255,255,255,0.7),0_8px_16px_rgba(0,0,0,0.12)] flex items-center justify-center z-[10]">
                  {/* 5. Inner Step-down Ring (Polished Dark Chrome) */}
                  <div className="absolute w-[162px] h-[162px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,#94a3b8_50%,#1e293b_100%)] border-[2.5px] border-slate-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.15)] flex items-center justify-center z-[11]">
                    {/* 6. Dark Screen Core */}
                    <div className="absolute w-[124px] h-[124px] bg-[#020617] rounded-full border-[3px] border-slate-500 shadow-[inset_0_0_30px_#000,0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center overflow-hidden z-[12]">
                      {/* Internal Radial Glow */}
                      <div className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#2563eb_0%,transparent_65%)] opacity-70 mix-blend-screen" />

                      {/* Audio Waveform */}
                      <div className="w-[74px] h-[36px] flex items-center justify-between gap-[3px] z-20">
                        {[...Array(9)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [10, 36, 10] }}
                            transition={{
                              duration: 0.7 + ((i * 7) % 5) * 0.1,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.08,
                            }}
                            className="w-[3px] bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* --- FLOATING CARDS --- */}

              {/* Card 1: AI Interviewer (Top Left) */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 5.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                  transform: "rotateY(16deg) rotateX(8deg)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{
                  transform: "rotateY(8deg) rotateX(4deg) translateZ(30px)",
                  scale: 1.03,
                }}
                className="absolute top-[10px] left-[-60px] z-20 backdrop-blur-2xl rounded-[24px] p-5 w-[240px] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[12px] bg-blue-50/40 border border-blue-100/40 flex items-center justify-center text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.06)]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-slate-800">
                      AI Interviewer
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                      <span className="text-[12px] font-bold text-slate-400">
                        Listening...
                      </span>
                    </div>
                  </div>
                </div>
                {/* Thin beautiful SVG line soundwave */}
                <svg
                  className="w-full h-8 mt-4 stroke-blue-500/40 fill-none"
                  viewBox="0 0 200 40"
                >
                  <motion.path
                    animate={{
                      d: [
                        "M0,20 Q25,10 50,20 T100,20 T150,20 T200,20",
                        "M0,20 Q25,30 50,10 T100,30 T150,10 T200,20",
                        "M0,20 Q25,10 50,20 T100,20 T150,20 T200,20",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              {/* Card 2: Confidence Score (Bottom Left) */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                  transform: "rotateY(18deg) rotateX(10deg)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{
                  transform: "rotateY(8deg) rotateX(5deg) translateZ(30px)",
                  scale: 1.03,
                }}
                className="absolute top-[340px] left-[-90px] z-20 backdrop-blur-2xl rounded-[24px] p-5 w-[185px] flex flex-col items-center transition-all duration-300"
              >
                <span className="text-[12px] font-extrabold text-slate-500 mb-4 self-start">
                  Confidence Score
                </span>
                <div className="relative w-[100px] h-[100px] flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-slate-200/40"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-[#0ea5e9]"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="263"
                      strokeDashoffset="47"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-[26px] font-extrabold text-slate-800 tracking-tight">
                    82
                    <span className="text-[14px] text-blue-500 font-bold">
                      %
                    </span>
                  </div>
                </div>
                {/* Smooth Rising Sparkline SVG */}
                <svg
                  className="w-full h-10 mt-3"
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,22 C15,20 30,12 45,18 C60,24 75,6 100,2"
                    fill="none"
                    className="stroke-blue-400"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              {/* Card 3: Feedback (Top Right) */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                  transform: "rotateY(-16deg) rotateX(8deg)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{
                  transform: "rotateY(-8deg) rotateX(4deg) translateZ(30px)",
                  scale: 1.03,
                }}
                className="absolute top-[-10px] right-[-60px] z-20 backdrop-blur-2xl rounded-[24px] p-6 w-[265px] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-extrabold text-[15px] text-slate-800">
                    Feedback
                  </span>
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <div className="space-y-3.5">
                  {[
                    "Clear Answers",
                    "Good Structure",
                    "Relevant Examples",
                    "Keep Improving",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                      <span className="text-[13px] font-bold text-slate-600">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-full h-2 bg-slate-100/50 rounded-full mt-6 overflow-hidden">
                  <div className="w-[85%] h-full bg-[#0ea5e9] rounded-full" />
                </div>
              </motion.div>

              {/* Card 4: Skills Detected (Bottom Right) */}
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{
                  duration: 6.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.55)",
                  boxShadow:
                    "0 25px 50px -12px rgba(15, 23, 42, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                  transform: "rotateY(-18deg) rotateX(10deg)",
                  transformStyle: "preserve-3d",
                }}
                whileHover={{
                  transform: "rotateY(-8deg) rotateX(5deg) translateZ(30px)",
                  scale: 1.03,
                }}
                className="absolute top-[350px] right-[-70px] z-20 backdrop-blur-2xl rounded-[24px] p-6 w-[285px] transition-all duration-300"
              >
                <span className="text-[13px] font-extrabold text-slate-800 mb-4 block">
                  Skills Detected
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1.5 bg-slate-50/20 border border-slate-300/30 rounded-full text-[12px] font-bold text-slate-700">
                    Problem Solving
                  </span>
                  <span className="px-3.5 py-1.5 bg-slate-50/20 border border-slate-300/30 rounded-full text-[12px] font-bold text-slate-700">
                    Communication
                  </span>
                  <span className="px-3.5 py-1.5 bg-slate-50/20 border border-slate-300/30 rounded-full text-[12px] font-bold text-slate-700">
                    Leadership
                  </span>
                  <span className="px-3.5 py-1.5 bg-slate-50/20 border border-slate-300/30 rounded-full text-[12px] font-bold text-slate-700">
                    Adaptability
                  </span>
                  <span className="px-3.5 py-1.5 bg-blue-100/60 border border-blue-200/50 rounded-full text-[12px] font-extrabold text-blue-800">
                    +12
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Trusted By Section - Fixed at bottom */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-8 pb-10">
        <div className="bg-white/60 backdrop-blur-xl border-[1.5px] border-white shadow-[0_10px_30px_rgba(15,23,42,0.03)] px-10 py-8 rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-10 flex-wrap">
          <div className="text-[12px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            Trusted By
            <br />
            Top Companies
          </div>
          <div className="flex items-center justify-between gap-10 flex-wrap flex-1 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 text-slate-800">
            <div className="font-extrabold text-[26px] tracking-tight">
              Google
            </div>
            <div className="font-bold text-[22px] flex items-center gap-1.5">
              <div className="grid grid-cols-2 gap-[2px]">
                <div className="w-3 h-3 bg-current" />
                <div className="w-3 h-3 bg-current" />
                <div className="w-3 h-3 bg-current" />
                <div className="w-3 h-3 bg-current" />
              </div>{" "}
              Microsoft
            </div>
            <div className="font-bold text-[28px] tracking-tighter">amazon</div>
            <div className="font-bold text-[26px] tracking-tight hover:text-[#ff5a5f] transition-colors">
              airbnb
            </div>
            <div className="font-bold text-[26px] tracking-tight flex items-center gap-1.5">
              <span className="text-3xl font-light">∞</span> Meta
            </div>
            <div className="font-bold text-[24px] tracking-tighter flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] hover:bg-[#1ed760] transition-colors">
                (((
              </div>{" "}
              Spotify
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .perspective-[2000px] { perspective: 2000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes ripple {
          0% {
            transform: scale(0.6) rotateX(60deg) rotateY(-10deg);
            opacity: 0;
            filter: blur(2px);
          }
          15% {
            opacity: 0.85;
            filter: blur(0px);
          }
          85% {
            opacity: 0.35;
          }
          100% {
            transform: scale(1.35) rotateX(60deg) rotateY(-10deg);
            opacity: 0;
            filter: blur(6px);
          }
        }
        .echo-ring {
          position: absolute;
          border: 1.5px solid rgba(147, 197, 253, 0.35);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.2), inset 0 0 20px rgba(96, 165, 250, 0.15);
          transform-style: preserve-3d;
        }
        .animate-ripple-1 {
          animation: ripple 6s infinite linear;
        }
        .animate-ripple-2 {
          animation: ripple 6s infinite linear 2s;
        }
        .animate-ripple-3 {
          animation: ripple 6s infinite linear 4s;
        }
      `,
        }}
      />
    </div>
  );
}
