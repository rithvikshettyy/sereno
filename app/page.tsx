import Link from "next/link";
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import { Office } from "@/models/Office";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  await connectDB();
  const offices = await Office.find({}).sort({ created_at: -1 });

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100">
      {/* Header Copy */}
      <nav className="h-24 px-12 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white text-xs font-black">S</div>
          <span className="text-xl font-bold tracking-tight">Sereno</span>
        </div>

        <div className="hidden md:flex items-center gap-16">
          <Link href="#vision" className="text-sm font-medium text-gray-400 hover:text-black transition-colors">Vision</Link>
          <Link href="#network" className="text-sm font-medium text-gray-400 hover:text-black transition-colors">Network</Link>
          <Link href="/admin" className="text-sm font-extrabold text-black">Portal</Link>
          <Button asChild className="bg-black hover:bg-zinc-800 text-white rounded-lg px-8 h-12 font-bold transition-all hover:scale-105 active:scale-95 ml-4">
            <Link href="/admin/offices">Register Node</Link>
          </Button>
        </div>
      </nav>

      <main className="flex flex-col items-center">
        {/* Hero Section Copy */}
        <section className="pt-40 pb-20 px-6 text-center max-w-5xl">
          <h1 className="text-[5.5rem] leading-[1.1] font-serif-heading font-medium mb-12">
            The Protocol for <br /> Human Governance.
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-16">
            Sereno transforms citizen feedback into real-time governance data<br />
            through a seamless, conversational WhatsApp bridge.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild className="bg-black hover:bg-zinc-800 text-white rounded-full px-10 h-16 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/admin" className="flex items-center gap-2">
                Activate Node <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="border border-gray-200 hover:bg-gray-50 rounded-full px-10 h-16 text-sm font-bold shadow-sm">
              <Link href="/admin">System Logs</Link>
            </Button>
          </div>
        </section>

        {/* Network section (minimal grid) */}
        <section className="w-full max-w-[1400px] px-12 py-32 border-t mt-20" id="network">
          <div className="flex justify-between items-end mb-16">
             <h2 className="text-4xl font-serif-heading">Active Nodes</h2>
             <Link href="/admin/offices" className="text-sm font-bold text-gray-400 hover:text-black hover:underline">Register New Node →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {offices.map((office) => (
              <div key={office.office_id} className="group">
                <div className="aspect-square bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-center mb-6 transition-all group-hover:shadow-xl group-hover:border-black/5">
                  <img 
                    src={`/api/offices/${office.office_id}/qr?format=png`} 
                    alt={office.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{office.name}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{office.location}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-20 px-12">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center text-gray-400">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-black/10 flex items-center justify-center text-black/40 text-[10px] font-black">S</div>
              <span className="text-sm font-bold">Sereno</span>
           </div>
           <p className="text-xs font-bold">© 2026 SERENO PROTOCOL.</p>
        </div>
      </footer>
    </div>
  );
}
