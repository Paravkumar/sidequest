"use client";

import Link from "next/link";
import Image from "next/image"; // <--- Added Image Import
import { motion } from "framer-motion";
import logo from "@/app/icon.png";
import { ArrowRight, CheckCircle, Wallet, Shield, Zap, Gift, MapPin } from "lucide-react";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-[100svh] bg-slate-950 text-white font-sans selection:bg-violet-500/30"
    >
      
      {/* NAVBAR */}
      <motion.nav variants={item} className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight leading-none">
            {/* --- UPDATED LOGO HERE --- */}
            <div className="relative h-9 w-9 rounded-lg overflow-hidden">
                <Image 
                    src={logo}
                    alt="SideQuest Logo" 
                    fill
                    className="object-contain"
                />
            </div>
            {/* ------------------------- */}
            <span>SideQuest</span>
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition">Login</Link>
            </motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login?mode=signup" className="px-4 py-2 rounded-lg bg-white text-slate-950 text-sm font-bold hover:bg-slate-200 transition">Get Started</Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100svh-64px)]">
        
        {/* LEFT: TEXT CONTENT */}
        <motion.div variants={item} className="space-y-8">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wide">
            <Zap className="h-3 w-3" /> Live at IIT Delhi & 5+ Campuses
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Student Earning</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Stop being broke. SideQuest connects you with peers who need help. 
            Complete simple tasks, run errands, and solve problems to earn instant cash.
            <br/>Your campus. Your economy.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login?mode=signup" className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg shadow-xl shadow-violet-500/20 transition flex items-center justify-center gap-2 group">
                Start Earning Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link href="/how-it-works" className="px-8 py-4 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold text-lg transition flex items-center justify-center">
                How it Works
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="pt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Verified Students</span>
            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Instant Payment</span>
          </motion.div>
        </motion.div>

        {/* RIGHT: VISUAL DEMO (FLOATING CARDS) */}
        <motion.div variants={item} className="relative h-[500px] w-full hidden lg:block">
            {/* Background Glow */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px]"
            ></motion.div>

            {/* CARD 1: The 'Earning' Card */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="absolute top-10 right-10 w-72 bg-slate-900/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl animate-float-slow z-10"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Wallet className="h-5 w-5" /></div>
                        <div>
                            <h4 className="font-bold text-white">Payment Received</h4>
                            <p className="text-xs text-slate-400">Just now</p>
                        </div>
                    </div>
                    <span className="text-emerald-400 font-bold">+ ₹15</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Quest: "Submit Assignment"</p>
            </motion.div>

            {/* CARD 2: The 'Quest' Card */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="absolute bottom-16 left-10 w-80 bg-slate-900/90 backdrop-blur-md border border-violet-500/30 p-5 rounded-2xl shadow-2xl animate-float-delayed"
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">OPEN QUEST</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" /> D11 Jwalamukhi</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">submit assignment</h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">take assignment from me and deliver to LHC's chem lab</p>
                
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
                        <Wallet className="h-4 w-4" /> ₹15
                    </div>
                    <div className="flex items-center gap-2 text-fuchsia-400 font-bold bg-fuchsia-500/10 px-3 py-1.5 rounded-lg border border-fuchsia-500/20 w-fit">
                        <Gift className="h-4 w-4" /> milky bar
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center hover:scale-110 transition shadow-lg shadow-violet-500/20">
                        <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                </div>
            </motion.div>

             {/* CARD 3: The 'Safety' Card */}
             <motion.div
               whileHover={{ y: -4, scale: 1.01 }}
               transition={{ type: "spring", stiffness: 180, damping: 18 }}
               className="absolute top-40 left-0 w-60 bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-float-slower -z-10 opacity-60 scale-90"
             >
                <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-slate-400" />
                    <div>
                        <h4 className="font-bold text-slate-200">Campus Only</h4>
                        <p className="text-xs text-slate-500">Verified emails required</p>
                    </div>
                </div>
            </motion.div>

          </motion.div>
      </main>

      {/* VALUE GRID */}
      <motion.section variants={item} className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified-Only Campus</h3>
            <p className="text-sm text-slate-400 mt-2">Your college email unlocks a trusted, student-only marketplace.</p>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Rewards</h3>
            <p className="text-sm text-slate-400 mt-2">Complete quick tasks and get paid fast in cash or loot.</p>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <div className="h-10 w-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-4">
              <Gift className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Small Tasks, Big Wins</h3>
            <p className="text-sm text-slate-400 mt-2">From errands to fixes, every quest turns time into value.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* HOW IT WORKS STRIP */}
      <motion.section variants={item} className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-2">Step 1</div>
            <h4 className="text-xl font-bold text-white">Verify & Join</h4>
            <p className="text-sm text-slate-400 mt-2">Sign up with your campus email and OTP verification.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Step 2</div>
            <h4 className="text-xl font-bold text-white">Browse Quests</h4>
            <p className="text-sm text-slate-400 mt-2">See live quests around you in your college community.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
            <div className="text-xs uppercase tracking-widest text-fuchsia-400 font-bold mb-2">Step 3</div>
            <h4 className="text-xl font-bold text-white">Accept & Earn</h4>
            <p className="text-sm text-slate-400 mt-2">Chat, complete, and collect rewards instantly.</p>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section variants={item} className="px-6 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Turn your campus into your economy</h2>
          <p className="text-slate-300 mt-3">Earn, help, and build trust with every quest.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/login?mode=signup" className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition">
              Get Started
            </Link>
            <Link href="/how-it-works" className="px-6 py-3 rounded-xl bg-slate-900 border border-white/10 text-white hover:bg-slate-800 transition">
              Learn More
            </Link>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer variants={item} className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>&copy; 2026 SideQuest. Built for students, by students.</p>
      </motion.footer>
      
      {/* CSS for floating animations */}
      <style jsx global>{`
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 1s; }
        .animate-float-slower { animation: float 8s ease-in-out infinite 0.5s; }
      `}</style>
    </motion.div>
  );
}