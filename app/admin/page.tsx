"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  Users, 
  Activity,
  History,
  FileSearch,
  RefreshCw,
  MessageSquare,
  Image as ImageIcon,
  Clock
} from "lucide-react";
import Link from "next/link";

interface FeedbackRecord {
  _id: string;
  wa_id: string;
  office_id: string;
  office_name: string;
  language: string;
  data: {
    rating?: number;
    behavior?: string;
    suggestion?: string;
    visit: string;
    helpdesk: string;
  };
  created_at: string;
}

interface LogRecord {
  _id: string;
  wa_id: string;
  office_id: string;
  office_name: string;
  data: {
    body: string;
    msg_type: string;
    media: number;
  };
  created_at: string;
}

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Premium Sidebar */}
      <aside className="w-80 border-r border-border/40 bg-white/50 backdrop-blur-md flex flex-col fixed inset-y-0">
        <div className="p-10 border-b border-border/40">
           <Link href="/" className="flex items-center gap-3 decoration-transparent">
              <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black shadow-lg">S</div>
              <span className="font-heading text-2xl font-black text-black">Sereno</span>
           </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 transition-all">
                <Activity className="w-5 h-5" /> Audit Console
            </Link>
            <Link href="/admin/offices" className="flex items-center gap-3 px-6 py-4 text-muted-foreground hover:bg-slate-100/50 rounded-2xl text-sm font-bold transition-all">
                <Users className="w-5 h-5" /> Node Network
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-6 py-4 text-muted-foreground hover:bg-slate-100/50 rounded-2xl text-sm font-bold transition-all">
                <FileSearch className="w-5 h-5" /> Analytics
            </Link>
        </nav>

        <div className="p-8 border-t border-border/40 space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Protocol Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-bold">Live Synchronized</span>
                </div>
            </div>
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold gap-2" onClick={fetchData}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Protocol
            </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-80">
        <header className="h-24 border-b border-border/40 flex items-center justify-between px-12 bg-white/30 backdrop-blur-md sticky top-0 z-50">
            <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <Activity className="w-5 h-5 text-muted-foreground" /> Governance Dashboard
                </h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unified Feedback & Interaction Stream</p>
            </div>
        </header>

        <div className="p-12 space-y-20">
            {/* Section 1: Formalized Audits */}
            <section className="space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <Star className="w-6 h-6 text-yellow-500" /> Formalized Feedback Audits
                        </h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Confirmed citizen responses with service ratings</p>
                    </div>
                    <Badge variant="outline" className="h-8 px-4 rounded-full font-black text-[10px] uppercase tracking-widest border-slate-200">
                        {feedbacks.length} Audits
                    </Badge>
                </div>

                <div className="glass-panel rounded-[2.5rem] shadow-sereno overflow-hidden border border-border/40 bg-white/40">
                    <Table>
                        <TableHeader className="bg-slate-50/50 border-b border-border/40">
                            <TableRow>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Origin Node</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Observation</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Horizon</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feedbacks.map((f) => (
                                <TableRow key={f._id} className="hover:bg-slate-50/30 transition-colors border-b border-border/20 last:border-0">
                                    <TableCell className="px-8 py-10">
                                        <div className="flex flex-col">
                                            <span className="font-heading text-lg font-black">{f.office_name}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{f.wa_id} • {f.language}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-10">
                                        <div className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-1.5 rounded-full font-black text-sm shadow-lg shadow-black/10">
                                            {f.data.rating} <Star className="w-3.5 h-3.5 fill-current" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-10">
                                        <div className="max-w-md">
                                            <p className="text-sm font-bold text-slate-700 leading-snug">
                                                {f.data.behavior || f.data.suggestion || "No comments shared."}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Badge variant="secondary" className="bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">Visit: {f.data.visit}</Badge>
                                                <Badge variant="secondary" className="bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">Helpdesk: {f.data.helpdesk}</Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-10 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black text-black">{new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(f.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {feedbacks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-24 text-center">
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No audits formalized yet.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>

            {/* Section 2: Live Interaction Stream */}
            <section className="space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-blue-500" /> Live Interaction Stream
                        </h3>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Real-time trace of inbound citizen messages</p>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] shadow-sereno overflow-hidden border border-border/40 bg-white/40">
                    <Table>
                        <TableHeader className="bg-slate-50/50 border-b border-border/40">
                            <TableRow>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interaction Packet</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</TableHead>
                                <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((l) => (
                                <TableRow key={l._id} className="hover:bg-slate-50/30 transition-colors border-b border-border/20 last:border-0">
                                    <TableCell className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-black">{l.wa_id}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{l.office_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-8">
                                        <p className="max-w-md text-sm font-bold text-slate-600 truncate">
                                            {l.data.body || <span className="text-muted-foreground/40 italic">Interactive reply</span>}
                                        </p>
                                    </TableCell>
                                    <TableCell className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            {l.data.msg_type === 'media' && <ImageIcon className="w-3.5 h-3.5 text-blue-500" />}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${l.data.msg_type === 'text' ? 'text-slate-400' : 'text-blue-600'}`}>
                                                {l.data.msg_type}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold">{new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-24 text-center">
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Awaiting interaction packets...</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}
