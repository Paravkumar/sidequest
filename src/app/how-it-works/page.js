"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/app/icon.png";
import { ArrowRight, UserPlus, Mail, School, Search, Sparkles, MessageSquare, CheckCircle, Wallet, Gift } from "lucide-react";

export default function HowItWorksPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
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
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight leading-none hover:opacity-80 transition">
            <div className="relative h-9 w-9 rounded-lg overflow-hidden">
              <Image src={logo} alt="SideQuest Logo" fill className="object-contain" />
            </div>
            <span>SideQuest</span>
          </Link>
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
      <section className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wide mb-6">
          <Sparkles className="h-3 w-3" /> Simple & Fast
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">SideQuest</span> Works
        </motion.h1>
        
        <motion.p variants={item} className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Earn money on campus in just a few simple steps. From signing up to getting paid, we've made it seamless.
        </motion.p>
      </section>

      {/* STEPS SECTION */}
      <section className="pb-20 px-6 max-w-5xl mx-auto">
        <div className="space-y-16">
          
          {/* STEP 1 */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-violet-400" />
                </div>
                <span className="text-sm font-bold text-violet-400 uppercase tracking-wider">Step 1</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Sign Up with Email</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Create your account using your college email. We only allow verified students to join, ensuring a safe and trusted community.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Campus-exclusive access</span>
              </div>
            </div>
            <motion.div whileHover={{ y: -6 }} className="order-1 md:order-2 bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                  <Mail className="h-5 w-5 text-violet-400" />
                  <span className="text-slate-300">student@college.edu</span>
                </div>
                <div className="h-2 w-3/4 bg-violet-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-violet-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-slate-500">Verifying your email...</p>
              </div>
            </motion.div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div whileHover={{ y: -6 }} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                  <School className="h-5 w-5 text-fuchsia-400" />
                  <span className="text-slate-300 font-medium">IIT Delhi</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-800/30 rounded-lg text-center text-xs text-slate-400 border border-white/5">IIT Bombay</div>
                  <div className="p-3 bg-slate-800/30 rounded-lg text-center text-xs text-slate-400 border border-white/5">BITS Pilani</div>
                </div>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                  <School className="h-6 w-6 text-fuchsia-400" />
                </div>
                <span className="text-sm font-bold text-fuchsia-400 uppercase tracking-wider">Step 2</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Select Your Campus</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Choose your college from our list of verified campuses. This ensures you only see quests from your community.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Hyper-local marketplace</span>
              </div>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Search className="h-6 w-6 text-amber-400" />
                </div>
                <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Step 3</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Browse Open Quests</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Explore available tasks posted by fellow students. From delivering assignments to tech help, find quests that match your skills and schedule.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Real-time feed updates</span>
              </div>
            </div>
            <motion.div whileHover={{ y: -6 }} className="order-1 md:order-2 bg-slate-900/50 border border-violet-500/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Submit Assignment</span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> ₹15
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Fix My Laptop</span>
                  <span className="text-fuchsia-400 text-sm font-bold flex items-center gap-1">
                    <Gift className="h-3 w-3" /> Pizza
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/5">
                  <span className="text-sm text-slate-300 font-medium">Get Coffee</span>
                  <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> ₹30
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* STEP 4 */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div whileHover={{ y: -6 }} className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="flex-1 p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <p className="text-sm text-slate-300">I can help with that!</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 p-3 bg-slate-800/50 rounded-lg border border-white/5 text-right">
                    <p className="text-sm text-slate-300">Great! Meet at D11?</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-xs font-bold">B</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 justify-center pt-2">
                  <CheckCircle className="h-3 w-3" />
                  <span>Quest completed!</span>
                </div>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Step 4</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Chat & Complete</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Coordinate with the quest creator via real-time chat. Once the task is done, mark it complete and receive your reward instantly.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Instant payment on completion</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA SECTION */}
      <motion.section variants={item} className="py-20 px-6 max-w-4xl mx-auto text-center">
        <motion.div whileHover={{ y: -6 }} className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-3xl p-12 backdrop-blur-md">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already turning their spare time into real cash.
          </p>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/login?mode=signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition shadow-xl">
              Get Started Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer variants={item} className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>&copy; 2026 SideQuest. Built for students, by students.</p>
      </motion.footer>
    </motion.div>
  );
}
