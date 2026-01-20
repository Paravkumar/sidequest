"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/app/icon.png";
import { Search, MapPin, CheckCircle, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";

const COLLEGES = ["IIT Delhi"];

export default function SelectCollege() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

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
      if (res.ok) {
        await update();
        router.replace("/dashboard");
      }
    } catch (error) { setIsLoading(false); }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-[100svh] bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-white"
    >
      <motion.div variants={item} className="text-center mb-8">
        <div className="mx-auto mb-4 h-12 w-12 rounded-xl overflow-hidden">
          <Image src={logo} alt="SideQuest Logo" width={48} height={48} className="object-contain" />
        </div>
        <h1 className="text-3xl font-bold">Find Your Campus</h1>
        <p className="text-slate-400 mt-2">Where will you be questing today?</p>
      </motion.div>

      <motion.div variants={item} className="w-full max-w-md relative mb-6">
        <div className="absolute left-4 top-3.5 text-slate-500"><Search className="h-5 w-5" /></div>
        <input type="text" placeholder="Search your college..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-full py-3.5 pl-12 pr-6 text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-xl" />
      </motion.div>

      <motion.div variants={item} className="w-full max-w-md h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {filteredColleges.map((college) => (
            <motion.button
              key={college}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(college); setIsPopupOpen(true); }}
              className="w-full text-left p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-violet-600/20 hover:border-violet-500/50 transition group flex items-center justify-between"
            >
              <span className="group-hover:text-violet-200 transition font-medium">{college}</span>
              <MapPin className="h-4 w-4 text-slate-600 group-hover:text-violet-400" />
            </motion.button>
        ))}
        {filteredColleges.length === 0 && <div className="text-center text-slate-500 py-8">No colleges found.</div>}
      </motion.div>

      {/* MOVED OUTSIDE THE LIST */}
      <motion.div variants={item} className="mt-4 text-center">
         <p className="text-slate-500 text-sm">Can't find your college?</p>
         <a href="mailto:admin@sidequest.com" className="text-violet-400 text-sm font-bold hover:underline">Contact administrator to add your college.</a>
      </motion.div>

      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
                <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="h-6 w-6 text-emerald-400" /></div>
                <h3 className="text-xl font-bold mb-2">Confirm Selection</h3>
                <p className="text-slate-400 mb-6">You are joining <br/> <span className="text-white font-bold">{selected}</span></p>
                <div className="flex gap-3">
                    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => setIsPopupOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold transition">Back</motion.button>
                    <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={handleConfirm} disabled={isLoading} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold transition flex items-center justify-center">{isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}</motion.button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}