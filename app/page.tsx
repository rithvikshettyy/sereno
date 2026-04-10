import Link from "next/link";
import { 
  Building2, 
  MessageSquare, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe2,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { Office } from "@/models/Office";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Sereno — Citizen Feedback Protocol",
  description: "Bridges the gap between citizens and governance through conversational WhatsApp AI.",
};

export default async function Home() {
  await connectDB();
  const offices = await Office.find({}).sort({ created_at: -1 });

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Bespoke Header */}
      <nav className="fixed top-0 w-full z-[100] bg-background/95 backdrop-blur-xl border-b border-border/40 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-sereno transition-transform group-hover:scale-110">
            S
          </div>
          <span className="font-heading text-2xl font-black tracking-tighter">Sereno</span>
        </div>
        <div className="hidden md:flex items-center gap-12">
          <Link href="#vision" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Vision</Link>
          <Link href="#nodes" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all">Network</Link>
          <Button asChild variant="ghost" className="text-sm font-bold rounded-xl h-10 px-6 -ml-4">
            <Link href="/admin">Portal</Link>
          </Button>
          <Button asChild className="rounded-xl h-11 px-8 font-bold shadow-sereno hover:shadow-sereno-deep transition-all">
            <Link href="/admin/offices">Register Node</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative pt-44 pb-32 overflow-hidden px-6" id="vision">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/[0.03] to-transparent -z-10" />
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-6xl md:text-8xl font-black font-heading leading-[0.9] tracking-tighter mb-8 text-balance">
              The Protocol for <span className="gradient-text">Human</span> Governance.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Sereno transforms citizen feedback into real-time governance data through a seamless, conversational WhatsApp bridge.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              <Button size="lg" className="h-16 px-12 rounded-[1.25rem] text-lg font-black shadow-sereno-deep hover:-translate-y-1 transition-all group" asChild>
                <Link href="/admin/offices">
                  Activate Node
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-[1.25rem] border-2 font-bold hover:bg-secondary transition-all" asChild>
                <Link href="/admin">System Logs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-border/40">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[650px]">
              <div className="md:col-span-8 glass-panel p-12 rounded-[3.5rem] shadow-sereno border-white/50 relative overflow-hidden group">
                 <div className="relative z-10 max-w-sm">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-8 border border-indigo-100">
                       <TrendingUp className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-4xl font-black font-heading tracking-tight mb-6">Real-time Citizen Analytics</h3>
                    <p className="text-muted-foreground font-semibold text-lg leading-relaxed">Monitor public sentiment with millisecond latency. Every WhatsApp interaction is synthesized into actionable executive dashboards.</p>
                 </div>
                 <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-primary/[0.03] rounded-full group-hover:scale-110 transition-transform duration-1000" />
              </div>

              <div className="md:col-span-4 bg-primary p-12 rounded-[3.5rem] shadow-sereno flex flex-col justify-end relative overflow-hidden group">
                 <Globe2 className="w-32 h-32 absolute -top-8 -right-8 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-1000" />
                 <h3 className="text-3xl font-black font-heading text-white tracking-tight leading-[1] mb-4">Trilingual Integration.</h3>
                 <p className="text-primary-foreground/80 font-bold leading-tight">Marathi, Hindi, and English. Designed for the diverse pulse of the nation.</p>
              </div>

              <div className="md:col-span-4 glass-panel p-10 rounded-[3.5rem] shadow-sereno flex flex-col justify-center border-border/80">
                 <MessageSquare className="w-12 h-12 text-primary mb-8" />
                 <h3 className="text-2xl font-black font-heading tracking-tight mb-4">WhatsApp-First Architecture</h3>
                 <p className="text-muted-foreground font-bold leading-relaxed">Lowering the friction of participation to zero. If they can text, they can contribute.</p>
              </div>

              <div className="md:col-span-8 glass-panel p-10 rounded-[3.5rem] shadow-sereno flex items-center gap-12 border-border/80 border-white/50 group">
                 <div className="flex-1">
                    <h3 className="text-2xl font-black font-heading tracking-tight mb-4">Cryptographic Integrity</h3>
                    <p className="text-muted-foreground font-bold leading-relaxed">Every audit trail is protected. Citizen privacy is not a feature; it is the foundation of the protocol.</p>
                 </div>
                 <div className="hidden lg:block w-40 h-40 bg-slate-50 flex-none rounded-full border border-border flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                    <ShieldCheck className="w-16 h-16 text-primary flex-none" strokeWidth={2.5} />
                 </div>
              </div>
           </div>
        </section>

        {/* Global Node Network */}
        <section className="py-32 px-6 bg-secondary/20" id="nodes">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 text-balance">
                 <div className="max-w-2xl">
                    <Badge className="bg-primary text-white font-black mb-4 px-4 py-1.5 rounded-lg text-[10px] tracking-widest uppercase">Live Network</Badge>
                    <h2 className="text-5xl font-black font-heading tracking-tighter leading-[0.95]">Join the Global Network of Modern Nodes.</h2>
                 </div>
                 <p className="text-lg text-muted-foreground font-bold max-w-sm leading-tight">Scan a node below to experience the protocol bridge in real-time.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {offices.length === 0 ? (
                   <div className="col-span-full py-32 rounded-[3.5rem] border-4 border-dashed border-border/50 text-center">
                      <Zap className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                      <p className="text-xl font-bold text-muted-foreground">No nodes activated on this spectrum.</p>
                      <Link href="/admin/offices" className="mt-6 inline-flex text-primary font-black hover:underline">Register your first node <ChevronRight className="w-5 h-5 ml-1" /></Link>
                   </div>
                 ) : (
                   offices.map((office) => (
                     <div key={office.office_id} className="group hover-lift glass-panel p-8 rounded-[3.5rem] shadow-sereno border-white/50 flex flex-col items-center text-center">
                        <div className="w-full aspect-square bg-white rounded-[2.5rem] border border-border/50 mb-8 p-6 flex items-center justify-center transition-all group-hover:p-4 group-hover:bg-primary/5">
                           <img 
                              src={`/api/offices/${office.office_id}/qr?format=png`} 
                              alt={office.name} 
                              className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700" 
                           />
                        </div>
                        <Badge variant="outline" className="mb-4 font-mono font-bold text-[10px] uppercase border-primary/20 text-primary">NODE: {office.office_id}</Badge>
                        <h3 className="text-2xl font-black mb-1 font-heading tracking-tight">{office.name}</h3>
                        <p className="text-muted-foreground font-bold text-sm mb-8">{office.location}</p>
                        
                        <div className="flex w-full gap-3 mt-auto">
                           <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold" asChild>
                              <a href={`/api/offices/${office.office_id}/qr?format=png`} target="_blank">PNG</a>
                           </Button>
                           <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold" asChild>
                              <a href={`/api/offices/${office.office_id}/qr?format=svg`} target="_blank">SVG</a>
                           </Button>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </section>
      </main>

      {/* Bespoke AI-Avoidance Footer */}
      <footer className="border-t border-border/40 py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
           <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black">S</div>
                <span className="font-heading text-2xl font-black tracking-tighter text-foreground">Sereno</span>
              </div>
              <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-8">Empowering citizens through transparent governance protocols. Built with purpose, engineered for humans.</p>
              <div className="flex gap-4">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-xl bg-secondary/50 border border-border" />)}
              </div>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Protocol</p>
                 <ul className="space-y-3">
                    <li><Link href="/admin" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">Console</Link></li>
                    <li><Link href="/admin/offices" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">Registry</Link></li>
                    <li><Link href="/admin/analytics" className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">Network Metrics</Link></li>
                 </ul>
              </div>
              <div className="space-y-6">
                 <p className="text-[11px] font-black text-foreground uppercase tracking-widest">Company</p>
                 <ul className="space-y-3">
                    <li><button className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">About Vision</button></li>
                    <li><button className="text-sm font-bold text-muted-foreground hover:text-primary transition-all">Terms of GOV</button></li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-border/40 flex justify-between items-center bg-background">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">© 2026 SERENO PROTOCOL — TOWARDS TRUE TRANSPARENCY</p>
            <div className="flex gap-4 opacity-30">
               <ShieldCheck className="w-5 h-5" />
               <Zap className="w-5 h-5" />
            </div>
        </div>
      </footer>
    </div>
  );
}
