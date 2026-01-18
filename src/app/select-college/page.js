"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, MapPin, CheckCircle, Loader2, Mail } from "lucide-react";

const COLLEGES = ["IIT Delhi"];

export default function SelectCollege() {
  const { data: session } = useSession();
  
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredColleges = COLLEGES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  async function handleConfirm() {
    if (!session?.user?.id || !selected) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/set-community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, community: selected }),
      });
      if (res.ok) window.location.href = "/dashboard"; 
    } catch (error) { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-lg mb-4">SQ</div>
        <h1 className="text-3xl font-bold">Find Your Campus</h1>
        <p className="text-slate-400 mt-2">Where will you be questing today?</p>
      </div>

      <div className="w-full max-w-md relative mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="absolute left-4 top-3.5 text-slate-500"><Search className="h-5 w-5" /></div>
        <input type="text" placeholder="Search your college..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-xl" />
      </div>

      <div className="w-full max-w-md h-64 overflow-y-auto space-y-2 pr-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 custom-scrollbar">
        {filteredColleges.map((college) => (
            <button key={college} onClick={() => { setSelected(college); setIsPopupOpen(true); }} className="w-full text-left p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-violet-600/20 hover:border-violet-500/50 transition group flex items-center justify-between">
                <span className="group-hover:text-violet-200 transition font-medium">{college}</span>
                <MapPin className="h-4 w-4 text-slate-600 group-hover:text-violet-400" />
            </button>
        ))}
        {filteredColleges.length === 0 && <div className="text-center text-slate-500 py-8">No colleges found.</div>}
      </div>

      {/* MOVED OUTSIDE THE LIST */}
      <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
         <p className="text-slate-500 text-sm">Can't find your college?</p>
         <a href="mailto:admin@sidequest.com" className="text-violet-400 text-sm font-bold hover:underline">Contact administrator to add your college.</a>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="h-6 w-6 text-emerald-400" /></div>
                <h3 className="text-xl font-bold mb-2">Confirm Selection</h3>
                <p className="text-slate-400 mb-6">You are joining <br/> <span className="text-white font-bold">{selected}</span></p>
                <div className="flex gap-3">
                    <button onClick={() => setIsPopupOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold transition">Back</button>
                    <button onClick={handleConfirm} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold transition flex items-center justify-center">{isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}