"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  MessageSquare,
  Building2,
  RefreshCw,
  Users,
  Star,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e"];

interface AnalyticsData {
  totalFeedback: number;
  totalOffices: number;
  ratings: { rating: number; count: number }[];
  languages: { name: string; value: number }[];
  helpdesk: { name: string; value: number }[];
  topOffices: { office_id: string; name: string; count: number; avgRating: number }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json.data);
    } catch (e) {
      console.error("Failed to fetch analytics", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card hidden lg:flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-sereno transition-transform group-hover:scale-105">
              S
            </div>
            <span className="font-heading text-2xl font-black tracking-tighter">Sereno Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">Operations</p>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Live Feedback
          </Link>
          <Link href="/admin/offices" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1 transition-all">
            <Building2 className="w-5 h-5" />
            Office Master
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/5 text-primary font-bold shadow-sm transition-all">
            <TrendingUp className="w-5 h-5" />
            Performance
          </Link>
        </nav>

        <div className="p-6 border-t border-border mt-auto">
           {/* Space reserved for future admin settings or profile */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-24 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground">Global Performance</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Insights & Network Analytics</p>
          </div>
          
          <Button
            variant="outline"
            onClick={fetchAnalytics}
            disabled={loading}
            className="h-11 px-6 rounded-xl border-border hover:bg-secondary font-bold shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Sync Metrics
          </Button>
        </header>

        <div className="p-10 space-y-10 max-w-7xl mx-auto w-full">
          {loading && !data ? (
            <div className="py-24 text-center">
               <RefreshCw className="w-16 h-16 text-primary animate-spin mx-auto mb-6 opacity-20" />
               <p className="font-black text-muted-foreground tracking-widest uppercase">Aggregating Citizen Pulse...</p>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Aggregate Entries", value: data?.totalFeedback || 0, icon: MessageSquare, color: "bg-blue-50 text-blue-600" },
                  { label: "Connected Nodes", value: data?.totalOffices || 0, icon: Building2, color: "bg-indigo-50 text-indigo-600" },
                  { label: "Public Satisfaction", value: (data?.ratings.reduce((acc, curr) => acc + (curr.rating * curr.count), 0) || 0) / (data?.totalFeedback || 1) > 0 
                      ? ((data?.ratings.reduce((acc, curr) => acc + (curr.rating * curr.count), 0) || 0) / (data?.totalFeedback || 1)).toFixed(1)
                      : "0.0", icon: Users, color: "bg-purple-50 text-purple-600", suffix: "/ 5.0" },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-card glass-panel border-white/50 shadow-sereno rounded-[2.5rem] relative overflow-hidden group">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-black text-foreground">{stat.value}</span>
                            {stat.suffix && <span className="text-sm font-bold text-muted-foreground">{stat.suffix}</span>}
                          </div>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12`}>
                          <stat.icon className="w-7 h-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Data Visualization Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Rating Distribution */}
                <Card className="bg-card rounded-[3rem] shadow-sereno-deep border-border overflow-hidden">
                  <CardHeader className="p-10 bg-secondary/20 border-b border-border">
                    <CardTitle className="text-xl font-black font-heading tracking-tight flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Sentiment Spectrum
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] p-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data?.ratings}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="rating" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800 }} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 800 }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[12, 12, 12, 12]} barSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Language Mix */}
                <Card className="bg-card rounded-[3rem] shadow-sereno-deep border-border overflow-hidden">
                  <CardHeader className="p-10 bg-secondary/20 border-b border-border">
                    <CardTitle className="text-xl font-black font-heading tracking-tight flex items-center gap-3">
                       <TrendingUp className="w-5 h-5 text-slate-950" /> Language Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] p-10 flex flex-col">
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data?.languages}
                            cx="50%"
                            cy="50%"
                            innerRadius={90}
                            outerRadius={130}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                          >
                            {data?.languages.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                            ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 mt-4">
                       {data?.languages.map((l, i) => (
                         <div key={l.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{l.name}</span>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Leaderboard */}
              <Card className="bg-card rounded-[3rem] shadow-sereno border border-border overflow-hidden">
                <CardHeader className="p-10 bg-secondary/20 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black font-heading tracking-tight flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" /> Node Performance Leaderboard
                  </CardTitle>
                  <Badge variant="outline" className="rounded-full border-primary/20 text-primary uppercase font-black text-[10px] px-4 py-1.5 h-auto">Network Data</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border/50 bg-secondary/5">
                          <th className="py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Constituent Office</th>
                          <th className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">Interaction Vol</th>
                          <th className="py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">Quality Factor</th>
                          <th className="py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right">Trend Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {data?.topOffices.map((office) => (
                          <tr key={office.office_id} className="hover:bg-secondary/10 transition-colors group">
                            <td className="py-8 px-10">
                               <div className="font-black text-base text-foreground group-hover:text-primary transition-colors tracking-tight leading-none mb-1.5">{office.name}</div>
                               <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">ID: {office.office_id}</div>
                            </td>
                            <td className="py-8 text-center">
                               <span className="font-extrabold text-lg text-foreground">{office.count}</span>
                               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1.5">entries</span>
                            </td>
                            <td className="py-8 text-center font-bold">
                              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-1.5 rounded-2xl border border-border shadow-sm">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-base font-black text-foreground">{office.avgRating}</span>
                              </div>
                            </td>
                            <td className="py-8 px-10 text-right">
                               <Badge variant="outline" className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-[0.1em] px-4 py-1.5 h-auto">High Velocity</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
