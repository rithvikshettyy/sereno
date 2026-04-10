"use client";
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Activity, 
  Users, 
  FileSearch, 
  PlusCircle, 
  MapPin, 
  Hash, 
  Building2,
  QrCode,
  Download
} from "lucide-react";

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState({ office_id: "", name: "", location: "" });

  const fetchOffices = () => fetch("/api/offices").then(r => r.json()).then(d => setOffices(d.data || []));
  useEffect(() => { fetchOffices(); }, []);

  const addOffice = async (e: any) => {
    e.preventDefault();
    await fetch("/api/offices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ office_id: "", name: "", location: "" });
    fetchOffices();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Reused for consistency */}
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
            <Link href="/admin/offices" className="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-2xl text-sm font-bold shadow-xl shadow-black/10 transition-all">
                <Users className="w-5 h-5" /> Node Network
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-6 py-4 text-muted-foreground hover:bg-slate-100/50 rounded-2xl text-sm font-bold transition-all">
                <FileSearch className="w-5 h-5" /> Analytics
            </Link>
        </nav>

        <div className="p-8 border-t border-border/40">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Network Health</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold">{offices.length} Nodes Active</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-80">
        <header className="h-24 border-b border-border/40 flex items-center justify-between px-12 bg-white/30 backdrop-blur-md sticky top-0 z-50">
            <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <Users className="w-5 h-5 text-muted-foreground" /> Node Network Management
                </h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Configure Infrastructure Access Points</p>
            </div>
        </header>

        <section className="p-12 space-y-12">
            {/* Registration Console */}
            <div className="glass-panel p-10 rounded-[2.5rem] bg-white/40 border border-border/40 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
                        <PlusCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-black">Register New Node</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Connect a new office to the protocol</p>
                    </div>
                </div>

                <form onSubmit={addOffice} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Protocol ID</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="e.g. MH-01" 
                            value={form.office_id} 
                            onChange={e => setForm({...form, office_id: e.target.value})} 
                            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white/50 focus:ring-black/5" 
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Node Name</label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="e.g. Collector Office" 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white/50 focus:ring-black/5" 
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Geographic Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="e.g. Pune City" 
                            value={form.location} 
                            onChange={e => setForm({...form, location: e.target.value})} 
                            className="pl-12 h-14 rounded-2xl border-slate-200 bg-white/50 focus:ring-black/5" 
                        />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="h-14 rounded-2xl bg-black text-white font-bold hover:bg-zinc-800 transition-all hover:scale-[1.02] shadow-xl shadow-black/5"
                  >
                    Authorize Node
                  </Button>
                </form>
            </div>

            {/* Nodes List */}
            <div className="glass-panel rounded-[2.5rem] shadow-sereno border border-border/40 overflow-hidden bg-white/40">
              <Table>
                <TableHeader className="bg-slate-50/50 border-b border-border/40">
                    <TableRow>
                        <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                        <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Origin ID</TableHead>
                        <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Designation</TableHead>
                        <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Provision QR</TableHead>
                        <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Location Node</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {offices.map((o: any) => (
                    <TableRow key={o._id} className="hover:bg-slate-50/50 transition-colors border-b border-border/20 last:border-0">
                      <TableCell className="px-8 py-8">
                         <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/20" />
                      </TableCell>
                      <TableCell className="px-8 py-8 font-mono text-xs font-bold text-muted-foreground">{o.office_id}</TableCell>
                      <TableCell className="px-8 py-8">
                         <span className="font-heading text-lg font-black text-black">{o.name}</span>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-center">
                         <div className="flex items-center justify-center gap-3">
                            <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold text-[10px] uppercase tracking-widest">
                                <Link href={`/api/offices/${o.office_id}/qr?format=png`} target="_blank">PNG</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold text-[10px] uppercase tracking-widest">
                                <Link href={`/api/offices/${o.office_id}/qr?format=svg`} target="_blank">SVG</Link>
                            </Button>
                         </div>
                      </TableCell>
                      <TableCell className="px-8 py-8 text-right">
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{o.location}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {offices.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="py-32 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
                           No nodes registered in the network
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </section>
      </main>
    </div>
  );
}
