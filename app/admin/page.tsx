"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Calendar,
  Building2,
  MapPin,
  TrendingUp,
  Filter,
  Search,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Star,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface MessageLog {
  _id: string;
  wa_id: string;
  office_id: string;
  office_name: string;
  language: string;
  feedback_data?: {
    visit_purpose: string;
    waiting_time: string;
    staff_behavior: string;
    cleanliness: string;
    overall_rating: number;
    additional_comments: string;
    photo_url?: string;
  };
  created_at: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<MessageLog | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setLogs(data.data || []);
    } catch (e) {
      console.error("Failed to fetch logs", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.office_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.wa_id.includes(searchTerm) ||
      (log.feedback_data?.additional_comments || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  const stats = useMemo(() => {
    const total = logs.length;
    const completed = logs.filter(l => l.feedback_data?.overall_rating).length;
    const avgRating = completed > 0 
      ? (logs.reduce((acc, l) => acc + (l.feedback_data?.overall_rating || 0), 0) / completed).toFixed(1) 
      : "0.0";
    return { total, completed, avgRating };
  }, [logs]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Bespoke Sidebar */}
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
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/5 text-primary font-bold shadow-sm transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Live Feedback
          </Link>
          <Link href="/admin/offices" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1 transition-all">
            <Building2 className="w-5 h-5" />
            Office Master
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1 transition-all">
            <TrendingUp className="w-5 h-5" />
            Performance
          </Link>
        </nav>

        <div className="p-6 border-t border-border mt-auto">
           {/* Space reserved for future admin settings or profile */}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-24 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground">Feedback Stream</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Real-time Governance Bridge</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                   placeholder="Search ID, Office or Feedback..." 
                   className="pl-10 h-11 w-80 rounded-xl bg-secondary/50 border-border focus:bg-card transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchLogs} 
                disabled={loading}
                className="h-11 w-11 rounded-xl glass-panel shadow-sm"
             >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
             </Button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full space-y-10">
           {/* Boutique Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: "Aggregate Entries", value: stats.total, icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
                { label: "Execution Multiplier", value: stats.completed, icon: Zap, color: "text-indigo-600 bg-indigo-50" },
                { label: "Protocol Satisfaction", value: stats.avgRating, icon: Star, color: "text-amber-600 bg-amber-50", suffix: "/ 5.0" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card glass-panel p-8 rounded-[2.5rem] shadow-sereno border-white/50 flex items-center justify-between group hover:shadow-sereno-deep transition-all">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5">
                       <span className="text-4xl font-black text-foreground">{stat.value}</span>
                       {stat.suffix && <span className="text-sm font-bold text-muted-foreground">{stat.suffix}</span>}
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                     <stat.icon className="w-7 h-7" />
                  </div>
                </div>
              ))}
           </div>

           {/* Feedback Table */}
           <div className="bg-card rounded-[2.5rem] shadow-sereno border border-border overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-b border-border">
                   <TableHead className="py-6 px-10 font-black text-[10px] uppercase tracking-widest text-foreground">Time Horizon</TableHead>
                   <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-foreground">Origin Node</TableHead>
                   <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-foreground text-center">Score</TableHead>
                   <TableHead className="py-6 px-10 font-black text-[10px] uppercase tracking-widest text-foreground text-right">Details</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {loading ? (
                   <TableRow><TableCell colSpan={4} className="py-32 text-center text-muted-foreground font-bold animate-pulse">Synchronizing Logs...</TableCell></TableRow>
                 ) : filteredLogs.length === 0 ? (
                   <TableRow><TableCell colSpan={4} className="py-40 text-center"><Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" /><p className="text-muted-foreground font-black">No feedback data captured in this spectrum.</p></TableCell></TableRow>
                 ) : (
                   filteredLogs.map((log) => (
                     <TableRow key={log._id} className="group hover:bg-secondary/10 transition-colors border-b border-border/50">
                       <TableCell className="py-6 px-10">
                          <div className="font-bold text-sm text-foreground">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-[10px] font-bold text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</div>
                       </TableCell>
                       <TableCell className="py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-[10px] border border-primary/10">
                                {log.office_id.slice(0,2).toUpperCase()}
                             </div>
                             <div>
                                <div className="font-black text-sm tracking-tight text-foreground">{log.office_name}</div>
                                <div className="text-[10px] font-bold text-muted-foreground font-mono">ID: {log.office_id}</div>
                             </div>
                          </div>
                       </TableCell>
                       <TableCell className="py-6 text-center">
                          {log.feedback_data?.overall_rating ? (
                             <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black px-3 py-1 rounded-lg">
                                {log.feedback_data.overall_rating} <Star className="w-3 h-3 ml-1 fill-emerald-500" />
                             </Badge>
                          ) : (
                             <Badge variant="outline" className="text-muted-foreground/40 font-bold italic border-dashed">In Progress</Badge>
                          )}
                       </TableCell>
                       <TableCell className="py-6 px-10 text-right">
                          <Button 
                             variant="ghost" 
                             onClick={() => setSelectedLog(log)}
                             className="h-10 px-6 rounded-xl font-bold bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                             Inspect Audit
                          </Button>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
           </div>
        </div>

        {/* Audit Inspect Modal */}
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="max-w-2xl bg-card border-border rounded-[3rem] p-0 overflow-hidden shadow-sereno-deep shadow-2xl">
            <DialogHeader className="p-10 bg-secondary/30 border-b border-border">
              <div className="flex justify-between items-start mb-4">
                 <Badge className="bg-primary px-3 py-1 rounded-lg font-black text-[10px] tracking-widest uppercase">Audit Trace</Badge>
              </div>
              <DialogTitle className="text-3xl font-black font-heading tracking-tighter mb-2 text-foreground">{selectedLog?.office_name}</DialogTitle>
              <DialogDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-2">
                 <Calendar className="w-3 h-3" /> Captured on {selectedLog && new Date(selectedLog.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Citizen Identifier</p>
                     <p className="font-bold font-mono text-sm text-foreground">+{selectedLog?.wa_id}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Language Core</p>
                     <p className="font-extrabold text-sm uppercase text-primary">{selectedLog?.language || "Pending"}</p>
                  </div>
               </div>

               {selectedLog?.feedback_data && (
                  <div className="bg-secondary/20 p-8 rounded-[2rem] border border-border/50 grid gap-6">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Purpose</p>
                           <p className="font-bold text-foreground leading-tight">{selectedLog.feedback_data.visit_purpose}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Response Time</p>
                           <p className="font-bold text-foreground leading-tight">{selectedLog.feedback_data.waiting_time}</p>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Detailed Commentary</p>
                        <blockquote className="italic border-l-4 border-primary pl-4 py-1 font-medium text-foreground leading-relaxed">
                           "{selectedLog.feedback_data.additional_comments || "No textual feedback provided."}"
                        </blockquote>
                     </div>
                  </div>
               )}

               {selectedLog?.feedback_data?.photo_url && (
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Evidence Snapshot</p>
                     <div className="rounded-[2rem] overflow-hidden border-2 border-border shadow-sereno group relative">
                        <img src={selectedLog.feedback_data.photo_url} alt="Feedback evidence" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ExternalLink className="w-10 h-10 text-white" />
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <DialogFooter className="p-10 bg-secondary/10 border-t border-border mt-0">
               <Button onClick={() => setSelectedLog(null)} className="rounded-2xl font-black w-full h-14 shadow-sereno group">
                  Confirm Assessment
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
