"use client";
import React from 'react';
import { 
  Home, 
  MessageSquare, 
  PlusCircle, 
  User, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ activeTab, setActiveTab }) {
  
  const navItems = [
    { id: 'home', name: 'Quest Board', icon: Home },
    { id: 'messages', name: 'Messages', icon: MessageSquare }, // The new Chat icon
    { id: 'create', name: 'Post Quest', icon: PlusCircle },
    { id: 'profile', name: 'My Profile', icon: User },
  ];

  const bottomItems = [
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Zap className="text-white" size={24} />
        </div>
        <span className="hidden md:block font-bold text-xl text-gray-900 tracking-tight">
          SideQuest
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="hidden md:block font-medium">{item.name}</span>
            
            {/* Real-time Indicator for Messages (Optional logic later) */}
            {item.id === 'messages' && (
              <div className="hidden md:block ml-auto w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <item.icon size={22} />
            <span className="hidden md:block font-medium">{item.name}</span>
          </button>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={22} />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}