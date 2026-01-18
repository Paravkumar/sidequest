"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import Image from "next/image"; // <--- IMPORT ADDED
import { X, ArrowRight, Plus, Loader2, CheckCircle, Wallet, Gift, LogOut, MapPin, Phone, User, ChevronDown, ChevronUp, Lock, Globe, Home, UserCircle } from "lucide-react";
import confetti from "canvas-confetti"; 

export default function Dashboard() {
  const { data: session, status } = useSession(); 
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("feed");
  const [activeCommunity, setActiveCommunity] = useState("Loading..."); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const [feedQuests, setFeedQuests] = useState([]); 
  const [myStats, setMyStats] = useState({ posted: [], accepted: [], earnings: 0, loot: [] });
  
  const [isLoading, setIsLoading] = useState(false); 
  const [isAccepting, setIsAccepting] = useState(null); 
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",    
    phone: "",   
    cash: "",   
    loot: "",   
    slots: 1,
    description: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
        if (session.user.community) {
            setActiveCommunity(session.user.community);
        } else {
            router.push("/select-college");
        }
        
        if (session.user.phone) {
            const rawPhone = session.user.phone.replace("+91 ", "");
            setFormData(prev => ({ ...prev, phone: rawPhone }));
        }

        if(activeTab === "profile") fetchMyStats();
    }
  }, [session, activeTab]);

  useEffect(() => {
      if(session?.user?.id && activeCommunity !== "Loading...") {
          fetchFeed();
      }
  }, [activeCommunity, session]);

  async function fetchFeed() {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`/api/quests?userId=${session.user.id}&community=${encodeURIComponent(activeCommunity)}`);
      const json = await res.json();
      if (json.success) setFeedQuests(json.data);
    } catch (err) { console.error(err); }
  }

  async function fetchMyStats() {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/my-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }), 
      });
      const json = await res.json();
      if (json.success) setMyStats(json.data);
    } catch (err) { console.error(err); }
  }

  function triggerSuccessConfetti() {
    const end = Date.now() + 1000; 
    const colors = ['#8b5cf6', '#10b981', '#f59e0b']; 
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }

  async function handleAccept(questId) {
    if (!session?.user?.id) return;
    setIsAccepting(questId); 
    try {
      const res = await fetch('/api/accept-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, userId: session.user.id }),
      });
      if (res.ok) fetchFeed(); 
    } catch (error) { console.error("Network Error"); }
    setIsAccepting(null);
  }

  async function handleComplete(questId) {
    if(!confirm("Mark done & pay reward?")) return;
    try {
      const res = await fetch('/api/complete-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, userId: session.user.id }),
      });
      if (res.ok) {
        triggerSuccessConfetti();
        activeTab === "profile" ? fetchMyStats() : fetchFeed();
      }
    } catch (error) { console.error("Network Error"); }
  }

  async function handlePostQuest() {
    setFormError(""); 

    if (!formData.title.trim()) { setFormError("Title is mandatory."); return; }
    if (!formData.description.trim()) { setFormError("Description is mandatory."); return; }
    if (!formData.location.trim()) { setFormError("Location is required."); return; }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
        setFormError("Phone number must be exactly 10 digits."); 
        return; 
    }

    const cashVal = Number(formData.cash);
    if (formData.cash && (cashVal < 0 || !Number.isInteger(cashVal))) { setFormError("Money must be a positive integer."); return; }
    if (!formData.cash && !formData.loot) { setFormError("Must provide either Cash OR Loot."); return; }

    setIsLoading(true);
    try {
      const combinedContact = `${formData.location} • +91 ${formData.phone}`; 

      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...formData, 
            contact: combinedContact, 
            community: activeCommunity, 
            creator: session.user.id 
        }), 
      });
      
      if (res.ok) {
        setIsModalOpen(false); 
        setFormData(prev => ({ 
            title: "", 
            cash: "", 
            loot: "", 
            location: "", 
            phone: prev.phone, 
            slots: 1, 
            description: "" 
        })); 
        fetchFeed(); 
      } else {
        const json = await res.json();
        setFormError(json.error || "Failed to post");
      }
    } catch (error) { setFormError("Network Error"); }
    setIsLoading(false);
  }

  if (status === "loading") {
    return <div className="h-screen flex items-center justify-center bg-slate-950 text-violet-500"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      
      <aside className="hidden w-20 flex-col items-center border-r border-white/5 bg-slate-900 py-6 md:flex justify-between">
        <div>
            {/* --- UPDATED SIDEBAR LOGO --- */}
            <div className="mb-8 relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/20">
                <Image src="/icon.png" alt="SideQuest Logo" fill className="object-cover" />
            </div>
            {/* ---------------------------- */}
            
            <div className="flex flex-col gap-4">
                <button onClick={() => setActiveTab("feed")}><SidebarIcon icon={<Home className="h-6 w-6" />} active={activeTab === "feed"} /></button>
            </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col relative">
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-slate-900/50 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4 relative">
            {activeTab === "feed" ? (
                <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                    <Globe className="h-5 w-5 text-violet-400" />
                    {activeCommunity}
                </div>
            ) : <h2 className="text-lg font-bold tracking-tight">My Dashboard</h2>}

            {activeTab === "feed" && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">● LIVE</span>}
          </div>
          
          <div className="relative">
             <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-full transition">
                <span className="text-sm font-medium text-slate-400 hidden md:block">{session?.user?.name}</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-xs">
                    {session?.user?.name ? session.user.name[0] : "U"}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
             </button>

             {isProfileMenuOpen && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={() => { setActiveTab("profile"); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-white/5 text-slate-300 hover:text-white transition">
                        <UserCircle className="h-4 w-4" /> My Profile
                    </button>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-red-500/10 text-red-400 transition border-t border-white/5">
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>
                </>
             )}
          </div>
        </header>

        {activeTab === "feed" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {feedQuests.map((quest) => (
              <QuestCard key={quest._id} quest={quest} currentUserId={session?.user?.id} onAccept={handleAccept} onComplete={handleComplete} isAccepting={isAccepting} />
            ))}
            {feedQuests.length === 0 && <div className="text-center text-slate-500 mt-10">No quests yet in {activeCommunity}.<br/>Be the first to post!</div>}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 p-6">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400"><Wallet className="h-5 w-5" /><span className="font-bold text-xs tracking-wider uppercase">Cash Earned</span></div>
                    <h1 className="text-3xl font-bold text-white">₹{myStats.earnings}</h1>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-fuchsia-900/50 to-slate-900 border border-fuchsia-500/30 p-6">
                    <div className="flex items-center gap-2 mb-2 text-fuchsia-400"><Gift className="h-5 w-5" /><span className="font-bold text-xs tracking-wider uppercase">Loot Bag</span></div>
                    {myStats.loot && myStats.loot.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {myStats.loot.map((item, i) => <span key={i} className="text-xs bg-fuchsia-500/20 text-fuchsia-200 px-2 py-1 rounded-md border border-fuchsia-500/20">{item}</span>)}
                        </div>
                    ) : <div className="text-slate-500 text-xs mt-1">No items collected.</div>}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">My Tasks ({myStats.accepted.length})</h3>
                <div className="space-y-4">{myStats.accepted.map(quest => <MiniQuestCard key={quest._id} quest={quest} />)}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Posted by Me ({myStats.posted.length})</h3>
                <div className="space-y-4">
                   {myStats.posted.map(quest => (
                     <div key={quest._id} className="p-4 rounded-xl bg-slate-900 border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-slate-200">{quest.title}</h4>
                           {quest.status === "IN_PROGRESS" && <button onClick={() => handleComplete(quest._id)} className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-emerald-500">Mark Done</button>}
                        </div>
                        <div className="text-xs text-slate-500">Reward: {quest.reward}</div>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feed" && (
            <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 px-4 py-3 border border-white/5">
                <button onClick={() => { setIsModalOpen(true); setFormError(""); }} className="group flex items-center justify-center h-8 w-8 rounded-lg bg-violet-600 hover:bg-violet-500 transition text-white"><Plus className="h-5 w-5" /></button>
                <div className="flex-1 text-sm text-slate-500">Post a quest to <span className="text-violet-400 font-bold">{activeCommunity}</span></div>
            </div>
            </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create New Quest</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
              </div>

              {formError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-xs text-center">{formError}</div>}

              <div className="space-y-4">
                <div><label className="text-xs font-medium text-slate-400 uppercase">Quest Title *</label><input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} type="text" className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-amber-400 uppercase">Location *</label>
                        <input 
                            value={formData.location} 
                            onChange={(e) => setFormData({...formData, location: e.target.value})} 
                            type="text" 
                            placeholder="SD 10, Vindhyachal" 
                            className="mt-1 w-full rounded-lg bg-slate-800 border border-amber-500/30 p-3 text-white outline-none focus:border-amber-500" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-amber-400 uppercase">Phone (+91)</label>
                        <input 
                            value={formData.phone} 
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({...formData, phone: val});
                            }} 
                            type="text" 
                            placeholder="9876543210"
                            className="mt-1 w-full rounded-lg bg-slate-800 border border-amber-500/30 p-3 text-white outline-none focus:border-amber-500" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-emerald-400 uppercase">Money (₹)</label>
                    <input 
                        value={formData.cash} 
                        onChange={(e) => setFormData({...formData, cash: e.target.value})} 
                        type="number" 
                        min="0" 
                        step="1"
                        className="mt-1 w-full rounded-lg bg-slate-800 border border-emerald-500/30 p-3 text-white outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    />
                  </div>
                  <div><label className="text-xs font-medium text-fuchsia-400 uppercase">Loot / Items</label><input value={formData.loot} onChange={(e) => setFormData({...formData, loot: e.target.value})} type="text" className="mt-1 w-full rounded-lg bg-slate-800 border border-fuchsia-500/30 p-3 text-white outline-none focus:border-fuchsia-500" /></div>
                </div>
                <div><label className="text-xs font-medium text-slate-400 uppercase">Slots</label><input value={formData.slots} onChange={(e) => setFormData({...formData, slots: e.target.value})} type="number" min="1" className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none" /></div>
                <div><label className="text-xs font-medium text-slate-400 uppercase">Details *</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="mt-1 w-full rounded-lg bg-slate-800 border border-white/10 p-3 text-white outline-none"></textarea></div>
              </div>
              <button onClick={handlePostQuest} disabled={isLoading} className="mt-6 w-full flex justify-center items-center rounded-xl bg-violet-600 py-3.5 font-bold text-white hover:bg-violet-500 disabled:opacity-50">{isLoading ? <Loader2 className="animate-spin" /> : "Post Quest"}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function QuestCard({ quest, currentUserId, onAccept, onComplete, isAccepting }) {
    const isCreator = String(quest.creator?._id || quest.creator) === String(currentUserId);
    const isAcceptedByMe = String(quest.acceptedBy) === String(currentUserId);
    
    // Privacy Logic:
    const finalLocation = quest.location || "";
    const finalPhone = quest.phone;
    const isPhoneUnlocked = Boolean(finalPhone);

    const creatorName = quest.creator?.name || "Anonymous Student";

    // Address Expansion Logic
    const [isAddressExpanded, setIsAddressExpanded] = useState(false);
    const ADDRESS_LIMIT = 50; 
    const isLongAddress = finalLocation.length > ADDRESS_LIMIT;
    const displayedAddress = isAddressExpanded 
        ? finalLocation 
        : (isLongAddress ? finalLocation.substring(0, ADDRESS_LIMIT) + "..." : finalLocation);

    return (
        <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300 w-full">
            <div className="h-10 w-10 shrink-0 rounded-full bg-violet-900/50 flex items-center justify-center font-bold text-violet-300">{quest.community ? quest.community[0] : "Q"}</div>
            
            <div className="flex-1 w-full max-w-md">
                <div className="flex items-baseline gap-2"><span className="font-bold text-slate-200">{creatorName}</span><span className="text-xs text-slate-500">Just now</span></div>
                
                <div className="mt-2 w-full rounded-2xl border border-violet-500/30 bg-slate-900/80 p-5 backdrop-blur-md shadow-2xl shadow-violet-900/10 overflow-hidden">
                    <div className="mb-3 flex justify-between items-center">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${quest.status === "OPEN" ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : quest.status === "COMPLETED" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-amber-500/20 border-amber-500/30 text-amber-300"}`}>{quest.status === "OPEN" ? "QUEST" : quest.status === "COMPLETED" ? "COMPLETED" : "IN PROGRESS"}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1 break-words">{quest.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 whitespace-pre-wrap break-words">{quest.description}</p>
                    
                    <div className="flex flex-col gap-2 mb-4">
                        
                        {/* 1. ADDRESS BLOCK */}
                        <div className="p-3.5 rounded-xl text-xs font-mono flex flex-col gap-2 transition-all duration-300 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <div className="flex items-start gap-3 w-full">
                                <div className="shrink-0 mt-0.5"><MapPin className="h-4 w-4" /></div>
                                <span className="break-all whitespace-pre-wrap leading-relaxed w-full">{displayedAddress}</span>
                            </div>
                            {isLongAddress && (
                                <button onClick={() => setIsAddressExpanded(!isAddressExpanded)} className="flex items-center gap-1 text-[10px] font-bold hover:text-amber-300 hover:underline self-end opacity-90 transition">
                                    {isAddressExpanded ? <>Show Less <ChevronUp className="h-3 w-3" /></> : <>Read More <ChevronDown className="h-3 w-3" /></>}
                                </button>
                            )}
                        </div>

                        {/* 2. PHONE BLOCK */}
                        <div className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-3 ${isPhoneUnlocked ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "bg-slate-800 text-slate-500 border border-white/5"}`}>
                            <div className="shrink-0">{isPhoneUnlocked ? <Phone className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</div>
                            {isPhoneUnlocked ? (
                                <a href={`tel:${finalPhone}`} className="hover:underline font-bold tracking-wide break-all">{finalPhone}</a>
                            ) : (
                                <span>Hidden Phone</span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            {quest.cashValue > 0 && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Wallet className="h-4 w-4 shrink-0" />
                                    <span className="font-bold text-sm break-all">₹{quest.cashValue}</span>
                                </div>
                            )}
                            {quest.lootItems && quest.lootItems.length > 0 && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                                    <Gift className="h-4 w-4 shrink-0" />
                                    <span className="font-bold text-sm break-all">{quest.lootItems.join(' + ')}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
                            {quest.status === "OPEN" && !isCreator && <button onClick={() => onAccept(quest._id)} disabled={isAccepting === quest._id} className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-50">{isAccepting === quest._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <>Accept <ArrowRight className="h-3 w-3" /></>}</button>}
                            
                            {quest.status === "OPEN" && isCreator && <span className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-500 border border-white/10"><User className="h-3 w-3" /> Your Quest</span>}
                            
                            {quest.status === "IN_PROGRESS" && isCreator && <button onClick={() => onComplete(quest._id)} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500">Mark Done <CheckCircle className="h-3 w-3" /></button>}
                            {quest.status === "IN_PROGRESS" && !isCreator && <span className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-400 border border-white/10">Taken ⏳</span>}
                            {quest.status === "COMPLETED" && <span className="flex items-center gap-2 rounded-lg bg-emerald-900/30 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">Completed 🎉</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniQuestCard({ quest }) {
    return (
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-200">{quest.title}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quest.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{quest.status}</span>
            </div>
            <div className="text-xs text-slate-500 mb-2">Reward: {quest.reward}</div>
        </div>
    );
}

function SidebarIcon({ icon, active }) {
  return <div className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl transition-all ${active ? "bg-slate-800 text-white ring-2 ring-violet-600" : "bg-transparent text-slate-500 hover:bg-slate-800 hover:text-white"}`}>{icon}</div>;
}