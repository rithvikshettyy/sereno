"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Users, 
  FileSearch, 
  History, 
  Star,
  Globe,
  Award,
  CircleDot
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsStats {
  total_offices: number;
  total_feedback: number;
  average_rating: number;
  topOffices?: Array<{ name: string; count: number; avgRating: number }>;
  languages?: Array<{ name: string; value: number }>;
  helpdesk?: Array<{ name: string; value: number }>;
}

export default function Analytics() {
  const [stats, setStats] = useState<AnalyticsStats>({ 
    total_offices: 0, 
    total_feedback: 0, 
    average_rating: 0,
    topOffices: [],
    languages: [],
    helpdesk: []
  });

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setStats((prev) => ({ ...prev, ...(d.data || {}) })));
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Reused from Dashboard */}
      <aside className="w-80 border-r border-border/40 bg-white/50 backdrop-blur-md flex flex-col fixed inset-y-0">
        <div className="p-10 border-b border-border/40">
           <Link href="/" className="flex items-center gap-3 decoration-transparent">
              <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black shadow-lg">S</div>
              <span className="font-heading text-2xl font-black text-black">Sereno</span>
           </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-6 py-4 text-muted-foreground hover:bg-slate-100/50 rounded-2xl text-sm font-bold transition-all">
                <Activity className="w-5 h-5" /> Audit Console
            </Link>
            <Link href="/admin/offices" className="flex items-center gap-3 px-6 py-4 text-muted-foreground hover:bg-slate-100/50 rounded-2xl text-sm font-bold transition-all">
                <Users className="w-5 h-5" /> Node Network
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 transition-all">
                <FileSearch className="w-5 h-5" /> Analytics
            </Link>
        </nav>

        <div className="p-8 border-t border-border/40 space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">System Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-bold">Processing Data</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-80">
        <header className="h-24 border-b border-border/40 flex items-center justify-between px-12 bg-white/30 backdrop-blur-md sticky top-0 z-50">
            <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <FileSearch className="w-5 h-5 text-muted-foreground" /> Analytics Terminal
                </h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol Intelligence & Metrics</p>
            </div>
        </header>

        <section className="p-12 space-y-12">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Total Network Nodes", value: stats.total_offices, icon: Users, color: "text-blue-600" },
                { label: "Feedback Signals", value: stats.total_feedback, icon: History, color: "text-purple-600" },
                { label: "Protocol Satisfaction", value: `${(stats.average_rating || 0).toFixed(1)} / 5.0`, icon: Star, color: "text-amber-500" },
              ].map((s, i) => (
                <div key={i} className="glass-panel p-10 rounded-[2.5rem] border border-border/40 group hover:border-black/10 transition-all duration-500 bg-white/40">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform duration-500`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                      <h3 className="text-4xl font-black tracking-tighter">{s.value}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Language Density */}
                <div className="glass-panel p-10 rounded-[2.5rem] bg-white/40 border border-border/40">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black">Linguistic Distribution</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol communication mix</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {stats.languages?.map((l, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end px-2">
                                    <span className="text-sm font-black">{l.name}</span>
                                    <span className="text-xs font-bold text-muted-foreground">{l.value} messages</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-black rounded-full transition-all duration-1000`} 
                                        style={{ width: `${(l.value / (stats.total_feedback || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing Nodes */}
                <div className="glass-panel p-10 rounded-[2.5rem] bg-white/40 border border-border/40">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black">Elite Nodes</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top interactive locations</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {stats.topOffices?.map((o, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border font-black text-xs">0{i+1}</div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black">{o.name}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{o.count} interactions</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full font-black text-[10px]">
                                    {o.avgRating} <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                            </div>
                        ))}
                        {(!stats.topOffices || stats.topOffices.length === 0) && (
                            <div className="py-20 text-center space-y-3">
                                <CircleDot className="w-8 h-8 text-slate-200 mx-auto" />
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Awaiting field data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
