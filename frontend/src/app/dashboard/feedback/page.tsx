"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Code, 
  MessageSquare, 
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play
} from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-3">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Senior Frontend Engineer Mock</h1>
          <p className="text-muted-foreground">Conducted on Oct 24, 2026 • 45 minutes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Overall Score */}
        <Card className="glass-card bg-gradient-to-br from-primary to-accent text-white border-none lg:col-span-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-32 h-32" />
          </div>
          <CardContent className="p-8 text-center relative z-10 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6 text-white/90">Overall Score</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              {/* Circular Progress Simulation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke="white" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="25.12" 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-heading font-bold">90</span>
                <span className="text-sm font-medium text-white/80">/ 100</span>
              </div>
            </div>

            <p className="text-lg font-medium">Excellent Performance</p>
            <p className="text-sm text-white/80 mt-2">You outperformed 85% of candidates for this role.</p>
          </CardContent>
        </Card>

        {/* Detailed Scores */}
        <Card className="glass-card bg-white/60 lg:col-span-2 border-none">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <Code className="w-4 h-4 text-primary" /> Technical Skills
                  </div>
                  <span className="font-bold">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Communication
                  </div>
                  <span className="font-bold">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <BrainCircuit className="w-4 h-4 text-purple-500" /> Problem Solving
                  </div>
                  <span className="font-bold">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <Target className="w-4 h-4 text-orange-500" /> System Design
                  </div>
                  <span className="font-bold">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-md p-1">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="transcript">Transcript & Feedback</TabsTrigger>
          <TabsTrigger value="action">Action Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6 grid md:grid-cols-2 gap-8">
          <Card className="glass-card bg-green-50/50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Top Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                <h4 className="font-bold mb-1">React Hooks Depth</h4>
                <p className="text-sm text-muted-foreground">You demonstrated a deep understanding of custom hooks and the dependency array in useEffect.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                <h4 className="font-bold mb-1">Clear Communication</h4>
                <p className="text-sm text-muted-foreground">You structured your answers well using the STAR method, making it easy to follow your logic.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-orange-50/50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                <h4 className="font-bold mb-1">System Design Scalability</h4>
                <p className="text-sm text-muted-foreground">You missed discussing caching strategies when designing the news feed component.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                <h4 className="font-bold mb-1">State Management Trade-offs</h4>
                <p className="text-sm text-muted-foreground">When asked about Redux vs Context, your answer was a bit surface level.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action" className="mt-6">
          <Card className="glass-card bg-white/60 border-none">
            <CardHeader>
              <CardTitle>Recommended Learning Paths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Advanced System Design for Frontend", time: "2 hours", type: "Course" },
                { title: "React Performance Optimization Techniques", time: "45 mins", type: "Article" },
                { title: "State Management Patterns in 2026", time: "1.5 hours", type: "Video" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Play className="w-4 h-4 fill-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center">{item.time}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
