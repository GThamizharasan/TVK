
import React from 'react';
import { PARTY_NAME, FULL_PARTY_NAME } from '../constants';

const MemberDashboard: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
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
                <div className="w-24 h-24 bg-white/10 rounded-2xl border-2 border-white/20 overflow-hidden shadow-inner">
                  <img src="https://i.pravatar.cc/150?u=tvkmember" alt="Member" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xl font-bold">Arun Kumar</p>
                  <p className="text-sm opacity-60">ID: TVK-2024-88219</p>
                  <p className="text-[10px] font-bold text-yellow-400 uppercase mt-1">Volunteer Grade A</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="text-[10px] uppercase font-bold tracking-tighter">
                  Chennai Central Constituency
                </div>
                <div className="w-10 h-10 bg-white p-1 rounded-md">
                   {/* Mock QR */}
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
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Campaign Tools</h3>
                <p className="text-sm text-gray-500 mb-6">Get official brochures and social media kits to spread the word in your area.</p>
                <button className="text-red-600 font-bold text-sm flex items-center gap-2">Download Kit <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Meeting Invites</h3>
                <p className="text-sm text-gray-500 mb-6">Exclusive access to Zoom sessions with state level leadership team.</p>
                <button className="text-yellow-600 font-bold text-sm flex items-center gap-2">Join Lobby <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
              </div>
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
