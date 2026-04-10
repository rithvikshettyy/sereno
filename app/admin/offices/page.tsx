"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Trash2,
  MapPin,
  QrCode,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Office {
  _id: string;
  office_id: string;
  name: string;
  location: string;
  created_at: string;
}

export default function OfficeManagement() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newOffice, setNewOffice] = useState({
    office_id: "",
    name: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/offices");
      const data = await res.json();
      setOffices(data.data || []);
    } catch (e) {
      console.error("Failed to fetch offices", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handleAddOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffice),
      });
      if (!res.ok) throw new Error("Failed to add office");
      setIsAddOpen(false);
      setNewOffice({ office_id: "", name: "", location: "" });
      fetchOffices();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (officeId: string) => {
    if (!confirm("Are you sure? This will disable QR codes for this node.")) return;
    try {
      await fetch(`/api/offices/${officeId}`, { method: "DELETE" });
      fetchOffices();
    } catch (e) {
      alert("Failed to delete office");
    }
  };

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
          <Link href="/admin/offices" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary/5 text-primary font-bold shadow-sm transition-all">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-24 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-foreground">Office Master</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Node & Identity Management</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-8 rounded-2xl font-black shadow-sereno hover:shadow-sereno-deep transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Register New Node
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border rounded-[3rem] p-0 overflow-hidden shadow-sereno-deep shadow-2xl">
              <DialogHeader className="p-10 bg-secondary/30 border-b border-border">
                <DialogTitle className="text-3xl font-black font-heading tracking-tighter">New Registry Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddOffice} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">System Identifier</p>
                     <Input
                      required
                      placeholder="node-central-001"
                      value={newOffice.office_id}
                      onChange={(e) => setNewOffice({ ...newOffice, office_id: e.target.value })}
                      className="bg-secondary/20 border-border rounded-xl font-mono text-sm h-12 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Official Office Name</p>
                     <Input
                      required
                      placeholder="Pune Municipal Head Office"
                      value={newOffice.name}
                      onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                      className="bg-secondary/20 border-border rounded-xl font-bold h-12 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Geographic Location</p>
                     <Input
                      placeholder="Pune, Maharashtra"
                      value={newOffice.location}
                      onChange={(e) => setNewOffice({ ...newOffice, location: e.target.value })}
                      className="bg-secondary/20 border-border rounded-xl font-medium h-12 px-4"
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-xl flex-1 font-bold h-12"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl flex-1 font-black h-12 group"
                  >
                    {isSubmitting ? "Processing..." : "Authorize Node"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
           <Card className="bg-card rounded-[2.5rem] shadow-sereno border border-border overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-b border-border">
                    <TableHead className="py-6 px-10 font-black text-[10px] uppercase tracking-widest text-foreground">Identifier</TableHead>
                    <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-foreground">Office Profile</TableHead>
                    <TableHead className="py-6 font-black text-[10px] uppercase tracking-widest text-foreground">Location</TableHead>
                    <TableHead className="py-6 px-10 font-black text-[10px] uppercase tracking-widest text-foreground text-right">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-24 text-muted-foreground animate-pulse font-bold tracking-widest">SYNCHRONIZING NETWORK...</TableCell>
                    </TableRow>
                  ) : offices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-32">
                         <Building2 className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
                         <p className="text-muted-foreground font-black text-xl">No active nodes registered.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    offices.map((office) => (
                      <TableRow key={office._id} className="group hover:bg-secondary/10 transition-colors border-b border-border/50">
                        <TableCell className="py-6 px-10">
                           <Badge variant="outline" className="font-mono text-[10px] font-black border-primary/20 text-primary uppercase bg-primary/5 py-1 px-3 rounded-lg leading-none">{office.office_id}</Badge>
                        </TableCell>
                        <TableCell className="py-6">
                           <div className="font-black text-base text-foreground tracking-tight group-hover:text-primary transition-colors">{office.name}</div>
                        </TableCell>
                        <TableCell className="py-6">
                           <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                              <MapPin className="w-4 h-4 text-primary/40" />
                              {office.location}
                           </div>
                        </TableCell>
                        <TableCell className="py-6 px-10 text-right">
                          <div className="flex items-center justify-end gap-3">
                             <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="rounded-xl border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-black h-10 px-5"
                            >
                              <a href={`/api/offices/${office.office_id}/qr?format=png`} target="_blank">
                                <QrCode className="w-4 h-4 mr-2" />
                                Entry QR
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(office.office_id)}
                              className="w-10 h-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
