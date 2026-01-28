
import React, { useState, useRef } from 'react';
import { PARTY_NAME } from '../constants';
import { useAuth } from './AuthContext';
import { db } from '../services/db';

const TOOLS = [
  {
    id: 1,
    title: "Campaign Kits",
    desc: "Get official brochures and social media assets.",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    color: "bg-red-50 text-red-600",
    badge: "New Assets"
  },
  {
    id: 2,
    title: "Meeting Invites",
    desc: "Join lobbying sessions and leadership meets.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-amber-50 text-amber-700",
    badge: "2 Active"
  },
  {
    id: 3,
    title: "Member Directory",
    desc: "Connect with local block-level coordinators.",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
    color: "bg-blue-50 text-blue-600"
  },
  {
    id: 4,
    title: "Training Portal",
    desc: "Learn our core values and political strategies.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    color: "bg-emerald-50 text-emerald-600"
  }
];

const CIRCULARS = [
  { id: 1, title: "District Wing Reorganization - Phase 2", date: "Oct 28, 2024", type: "OFFICIAL" },
  { id: 2, title: "Guidelines for Membership Verification", date: "Oct 25, 2024", type: "INTERNAL" },
  { id: 3, title: "Public Rally Protocol: Madurai Summit", date: "Oct 22, 2024", type: "EVENT" }
];

const MemberDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTools = TOOLS.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await db.updateUserAvatar(user.id, base64);
        updateUser({ avatar: base64 });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#fcfcfc] dark:bg-gray-950 min-h-screen">
      {/* Dynamic Header with Wave Pattern */}
      <div className="bg-red-700 pt-16 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="waves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="animate-in fade-in slide-in-from-left-6 duration-700">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
                COMRADE <span className="text-yellow-400 italic">PORTAL</span>
              </h1>
              <p className="text-red-100 text-lg mt-2 font-medium">Building a stronger Tamil Nadu, one member at a time.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white min-w-[140px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">My Referrals</p>
                <p className="text-2xl font-black">24</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-white min-w-[140px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Loyalty Pts</p>
                <p className="text-2xl font-black text-yellow-400">1,240</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 pb-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Identity & Quick Facts */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {/* Premium ID Card */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:shadow-red-600/5 group">
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 text-white relative h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-red-600/20">
                    TVK
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Official Membership</p>
                    <p className="text-sm font-bold text-gray-400">Card v2.0</p>
                  </div>
                </div>

                <div className="flex gap-6 items-center mb-8 relative z-10">
                  <div 
                    className="w-24 h-24 bg-gray-800 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl relative cursor-pointer group/avatar shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Member" className={`w-full h-full object-cover transition-all group-hover/avatar:scale-110 ${uploading ? 'opacity-30' : 'opacity-100'}`} />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                    </div>
                    {uploading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                  </div>
                  <div className="truncate">
                    <p className="text-2xl font-black truncate">{user?.name}</p>
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded-md inline-block mt-1">Verified Comrade</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
                   <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Membership ID</span>
                     <span className="text-xs font-mono font-bold tracking-widest text-red-500">{user?.membershipId || 'TVK-PENDING'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Constituency</span>
                     <span className="text-xs font-bold">{user?.constituency || 'State Node'}</span>
                   </div>
                </div>

                <div className="mt-8 flex justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                   <div className="w-full h-10 bg-white/5 rounded-lg flex items-center justify-around px-4">
                      {[1,2,3,4,5,6,7,8].map(n => <div key={n} className="w-0.5 h-6 bg-white/20"></div>)}
                   </div>
                </div>
              </div>
            </div>

            {/* Official Circulars List */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Official Circulars</h4>
                 <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
               </div>
               <div className="space-y-4">
                 {CIRCULARS.map(item => (
                   <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-900 transition-all cursor-pointer group">
                     <p className="text-[8px] font-black uppercase text-red-600 mb-1 tracking-widest">{item.type}</p>
                     <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-700 transition-colors line-clamp-1">{item.title}</h5>
                     <p className="text-[10px] text-gray-400 font-bold mt-2">{item.date}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">View Archive</button>
            </div>
          </div>

          {/* RIGHT COLUMN: Search, Tools, and CTA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Search Bar - Repositioned for focus */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools, training materials, or kits..."
                  className="block w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Tools Grid */}
            <div>
              <div className="flex items-baseline justify-between mb-6 px-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Comrade Toolkit</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredTools.length} Resources Available</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredTools.length > 0 ? filteredTools.map(tool => (
                  <div key={tool.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 animate-in fade-in duration-500 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tool.icon}></path></svg>
                      </div>
                      {tool.badge && (
                        <span className="text-[8px] font-black bg-red-600 text-white px-2 py-1 rounded-md uppercase tracking-widest animate-pulse">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white">{tool.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">{tool.desc}</p>
                    <button className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                      Access Module
                      <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full py-24 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No results match your search</p>
                  </div>
                )}
              </div>
            </div>

            {/* Polling Agent CTA - Redesigned */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group">
               <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                 <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover mix-blend-overlay grayscale group-hover:scale-105 transition-transform duration-[2000ms]" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="max-w-md text-center md:text-left">
                   <h2 className="text-3xl md:text-4xl font-black mb-4 leading-none uppercase tracking-tighter italic">WANT TO BE A<br /><span className="text-yellow-400 not-italic">POLLING AGENT?</span></h2>
                   <p className="text-red-100 font-medium mb-0 text-sm md:text-base">We are training 50,000 dedicated volunteers to represent TVK at the grass-root level for the 2026 elections.</p>
                 </div>
                 <button className="bg-white text-red-700 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-2xl shrink-0 active:scale-95">
                   Apply for Training
                 </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
