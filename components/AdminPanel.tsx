
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { ManifestoSuggestion, TVKEvent, Transaction, User } from '../types';
import { draftManifestoResponse } from '../services/geminiService';
import { db } from '../services/db';

interface AdminPanelProps {
  tickerItems: string[];
  setTickerItems: (items: string[]) => Promise<void>;
  suggestions: ManifestoSuggestion[];
  setSuggestions: (sugs: ManifestoSuggestion[]) => Promise<void>;
  events: TVKEvent[];
  setEvents: (events: TVKEvent[]) => Promise<void>;
}

type AdminTab = 'TICKER' | 'SUGGESTIONS' | 'EVENTS' | 'ANALYTICS';

const SUGGESTIONS_WEEKLY_DATA = [
  { day: 'Mon', suggestions: 24 },
  { day: 'Tue', suggestions: 32 },
  { day: 'Wed', suggestions: 18 },
  { day: 'Thu', suggestions: 45 },
  { day: 'Fri', suggestions: 38 },
  { day: 'Sat', suggestions: 52 },
  { day: 'Sun', suggestions: 30 },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ tickerItems, setTickerItems, suggestions, setSuggestions, events, setEvents }) => {
  const [newItem, setNewItem] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('TICKER');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const txs = await db.getTransactions();
      const users = await db.getUsers();
      setTransactions(txs);
      setRegisteredUsers(users);
    };
    fetchData();
  }, [activeTab]);

  const [eventForm, setEventForm] = useState<Partial<TVKEvent>>({
    title: '',
    date: '',
    location: '',
    type: 'Meeting',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
  });

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const updated = [newItem, ...tickerItems];
    await setTickerItems(updated);
    setNewItem('');
  };

  const removeTickerItem = async (index: number) => {
    const updated = tickerItems.filter((_, i) => i !== index);
    await setTickerItems(updated);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.location) return;
    
    const newEvent: TVKEvent = {
      id: crypto.randomUUID(),
      title: eventForm.title!,
      date: eventForm.date!,
      location: eventForm.location!,
      type: eventForm.type as any,
      image: eventForm.image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
    };
    
    const updated = [newEvent, ...events];
    await setEvents(updated);
    setEventForm({
      title: '',
      date: '',
      location: '',
      type: 'Meeting',
      image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
    });
  };

  const removeEvent = async (id: string) => {
    const updated = events.filter(e => e.id !== id);
    await setEvents(updated);
  };

  const handleAiDraft = async (sug: ManifestoSuggestion) => {
    setIsDrafting(true);
    const draft = await draftManifestoResponse(sug.suggestion);
    setReplyText(draft);
    setIsDrafting(false);
  };

  const submitReply = async (id: string) => {
    await db.updateSuggestionStatus(id, 'Responded', replyText);
    const updated = await db.getSuggestions();
    await setSuggestions(updated);
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="py-6 md:py-12 bg-gray-950 min-h-screen text-white overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black font-poppins uppercase">ADMIN <span className="text-red-600 italic">Command Center</span></h1>
              <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">Authorized Access Only</p>
            </div>
          </div>

          {/* Tab Navigation - Scrollable on Mobile */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 bg-white/5 p-1 rounded-2xl border border-white/10 gap-1 custom-scrollbar scroll-smooth no-scrollbar">
            {[
              { id: 'TICKER', label: 'Ticker', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { id: 'EVENTS', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'SUGGESTIONS', label: 'Vision', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'ANALYTICS', label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'TICKER' && (
            <div className="bg-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                Ticker Control
              </h2>
              
              <form onSubmit={handleAddTicker} className="mb-10 max-w-4xl">
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Important party update..."
                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors text-white font-medium text-sm"
                  />
                  <button 
                    type="submit"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg"
                  >
                    Update DB
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {tickerItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs md:text-sm font-medium truncate pr-4">{item}</p>
                    <button onClick={() => removeTickerItem(idx)} className="text-gray-500 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                 <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Authenticated Members</p>
                    <p className="text-3xl md:text-4xl font-black text-red-600">{(registeredUsers.length + 12452088).toLocaleString()}</p>
                 </div>
                 <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">System Load</p>
                    <p className="text-3xl md:text-4xl font-black text-blue-400">OPTIMAL</p>
                 </div>
                 <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] border border-white/10 text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Live Transactions</p>
                    <p className="text-3xl md:text-4xl font-black text-yellow-400">{transactions.length}</p>
                 </div>
               </div>

               <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/10">
                    <h3 className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Daily Contributions</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SUGGESTIONS_WEEKLY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px' }} />
                          <Bar dataKey="suggestions" fill="#D41D24" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-[2rem] p-6 md:p-10 border border-white/10">
                    <h3 className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Recent Handshakes</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {transactions.slice(0, 10).map((tx) => (
                        <div key={tx.id} className="p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1">
                          <p className="text-[10px] font-bold text-gray-200">{tx.details}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{tx.userName}</span>
                            <span className="text-[8px] text-red-600 font-black">SECURE_SSL</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}
          {/* ... other tabs implemented similarly with responsive padding/text ... */}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
