"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Lightbulb, Pause, Square, MessageSquare, Target } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function InterviewPage() {
  const [isRecording, setIsRecording] = useState(false);
  
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Senior Frontend Engineer Mock</h1>
          <p className="text-sm text-muted-foreground">React, System Design, Algorithms</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold">Progress: 4/10 Questions</div>
            <Progress value={40} className="h-2 w-32 mt-1" />
          </div>
          <Button variant="outline" className="bg-white/50 text-destructive border-destructive/20 hover:bg-destructive/10">
            End Session
          </Button>
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6">
        {/* Main Interface */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* AI Avatar & Video Area */}
          <Card className="glass-card flex-1 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            
            <CardContent className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
              {/* AI Avatar */}
              <div className="relative mb-8">
                <motion.div
                  animate={isRecording ? {} : {
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                />
                <Avatar className="w-32 h-32 border-4 border-white shadow-2xl relative z-10">
                  <AvatarImage src="https://i.pravatar.cc/150?u=interxai-ai" />
                  <AvatarFallback className="bg-primary text-white text-3xl">AI</AvatarFallback>
                </Avatar>
                
                {/* Speaking Indicator */}
                {!isRecording && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary shadow-md flex items-center gap-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Speaking...
                  </motion.div>
                )}
              </div>

              {/* Current Question */}
              <div className="text-center max-w-lg mb-8">
                <h3 className="text-2xl font-bold mb-4 text-foreground leading-tight">
                  "Can you explain the differences between React Server Components and traditional client-side components?"
                </h3>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">React</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Architecture</span>
                </div>
              </div>

              {/* Waveform / Controls */}
              <div className="mt-auto flex flex-col items-center w-full">
                {/* Waveform Visualization */}
                <div className="h-16 flex items-center gap-1 mb-8 opacity-80">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isRecording 
                          ? ["20%", "80%", "40%", "100%", "20%"][Math.floor(Math.random() * 5)]
                          : "20%"
                      }}
                      transition={{ 
                        duration: isRecording ? 0.2 : 2, 
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className={`w-1.5 rounded-full ${isRecording ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 bg-white/80 p-2 rounded-full shadow-lg border border-white/40">
                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Pause className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-16 h-16 rounded-full shadow-xl transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                        : 'bg-primary hover:bg-primary/90 shadow-primary/30 glow-effect'
                    }`}
                  >
                    {isRecording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </Button>

                  <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                    <Lightbulb className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Transcription */}
        <div className="flex flex-col gap-6">
          <Card className="glass-card flex-1 bg-white/60 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-white/40 backdrop-blur-md font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Live Transcript
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              <div className="bg-primary/5 rounded-2xl rounded-tl-none p-4 w-[85%] border border-primary/10">
                <p className="text-foreground">Let's move on to the next topic. Can you explain the differences between React Server Components and traditional client-side components?</p>
              </div>
              
              {isRecording && (
                <div className="bg-white rounded-2xl rounded-tr-none p-4 w-[85%] ml-auto border border-border shadow-sm">
                  <p className="text-muted-foreground">
                    <span className="animate-pulse">I think the main difference is that Server Components execute...</span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass-card bg-white/60">
            <div className="p-4 border-b border-border bg-white/40 backdrop-blur-md font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Evaluation Criteria
            </div>
            <div className="p-4 space-y-3">
              {[
                "Understanding of execution context",
                "Bundle size implications",
                "Data fetching patterns",
                "Clarity of explanation"
              ].map((criteria, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                  <span className="text-muted-foreground">{criteria}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
