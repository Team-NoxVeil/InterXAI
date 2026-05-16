"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  MessageSquare,
  BarChart,
  Target,
  CheckCircle2,
  Play,
  ArrowRight,
  Mic
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image src="/bg.png" alt="Background" fill className="object-cover opacity-60" priority />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              I
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              InterXAI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary-foreground/70">
            <Link href="#solutions" className="hover:text-primary transition-colors">Solutions</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#resources" className="hover:text-primary transition-colors">Resources</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="font-semibold">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <h1 className="text-6xl md:text-7xl font-heading font-extrabold tracking-tight text-foreground leading-[1.1]">
              Ace <span className="gradient-text">Interviews.</span><br />
              Advance Your Career.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Practice with our futuristic AI interviewer. Get real-time feedback, confidence scoring, and targeted skill analysis to land your dream job.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/dashboard/interview">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 glow-effect">
                  Start AI Interview <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5 bg-white/50 backdrop-blur-sm">
                <Play className="mr-2 w-5 h-5 fill-primary text-primary" /> Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Right - 3D Orb / Cards */}
          <div className="relative h-[600px] w-full flex items-center justify-center">
            {/* 3D Orb Image */}
            <motion.div 
              animate={{ 
                y: [-15, 15, -15],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[500px] h-[500px] flex items-center justify-center"
            >
              <Image src="/hero-orb.png" alt="AI Interviewer" fill className="object-contain drop-shadow-2xl z-10" priority />
            </motion.div>

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-10"
            >
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
                <div>
                  <p className="text-sm font-bold text-foreground">Confidence Score</p>
                  <p className="text-xs text-muted-foreground">92% - Excellent</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -right-4"
            >
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full"><BrainCircuit className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="text-sm font-bold text-foreground">Skills Detected</p>
                  <p className="text-xs text-muted-foreground">React, Node.js, System Design</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted Companies */}
        <section className="py-20 border-y border-white/40 bg-white/20 backdrop-blur-sm mt-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by candidates hired at</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['Google', 'Microsoft', 'Amazon', 'Airbnb', 'Meta', 'Spotify'].map((company) => (
                <div key={company} className="text-2xl font-heading font-extrabold text-foreground">{company}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="solutions" className="py-32 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Unfair Advantage <br/>for Your Next Interview</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our AI analyzes everything from your technical answers to your tone of voice.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MessageSquare, title: "Real-time AI feedback", desc: "Get instant corrections and alternative better answers as you speak." },
              { icon: Mic, title: "Voice-based Mocks", desc: "Talk naturally. Our STT engine understands context and technical jargon." },
              { icon: BarChart, title: "Performance Analytics", desc: "Track your progress over time with detailed charts and metrics." },
              { icon: Target, title: "Skill Gap Detection", desc: "Identify exactly which topics you need to study before the real thing." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 bg-primary/[0.02] border-y border-white/40">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-heading font-bold mb-20">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -translate-y-1/2 z-0" />
              
              {[
                { step: "01", title: "Choose Role", desc: "Select your target role and company. We tailor the interview questions specifically for it." },
                { step: "02", title: "Start Interview", desc: "Engage in a live, conversational interview with our AI agent." },
                { step: "03", title: "Get Feedback", desc: "Review your detailed analytics, scorecards, and action items." }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-2xl font-bold text-primary mb-6 border-4 border-background">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading font-bold mb-6">Simple, Transparent Pricing</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Free */}
            <Card className="glass-card border-none bg-white/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 2 Mock Interviews</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Basic Feedback</li>
                </ul>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="glass-card border-primary/50 shadow-2xl relative transform md:scale-105 bg-white/80 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Most Popular
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-2 text-primary">Pro</h3>
                <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-foreground font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Interviews</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Detailed Analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Custom Roles & Companies</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Video Recording</li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 glow-effect text-white">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="glass-card border-none bg-white/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-6">Custom</div>
                <ul className="space-y-4 mb-8 text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Team Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> API Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Dedicated Support</li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-lg border-t border-white/40 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary text-white font-bold text-xs flex items-center justify-center">I</div>
              <span className="font-heading font-bold text-lg">InterXAI</span>
            </div>
            <p className="text-sm text-muted-foreground">The futuristic AI platform to master your next interview.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Community</Link></li>
              <li><Link href="#">Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-black/5 text-center text-sm text-muted-foreground">
          © 2026 InterXAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
