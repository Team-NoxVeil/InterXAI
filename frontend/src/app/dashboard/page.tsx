"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, TrendingUp, Clock, CheckCircle2, Star, Video, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-muted-foreground">You're making great progress! Keep it up.</p>
        </div>
        <Link href="/dashboard/interview">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 glow-effect rounded-full px-6 h-12">
            <Play className="w-4 h-4 mr-2 fill-white" />
            New Mock Interview
          </Button>
        </Link>
      </div>

      {/* Stats Widgets */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { title: "Interviews Taken", value: "12", icon: Video, color: "text-blue-500", bg: "bg-blue-100" },
          { title: "Avg Confidence Score", value: "88%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
          { title: "Skills Improved", value: "8", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-100" },
          { title: "User Rating", value: "4.8", icon: Star, color: "text-yellow-500", bg: "bg-yellow-100" }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="glass-card border-none bg-white/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold font-heading mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.title}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Interview Card */}
          <motion.div variants={item}>
            <Card className="glass-card border-primary/20 bg-gradient-to-br from-white/80 to-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="w-40 h-40" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                      <Clock className="w-3 h-3" /> In Progress
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Senior Frontend Engineer</h2>
                    <p className="text-muted-foreground">Google • React, System Design, Algorithms</p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Progress</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-black/5" />
                </div>
                <div className="flex gap-4">
                  <Link href="/dashboard/interview">
                    <Button className="bg-primary hover:bg-primary/90 text-white glow-effect rounded-full px-8">
                      Resume Session
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-full px-6 bg-white/50">
                    Review Previous Answers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Interviews */}
          <motion.div variants={item}>
            <h3 className="text-lg font-bold mb-4">Recent Interviews</h3>
            <div className="space-y-4">
              {[
                { role: "Fullstack Developer", company: "Stripe", score: 92, date: "2 days ago" },
                { role: "React Engineer", company: "Meta", score: 85, date: "1 week ago" },
              ].map((interview, i) => (
                <Card key={i} className="glass-card bg-white/40 hover:bg-white/60 transition-colors border-none cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-border">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-bold">{interview.role}</h4>
                        <p className="text-sm text-muted-foreground">{interview.company} • {interview.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{interview.score}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Score</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Calendar Widget placeholder */}
          <motion.div variants={item}>
            <Card className="glass-card border-none bg-white/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold text-sm">System Design Mock</p>
                      <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                    <div>
                      <p className="font-semibold text-sm">Review React Concepts</p>
                      <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass-card border-none bg-white/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recommended Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-sm mb-1 text-primary">Advanced React Hooks</h4>
                    <p className="text-xs text-muted-foreground">Based on your recent struggles with useEffect</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                    <h4 className="font-semibold text-sm mb-1 text-primary">System Design Basics</h4>
                    <p className="text-xs text-muted-foreground">Preparation for your upcoming goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
