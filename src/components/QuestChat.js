"use client";
import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { Send } from "lucide-react";

export default function QuestChat({ questId, currentUserId, chatTitle, isGroup = false, participantCount = 0, creatorId = "" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 1. Load History & Setup Pusher
  useEffect(() => {
    // Fetch old messages
    fetch(`/api/chat/history/${questId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setMessages(json.data);
      });

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`chat-${questId}`);
    
    channel.bind("new-message", (data) => {
      // Only add message if it's not already there (prevents duplicates for the sender)
      setMessages((prev) => {
        if (prev.find(m => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusher.unsubscribe(`chat-${questId}`);
      pusher.disconnect();
    };
  }, [questId]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message function
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questId,
        text: input,
      }),
    });

    if (res.ok) setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 bg-slate-900/80 border-b border-white/10 text-white">
        <div className="font-bold">{chatTitle}</div>
        {isGroup && (
          <div className="text-xs text-slate-400 mt-1">
            Group quest chat{participantCount ? ` • ${participantCount} members` : ""}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
        {messages.map((msg) => {
          const isMine = String(msg.sender?._id || msg.sender) === String(currentUserId);
          const isCreatorMessage = isGroup && String(msg.sender?._id || msg.sender) === String(creatorId);
          const senderName = msg.sender?.name || msg.senderName || "Student";
          const timeLabel = formatTime(msg.createdAt);
          return (
            <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMine ? "bg-violet-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none"} ${isCreatorMessage && !isMine ? "ring-2 ring-amber-400/70 shadow-[0_0_18px_rgba(251,191,36,0.35)]" : ""}`}>
                {!isMine && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                    <span>{senderName}</span>
                    {isCreatorMessage && <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase">Creator</span>}
                  </div>
                )}
                {msg.text}
                {timeLabel && <div className="text-[10px] text-slate-300/70 mt-1 text-right">{timeLabel}</div>}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-slate-900 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none"
        />
        <button type="submit" className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-500 transition">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}