
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
    color: "bg-red-100 text-red-600"
  },
  {
    id: 2,
    title: "Meeting Invites",
    desc: "Join lobbying sessions and leadership meets.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    id: 3,
    title: "Member Directory",
    desc: "Connect with local block-level coordinators.",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: 4,
    title: "Training Portal",
    desc: "Learn our core values and political strategies.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    color: "bg-green-100 text-green-600"
  }
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
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Dashboard Search Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">MEMBER <span className="text-red-700 italic">PORTAL</span></h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Welcome back, Comrade {user?.name}</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, circulars, or tools..."
              className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-[1.5rem] leading-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: ID Card & Stats */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-2xl font-black">{PARTY_NAME}</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Official Member Card</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center font-bold">2024</div>
              </div>
              
              <div className="flex gap-6 items-end mb-8">
                <div 
                  className="w-24 h-24 bg-white/10 rounded-2xl border-2 border-white/20 overflow-hidden shadow-inner relative cursor-pointer group/avatar"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Member" className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-30' : 'opacity-100'}`} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                </div>
                <div>
                  <p className="text-xl font-bold truncate max-w-[150px]">{user?.name}</p>
                  <p className="text-sm opacity-60">ID: {user?.membershipId || 'TVK-PENDING'}</p>
                  <p className="text-[10px] font-bold text-yellow-400 uppercase mt-1">Volunteer Grade A</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="text-[10px] uppercase font-bold tracking-tighter">
                  {user?.constituency || 'State Wide Node'}
                </div>
                <div className="w-10 h-10 bg-white p-1 rounded-md">
                   <div className="grid grid-cols-2 gap-0.5 h-full">
                      <div className="bg-black"></div><div className="bg-white"></div>
                      <div className="bg-white"></div><div className="bg-black"></div>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">My Activity</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Referrals</span>
                  <span className="font-bold text-red-600">24 Members</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Points Earned</span>
                  <span className="font-bold text-yellow-600">1,240 pts</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                Redeem Rewards
              </button>
            </div>
          </div>

          {/* Right: Dashboard Sections */}
          <div className="lg:w-2/3 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredTools.length > 0 ? filteredTools.map(tool => (
                <div key={tool.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300">
                  <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tool.icon}></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">{tool.desc}</p>
                  <button className="text-red-600 font-bold text-sm flex items-center gap-2 hover:underline">Access <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200">
                  No resources found matching your search.
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-3xl font-black mb-4">WANT TO BE A<br /><span className="text-yellow-400 italic text-4xl">POLLING AGENT?</span></h2>
                 <p className="text-gray-400 mb-8 max-w-sm">We are looking for dedicated volunteers to represent TVK at the grass-root level. Training starts this Saturday.</p>
                 <button className="bg-white text-black px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider hover:bg-yellow-400 transition-colors">Apply for Training</button>
               </div>
               <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                 <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover grayscale" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
