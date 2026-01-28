
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { ManifestoSuggestion, TVKEvent, Transaction, User, ManifestoPoint, PollData, PollOption, LeadershipMember, IdeologyPoint, Achievement, MediaAsset } from '../types';
import { draftManifestoResponse } from '../services/geminiService';
import { db } from '../services/db';

interface AdminPanelProps {
  tickerItems: string[];
  setTickerItems: (items: string[]) => Promise<void>;
  suggestions: ManifestoSuggestion[];
  setSuggestions: (sugs: ManifestoSuggestion[]) => Promise<void>;
  events: TVKEvent[];
  setEvents: (events: TVKEvent[]) => Promise<void>;
  banners: any[];
  setBanners: (banners: any[]) => Promise<void>;
  onDataChange?: () => void;
}

type AdminTab = 'TICKER' | 'SUGGESTIONS' | 'EVENTS' | 'BANNERS' | 'ANALYTICS' | 'MANIFESTO' | 'POLLS' | 'IDEOLOGY' | 'LEADERSHIP' | 'ACHIEVEMENTS' | 'RESOURCES';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  tickerItems, setTickerItems, 
  suggestions, setSuggestions, 
  events, setEvents,
  banners, setBanners,
  onDataChange
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ANALYTICS');
  const [newItem, setNewItem] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [manifestoPoints, setManifestoPoints] = useState<ManifestoPoint[]>([]);
  const [pollData, setPollData] = useState<PollData>({ question: '', options: [] });
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [ideology, setIdeology] = useState<IdeologyPoint[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [suggestionFilter, setSuggestionFilter] = useState<'All' | 'Pending' | 'Responded'>('All');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ index: number; type: AdminTab } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const leaderFileInputRef = useRef<HTMLInputElement>(null);
  const milestoneFileInputRef = useRef<HTMLInputElement>(null);
  const resourceFileInputRef = useRef<HTMLInputElement>(null);
  const newBannerFileInputRef = useRef<HTMLInputElement>(null);

  const [eventForm, setEventForm] = useState<Partial<TVKEvent>>({ title: '', date: '', location: '', type: 'Meeting', image: '' });
  const [manifestoForm, setManifestoForm] = useState({ title: '', desc: '' });
  const [ideologyForm, setIdeologyForm] = useState({ title: '', description: '' });
  const [leaderForm, setLeaderForm] = useState<Partial<LeadershipMember>>({ name: '', role: '', bio: '', image: '' });
  const [achievementForm, setPartialAchievementForm] = useState<Partial<Achievement>>({ year: '', title: '', desc: '', img: '' });
  const [mediaForm, setMediaForm] = useState<Partial<MediaAsset>>({ title: '', url: '', type: 'POSTER' });
  const [newBannerForm, setNewBannerForm] = useState({ title: '', subtitle: '', cta: 'Enroll Now', image: '', accent: '#FFD700' });

  const [localBanners, setLocalBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [txs, users, points, poll, sugs, leaders, ideo, ach, med] = await Promise.all([
        db.getTransactions(),
        db.getUsers(),
        db.getManifestoPoints(),
        db.getPollData(),
        db.getSuggestions(),
        db.getLeadership(),
        db.getIdeology(),
        db.getAchievements(),
        db.getMedia()
      ]);
      setTransactions(txs);
      setRegisteredUsers(users);
      setManifestoPoints(points);
      setPollData(poll);
      setSuggestions(sugs);
      setLeadership(leaders);
      setIdeology(ideo);
      setAchievements(ach);
      setMediaAssets(med);
    };
    fetchData();
    setLocalBanners(banners);
  }, [activeTab, banners]);

  const processImage = (file: File, callback: (result: string) => void) => {
    if (file && (file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (index: number, type: AdminTab) => setDraggedItem({ index, type });
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (dropIndex: number, type: AdminTab) => {
    if (!draggedItem || draggedItem.type !== type || draggedItem.index === dropIndex) return;
    
    let updatedList: any[] = [];
    
    switch (type) {
      case 'TICKER':
        updatedList = [...tickerItems];
        const [movedTicker] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedTicker);
        await setTickerItems(updatedList);
        break;
      case 'BANNERS':
        updatedList = [...localBanners];
        const [movedBanner] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedBanner);
        setLocalBanners(updatedList);
        await setBanners(updatedList);
        break;
      case 'EVENTS':
        updatedList = [...events];
        const [movedEvent] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedEvent);
        await db.setEvents(updatedList);
        setEvents(updatedList);
        break;
      case 'MANIFESTO':
        updatedList = [...manifestoPoints];
        const [movedManifesto] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedManifesto);
        await db.setManifestoPoints(updatedList);
        setManifestoPoints(updatedList);
        break;
      case 'LEADERSHIP':
        updatedList = [...leadership];
        const [movedLeader] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedLeader);
        await db.setLeadership(updatedList);
        setLeadership(updatedList);
        break;
      case 'IDEOLOGY':
        updatedList = [...ideology];
        const [movedIdeology] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedIdeology);
        await db.setIdeology(updatedList);
        setIdeology(updatedList);
        break;
      case 'ACHIEVEMENTS':
        updatedList = [...achievements];
        const [movedAchievement] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedAchievement);
        await db.setAchievements(updatedList);
        setAchievements(updatedList);
        break;
      case 'RESOURCES':
        updatedList = [...mediaAssets];
        const [movedResource] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedResource);
        await db.setMedia(updatedList);
        setMediaAssets(updatedList);
        break;
      case 'POLLS':
        updatedList = [...pollData.options];
        const [movedOption] = updatedList.splice(draggedItem.index, 1);
        updatedList.splice(dropIndex, 0, movedOption);
        const updatedPoll = { ...pollData, options: updatedList };
        await db.setPollData(updatedPoll);
        setPollData(updatedPoll);
        break;
    }
    
    setDraggedItem(null);
    if (onDataChange) onDataChange();
  };

  const clearForms = () => {
    setEditingId(null);
    setNewItem('');
    setEventForm({ title: '', date: '', location: '', type: 'Meeting', image: '' });
    setManifestoForm({ title: '', desc: '' });
    setIdeologyForm({ title: '', description: '' });
    setLeaderForm({ name: '', role: '', bio: '', image: '' });
    setPartialAchievementForm({ year: '', title: '', desc: '', img: '' });
    setMediaForm({ title: '', url: '', type: 'POSTER' });
    setNewBannerForm({ title: '', subtitle: '', cta: 'Enroll Now', image: '', accent: '#FFD700' });
  };

  const handleEditItem = (item: any, type: AdminTab) => {
    setEditingId(item.id || item); // item is string for ticker
    setActiveTab(type);
    
    switch (type) {
      case 'TICKER':
        setNewItem(item);
        break;
      case 'EVENTS':
        setEventForm(item);
        break;
      case 'MANIFESTO':
        setManifestoForm({ title: item.title, desc: item.desc });
        break;
      case 'IDEOLOGY':
        setIdeologyForm({ title: item.title, description: item.description });
        break;
      case 'LEADERSHIP':
        setLeaderForm(item);
        break;
      case 'ACHIEVEMENTS':
        setPartialAchievementForm(item);
        break;
      case 'RESOURCES':
        setMediaForm(item);
        break;
      case 'BANNERS':
        setNewBannerForm({ title: item.title, subtitle: item.subtitle, cta: item.cta, image: item.image, accent: item.accent });
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTickerSubmit = async () => {
    if (!newItem.trim()) return;
    let updated: string[];
    if (editingId !== null && typeof editingId === 'string') {
      updated = tickerItems.map(item => item === editingId ? newItem.trim() : item);
    } else {
      updated = [...tickerItems, newItem.trim()];
    }
    await setTickerItems(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: TVKEvent[];
    if (editingId) {
      updated = events.map(ev => ev.id === editingId ? { ...ev, ...eventForm } as TVKEvent : ev);
    } else {
      updated = [...events, { ...eventForm, id: crypto.randomUUID() } as TVKEvent];
    }
    await db.setEvents(updated);
    setEvents(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleManifestoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: ManifestoPoint[];
    if (editingId) {
      updated = manifestoPoints.map(p => p.id === editingId ? { ...p, ...manifestoForm } : p);
    } else {
      updated = [...manifestoPoints, { ...manifestoForm, id: crypto.randomUUID() }];
    }
    await db.setManifestoPoints(updated);
    setManifestoPoints(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleIdeologySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: IdeologyPoint[];
    if (editingId) {
      updated = ideology.map(i => i.id === editingId ? { ...i, ...ideologyForm } : i);
    } else {
      updated = [...ideology, { ...ideologyForm, id: crypto.randomUUID() }];
    }
    await db.setIdeology(updated);
    setIdeology(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleLeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: LeadershipMember[];
    if (editingId) {
      updated = leadership.map(l => l.id === editingId ? { ...l, ...leaderForm } as LeadershipMember : l);
    } else {
      updated = [...leadership, { ...leaderForm, id: crypto.randomUUID() } as LeadershipMember];
    }
    await db.setLeadership(updated);
    setLeadership(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Achievement[];
    if (editingId) {
      updated = achievements.map(a => a.id === editingId ? { ...a, ...achievementForm } as Achievement : a);
    } else {
      updated = [...achievements, { ...achievementForm, id: crypto.randomUUID() } as Achievement];
    }
    await db.setAchievements(updated);
    setAchievements(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: MediaAsset[];
    if (editingId) {
      updated = mediaAssets.map(a => a.id === editingId ? { ...a, ...mediaForm } as MediaAsset : a);
    } else {
      updated = [...mediaAssets, { ...mediaForm, id: crypto.randomUUID(), downloadCount: 0 } as MediaAsset];
    }
    await db.setMedia(updated);
    setMediaAssets(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingId) {
      updated = localBanners.map(b => b.id === editingId ? { ...b, ...newBannerForm } : b);
    } else {
      updated = [...localBanners, { ...newBannerForm, id: Date.now() }];
    }
    await setBanners(updated);
    setLocalBanners(updated);
    clearForms();
    if (onDataChange) onDataChange();
  };

  // Fix for: Error in file components/AdminPanel.tsx on line 631: Cannot find name 'handlePollUpdate'.
  const handlePollUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.setPollData(pollData);
    if (onDataChange) onDataChange();
  };

  // Fix for: Error in file components/AdminPanel.tsx on line 962: Cannot find name 'handleDraftReply'.
  const handleDraftReply = async (id: string, suggestion: string) => {
    setIsDrafting(true);
    const draft = await draftManifestoResponse(suggestion);
    setReplyText(draft);
    setIsDrafting(false);
  };

  // Fix for: Error in file components/AdminPanel.tsx on line 967: Cannot find name 'handleSendReply'.
  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) return;
    await db.updateSuggestionStatus(id, 'Responded', replyText);
    const updatedSugs = await db.getSuggestions();
    setSuggestions(updatedSugs);
    setActiveReplyId(null);
    setReplyText('');
    if (onDataChange) onDataChange();
  };

  const TABS = [
    { id: 'ANALYTICS', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'TICKER', label: 'News Ticker', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'SUGGESTIONS', label: 'Suggestions', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { id: 'BANNERS', label: 'Carousel', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'EVENTS', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'MANIFESTO', label: 'Manifesto', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'POLLS', label: 'Polls', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'LEADERSHIP', label: 'Leadership', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'IDEOLOGY', label: 'Ideology', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'ACHIEVEMENTS', label: 'Achievements', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
    { id: 'RESOURCES', label: 'Resources', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' }
  ];

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col lg:flex-row font-poppins">
      <aside className="w-full lg:w-72 bg-gray-900 border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 z-40 overflow-y-auto max-h-screen sticky top-0">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black">TVK</div>
          <h1 className="text-xl font-black tracking-tighter uppercase">Command</h1>
        </div>
        <nav className="p-4 space-y-1 flex lg:flex-col no-scrollbar">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as AdminTab); setEditingId(null); }} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap lg:w-full ${activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto custom-scrollbar">
        {/* Analytics Tab */}
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Registered Members', value: (registeredUsers.length + 12452088).toLocaleString(), color: 'text-red-600' },
                { label: 'Cloud Transactions', value: transactions.length, color: 'text-yellow-400' },
                { label: 'Active Events', value: events.length, color: 'text-green-500' },
                { label: 'Uptime', value: '99.99%', color: 'text-blue-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8">System Audit Log</h3>
              <div className="space-y-4">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-200">{tx.details}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase mt-1">{tx.userName} • {new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <span className="text-[8px] font-black bg-red-600/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">{tx.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Ticker Tab */}
        {activeTab === 'TICKER' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{editingId ? 'Edit Ticker Headline' : 'Add Ticker Headline'}</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={newItem} 
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Enter breaking news..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 transition-all font-bold"
                />
                <button onClick={handleTickerSubmit} className="bg-red-600 px-8 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-colors">
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && <button onClick={clearForms} className="px-4 text-gray-400">Cancel</button>}
              </div>
            </div>

            <div className="space-y-4">
              {tickerItems.map((item, i) => (
                <div 
                  key={i} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'TICKER')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'TICKER')}
                  className="bg-white/5 p-6 rounded-2xl border border-white/10 flex justify-between items-center cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <p className="font-bold">{item}</p>
                  <div className="flex gap-4">
                    <button onClick={() => handleEditItem(item, 'TICKER')} className="text-blue-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={async () => {
                      const updated = tickerItems.filter((_, idx) => idx !== i);
                      await setTickerItems(updated);
                    }} className="text-gray-500 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carousel Banners Tab */}
        {activeTab === 'BANNERS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-black/20 border border-white/10 p-8 rounded-[2.5rem]">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8">{editingId ? 'Edit Slide' : 'Deploy New Slide'}</h3>
              <form onSubmit={handleBannerSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <input required type="text" value={newBannerForm.title} onChange={e => setNewBannerForm({...newBannerForm, title: e.target.value})} placeholder="Main Title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                <input required type="text" value={newBannerForm.subtitle} onChange={e => setNewBannerForm({...newBannerForm, subtitle: e.target.value})} placeholder="Tagline" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                <div onClick={() => newBannerFileInputRef.current?.click()} className="bg-white/5 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer text-[10px] font-black uppercase overflow-hidden relative min-h-[48px]">
                   {newBannerForm.image ? <img src={newBannerForm.image} className="absolute inset-0 w-full h-full object-cover opacity-30" /> : 'Upload Photo'}
                   <input type="file" ref={newBannerFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setNewBannerForm({...newBannerForm, image: img}))} className="hidden" accept="image/*" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-red-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-colors">
                    {editingId ? 'Commit' : 'Add'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="bg-gray-800 px-4 rounded-xl text-[10px] font-black">CANCEL</button>}
                </div>
              </form>
            </div>

            <div className="grid gap-6">
              {localBanners.map((banner, idx) => (
                <div 
                  key={banner.id} 
                  draggable 
                  onDragStart={() => handleDragStart(idx, 'BANNERS')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(idx, 'BANNERS')} 
                  className="p-6 bg-white/5 rounded-[2rem] border border-white/10 grid md:grid-cols-4 gap-6 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={banner.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Banner Node {idx + 1}</span>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditItem(banner, 'BANNERS')} className="text-blue-400 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => { const updated = localBanners.filter(b => b.id !== banner.id); setLocalBanners(updated); setBanners(updated); }} className="text-gray-500 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-lg">{banner.title}</h4>
                    <p className="text-sm text-gray-400">{banner.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'EVENTS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Event' : 'Organize Political Gathering'}</h3>
              <form onSubmit={handleEventSubmit} className="grid md:grid-cols-2 gap-6">
                <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} placeholder="Event Title" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <input required type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="Location (District/Venue)" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <select required value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold">
                  <option value="Meeting">VILLAGE MEETING</option>
                  <option value="Rally">PUBLIC RALLY</option>
                  <option value="Conference">STATE CONFERENCE</option>
                </select>
                <div onClick={() => fileInputRef.current?.click()} className="md:col-span-2 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative min-h-[160px]">
                   {eventForm.image ? <img src={eventForm.image} className="absolute inset-0 w-full h-full object-cover opacity-20" /> : 'Upload Event Poster'}
                   <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setEventForm({...eventForm, image: img}))} className="hidden" accept="image/*" />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="flex-1 py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {editingId ? 'Update Event Node' : 'Publish Event Node'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-xs">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="grid gap-6">
              {events.map((event, idx) => (
                <div 
                  key={event.id} 
                  draggable 
                  onDragStart={() => handleDragStart(idx, 'EVENTS')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(idx, 'EVENTS')} 
                  className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row gap-8 items-center group cursor-grab active:cursor-grabbing"
                >
                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">{event.type}</span>
                        <h4 className="text-xl font-black uppercase tracking-tight mt-1">{event.title}</h4>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditItem(event, 'EVENTS')} className="text-blue-400 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={async () => {
                          const updated = events.filter(e => e.id !== event.id);
                          await db.setEvents(updated);
                          setEvents(updated);
                        }} className="text-gray-500 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">📅 {event.date}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">📍 {event.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manifesto Tab */}
        {activeTab === 'MANIFESTO' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Policy Pillar' : 'Draft Policy Pillar'}</h3>
              <form onSubmit={handleManifestoSubmit} className="space-y-6">
                <input required type="text" value={manifestoForm.title} onChange={e => setManifestoForm({...manifestoForm, title: e.target.value})} placeholder="Pillar Title (e.g., Agricultural Reform)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <textarea required value={manifestoForm.desc} onChange={e => setManifestoForm({...manifestoForm, desc: e.target.value})} placeholder="Policy details..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 text-sm" />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    {editingId ? 'Update Vision Pillar' : 'Publish to Vision 2026'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-6 bg-gray-800 rounded-xl text-[10px] font-black">CANCEL</button>}
                </div>
              </form>
            </div>

            <div className="grid gap-6">
              {manifestoPoints.map((point, i) => (
                <div 
                  key={point.id} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'MANIFESTO')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'MANIFESTO')} 
                  className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex justify-between items-start group cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="flex-1">
                    <h4 className="text-xl font-black uppercase tracking-tight">{point.title}</h4>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{point.desc}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <button onClick={() => handleEditItem(point, 'MANIFESTO')} className="text-blue-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={async () => {
                      const updated = manifestoPoints.filter(p => p.id !== point.id);
                      await db.setManifestoPoints(updated);
                      setManifestoPoints(updated);
                    }} className="text-gray-500 hover:text-red-500 transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Polls Tab */}
        {activeTab === 'POLLS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Public Opinion Configuration</h3>
              <form onSubmit={handlePollUpdate} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Question</label>
                  <input 
                    type="text" 
                    value={pollData.question} 
                    onChange={e => setPollData({...pollData, question: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-bold text-lg"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Response Tiers (Drag to Order)</p>
                  {pollData.options.map((opt, idx) => (
                    <div 
                      key={opt.id} 
                      draggable 
                      onDragStart={() => handleDragStart(idx, 'POLLS')} 
                      onDragOver={handleDragOver} 
                      onDrop={() => handleDrop(idx, 'POLLS')}
                      className="grid grid-cols-12 gap-4 items-center bg-black/20 p-2 rounded-xl border border-white/5 cursor-grab active:cursor-grabbing"
                    >
                      <input 
                        type="text" 
                        value={opt.label} 
                        onChange={e => {
                          const updated = [...pollData.options];
                          updated[idx].label = e.target.value;
                          setPollData({...pollData, options: updated});
                        }} 
                        className="col-span-8 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold"
                      />
                      <input 
                        type="number" 
                        value={opt.percentage} 
                        onChange={e => {
                          const updated = [...pollData.options];
                          updated[idx].percentage = parseInt(e.target.value) || 0;
                          setPollData({...pollData, options: updated});
                        }} 
                        className="col-span-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-center"
                      />
                      <button type="button" onClick={() => {
                        const updated = pollData.options.filter((_, i) => i !== idx);
                        setPollData({...pollData, options: updated});
                      }} className="col-span-1 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setPollData({...pollData, options: [...pollData.options, { id: Date.now().toString(), label: 'New Option', percentage: 0 }]})} className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-white transition-all">+ Add Option</button>
                </div>

                <button type="submit" className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">Update Global Poll</button>
              </form>
            </div>
          </div>
        )}

        {/* Leadership Tab */}
        {activeTab === 'LEADERSHIP' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Leadership Record' : 'Onboard Leadership Node'}</h3>
              <form onSubmit={handleLeaderSubmit} className="grid md:grid-cols-2 gap-6">
                <input required type="text" value={leaderForm.name} onChange={e => setLeaderForm({...leaderForm, name: e.target.value})} placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <input required type="text" value={leaderForm.role} onChange={e => setLeaderForm({...leaderForm, role: e.target.value})} placeholder="Designation" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <textarea required value={leaderForm.bio} onChange={e => setLeaderForm({...leaderForm, bio: e.target.value})} placeholder="Official Biography..." className="md:col-span-2 h-32 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 text-sm" />
                <div onClick={() => leaderFileInputRef.current?.click()} className="md:col-span-2 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative min-h-[160px]">
                   {leaderForm.image ? <img src={leaderForm.image} className="absolute inset-0 w-full h-full object-cover opacity-20" /> : 'Select Official Portrait'}
                   <input type="file" ref={leaderFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setLeaderForm({...leaderForm, image: img}))} className="hidden" accept="image/*" />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="flex-1 py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {editingId ? 'Update Leader Record' : 'Authorize Leadership Record'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-xs">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {leadership.map((member, i) => (
                <div 
                  key={member.id} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'LEADERSHIP')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'LEADERSHIP')} 
                  className="bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden group cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img src={member.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleEditItem(member, 'LEADERSHIP')} className="bg-black/60 p-2 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={async () => {
                        const updated = leadership.filter(m => m.id !== member.id);
                        await db.setLeadership(updated);
                        setLeadership(updated);
                      }} className="bg-black/60 p-2 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="text-red-500 font-black text-xs uppercase tracking-widest">{member.role}</span>
                    <h4 className="text-2xl font-black uppercase tracking-tighter mt-1">{member.name}</h4>
                    <p className="text-sm text-gray-400 mt-4 leading-relaxed line-clamp-3 italic">"{member.bio}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ideology Tab */}
        {activeTab === 'IDEOLOGY' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Ideology Point' : 'Define Core Ideology'}</h3>
              <form onSubmit={handleIdeologySubmit} className="space-y-6">
                <input required type="text" value={ideologyForm.title} onChange={e => setIdeologyForm({...ideologyForm, title: e.target.value})} placeholder="Pillar Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <textarea required value={ideologyForm.description} onChange={e => setIdeologyForm({...ideologyForm, description: e.target.value})} placeholder="Elaborate on the value..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 text-sm" />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest">
                    {editingId ? 'Update Value' : 'Add Ideology Point'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-6 bg-gray-800 rounded-xl text-[10px] font-black">CANCEL</button>}
                </div>
              </form>
            </div>

            <div className="grid gap-6">
              {ideology.map((point, i) => (
                <div 
                  key={point.id} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'IDEOLOGY')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'IDEOLOGY')} 
                  className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex justify-between items-start cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-black uppercase tracking-tight">{point.title}</h4>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{point.description}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <button onClick={() => handleEditItem(point, 'IDEOLOGY')} className="text-blue-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={async () => {
                      const updated = ideology.filter(i => i.id !== point.id);
                      await db.setIdeology(updated);
                      setIdeology(updated);
                    }} className="text-gray-500 hover:text-red-500 transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Milestone' : 'Record New Milestone'}</h3>
              <form onSubmit={handleAchievementSubmit} className="grid md:grid-cols-2 gap-6">
                <input required type="text" value={achievementForm.year} onChange={e => setPartialAchievementForm({...achievementForm, year: e.target.value})} placeholder="Year/Month" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <input required type="text" value={achievementForm.title} onChange={e => setPartialAchievementForm({...achievementForm, title: e.target.value})} placeholder="Achievement Title" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <textarea required value={achievementForm.desc} onChange={e => setPartialAchievementForm({...achievementForm, desc: e.target.value})} placeholder="Detailed description..." className="md:col-span-2 h-32 bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 text-sm" />
                <div onClick={() => milestoneFileInputRef.current?.click()} className="md:col-span-2 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative min-h-[160px]">
                   {achievementForm.img ? <img src={achievementForm.img} className="absolute inset-0 w-full h-full object-cover opacity-20" /> : 'Upload Event Photo'}
                   <input type="file" ref={milestoneFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setPartialAchievementForm({...achievementForm, img}))} className="hidden" accept="image/*" />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="flex-1 py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {editingId ? 'Update Record' : 'Record Achievement'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-xs">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="grid gap-6">
              {achievements.map((ach, i) => (
                <div 
                  key={ach.id} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'ACHIEVEMENTS')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'ACHIEVEMENTS')} 
                  className="bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row overflow-hidden group cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                    <img src={ach.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ach.title} />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-red-600 font-black text-lg">{ach.year}</span>
                        <div className="flex gap-4">
                          <button onClick={() => handleEditItem(ach, 'ACHIEVEMENTS')} className="text-blue-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={async () => {
                            const updated = achievements.filter(a => a.id !== ach.id);
                            await db.setAchievements(updated);
                            setAchievements(updated);
                          }} className="text-gray-500 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tight">{ach.title}</h4>
                      <p className="text-sm text-gray-400 mt-2 leading-relaxed">{ach.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'RESOURCES' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
              <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Media Asset' : 'Deploy Media Assets'}</h3>
              <form onSubmit={handleMediaSubmit} className="grid md:grid-cols-2 gap-6">
                <input required type="text" value={mediaForm.title} onChange={e => setMediaForm({...mediaForm, title: e.target.value})} placeholder="Asset Display Name" className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold" />
                <select required value={mediaForm.type} onChange={e => setMediaForm({...mediaForm, type: e.target.value as any})} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-red-600 font-bold">
                  <option value="POSTER">OFFICIAL POSTER</option>
                  <option value="WALLPAPER">WALLPAPER</option>
                  <option value="VIDEO">CAMPAIGN VIDEO</option>
                </select>
                <div onClick={() => resourceFileInputRef.current?.click()} className="md:col-span-2 bg-white/5 border-2 border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative min-h-[160px]">
                   {mediaForm.url ? <img src={mediaForm.url} className="absolute inset-0 w-full h-full object-cover opacity-20" /> : 'Select Resource File'}
                   <input type="file" ref={resourceFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setMediaForm({...mediaForm, url: img}))} className="hidden" accept="image/*" />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button type="submit" className="flex-1 py-5 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-xs">
                    {editingId ? 'Update Resource' : 'Publish to Resource Hub'}
                  </button>
                  {editingId && <button type="button" onClick={clearForms} className="px-8 bg-gray-800 rounded-2xl font-black uppercase text-xs">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaAssets.map((asset, i) => (
                <div 
                  key={asset.id} 
                  draggable 
                  onDragStart={() => handleDragStart(i, 'RESOURCES')} 
                  onDragOver={handleDragOver} 
                  onDrop={() => handleDrop(i, 'RESOURCES')} 
                  className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden group cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all"
                >
                  <div className="h-48 overflow-hidden relative bg-gray-900">
                    <img src={asset.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => handleEditItem(asset, 'RESOURCES')} className="bg-black/60 p-2 rounded-lg text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={async () => {
                        const updated = mediaAssets.filter(a => a.id !== asset.id);
                        await db.setMedia(updated);
                        setMediaAssets(updated);
                      }} className="bg-black/60 p-2 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[8px] font-black uppercase text-red-500 tracking-[0.2em]">{asset.type}</span>
                    <h5 className="font-bold mt-1 uppercase tracking-tight truncate">{asset.title}</h5>
                    <p className="text-[9px] font-bold text-gray-500 mt-2">{asset.downloadCount} DOWNLOADS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'SUGGESTIONS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tight">Member Proposals</h3>
              <div className="flex bg-white/5 p-1 rounded-xl">
                {['All', 'Pending', 'Responded'].map(f => (
                  <button key={f} onClick={() => setSuggestionFilter(f as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${suggestionFilter === f ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>{f}</button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {suggestions
                .filter(s => suggestionFilter === 'All' || s.status === suggestionFilter)
                .map(sug => (
                  <div key={sug.id} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-red-500 font-black uppercase text-[10px] tracking-widest">{sug.status}</p>
                        <h4 className="text-lg font-black mt-1 uppercase tracking-tight">{sug.user}</h4>
                        <p className="text-[10px] text-gray-500 font-bold">{sug.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-medium">{sug.suggestion}</p>
                    
                    {sug.response && (
                      <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-yellow-400">
                        <p className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-2">Official Response</p>
                        <p className="text-sm text-gray-400 italic leading-relaxed">{sug.response}</p>
                      </div>
                    )}

                    {sug.status === 'Pending' && activeReplyId !== sug.id && (
                      <button onClick={() => { setActiveReplyId(sug.id); setReplyText(sug.response || ''); }} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">Respond</button>
                    )}

                    {activeReplyId === sug.id && (
                      <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-500 transition-all text-sm"
                          placeholder="Compose reply..."
                        />
                        <div className="flex gap-4">
                          <button 
                            disabled={isDrafting}
                            onClick={() => handleDraftReply(sug.id, sug.suggestion)}
                            className="bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                            {isDrafting ? 'Drafting...' : 'Draft with AI'}
                          </button>
                          <button onClick={() => handleSendReply(sug.id)} className="bg-blue-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Send Official Response</button>
                          <button onClick={() => setActiveReplyId(null)} className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-4">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
