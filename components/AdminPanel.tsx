
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

const SUGGESTIONS_WEEKLY_DATA = [
  { day: 'Mon', suggestions: 24 },
  { day: 'Tue', suggestions: 32 },
  { day: 'Wed', suggestions: 18 },
  { day: 'Thu', suggestions: 45 },
  { day: 'Fri', suggestions: 38 },
  { day: 'Sat', suggestions: 52 },
  { day: 'Sun', suggestions: 30 },
];

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
  
  // Edit States
  const [editingId, setEditingId] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedItem, setDraggedItem] = useState<{ index: number; type: AdminTab } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const leaderFileInputRef = useRef<HTMLInputElement>(null);
  const milestoneFileInputRef = useRef<HTMLInputElement>(null);
  const resourceFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  // Image Processor
  const processImage = (file: File, callback: (result: string) => void) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (JPG, PNG, or WebP).");
    }
  };

  // --- REORDERING LOGIC ---
  const handleDragStart = (index: number, type: AdminTab) => {
    setDraggedItem({ index, type });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = async (dropIndex: number, type: AdminTab) => {
    if (!draggedItem || draggedItem.type !== type || draggedItem.index === dropIndex) return;

    let updatedList: any[] = [];
    
    if (type === 'TICKER') {
      updatedList = [...tickerItems];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await setTickerItems(updatedList);
    } else if (type === 'EVENTS') {
      updatedList = [...events];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setEvents(updatedList);
      setEvents(updatedList);
    } else if (type === 'MANIFESTO') {
      updatedList = [...manifestoPoints];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setManifestoPoints(updatedList);
      setManifestoPoints(updatedList);
    } else if (type === 'LEADERSHIP') {
      updatedList = [...leadership];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setLeadership(updatedList);
      setLeadership(updatedList);
    } else if (type === 'ACHIEVEMENTS') {
      updatedList = [...achievements];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setAchievements(updatedList);
      setAchievements(updatedList);
    } else if (type === 'IDEOLOGY') {
      updatedList = [...ideology];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setIdeology(updatedList);
      setIdeology(updatedList);
    } else if (type === 'RESOURCES') {
      updatedList = [...mediaAssets];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      await db.setMedia(updatedList);
      setMediaAssets(updatedList);
    } else if (type === 'BANNERS') {
      updatedList = [...localBanners];
      const [removed] = updatedList.splice(draggedItem.index, 1);
      updatedList.splice(dropIndex, 0, removed);
      setLocalBanners(updatedList);
      await setBanners(updatedList);
    }

    setDraggedItem(null);
    if (onDataChange) onDataChange();
  };

  // --- FORM HANDLERS ---
  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const updated = [newItem, ...tickerItems];
    await setTickerItems(updated);
    setNewItem('');
    if (onDataChange) onDataChange();
  };

  const removeTickerItem = async (index: number) => {
    const updated = tickerItems.filter((_, i) => i !== index);
    await setTickerItems(updated);
    if (onDataChange) onDataChange();
  };

  const handleAddNewBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerForm.title || !newBannerForm.image) return;
    const newBanner = { ...newBannerForm, id: Date.now() };
    const updated = [newBanner, ...localBanners];
    await setBanners(updated);
    setLocalBanners(updated);
    setNewBannerForm({ title: '', subtitle: '', cta: 'Enroll Now', image: '', accent: '#FFD700' });
    if (onDataChange) onDataChange();
  };

  const removeBanner = async (id: any) => {
    const updated = localBanners.filter(b => b.id !== id);
    await setBanners(updated);
    setLocalBanners(updated);
    if (onDataChange) onDataChange();
  };

  const saveBanners = async () => {
    await setBanners(localBanners);
    alert("Carousel configuration synchronized with live server.");
    if (onDataChange) onDataChange();
  };

  const handleBannerImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, (img) => {
        const updated = [...localBanners];
        updated[index] = { ...updated[index], image: img };
        setLocalBanners(updated);
      });
    }
  };

  const handleLeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, (img) => {
        setLeaderForm(prev => ({ ...prev, image: img }));
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file, (img) => {
        setEventForm(prev => ({ ...prev, image: img }));
      });
    }
  };

  const updateBannerField = (index: number, field: string, value: string) => {
    const updated = [...localBanners];
    updated[index] = { ...updated[index], [field]: value };
    setLocalBanners(updated);
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.year || !achievementForm.title || !achievementForm.desc) return;
    
    let updated: Achievement[];
    if (editingId) {
      updated = achievements.map(a => a.id === editingId ? { ...achievementForm, id: editingId } as Achievement : a);
    } else {
      const newAch: Achievement = { 
        id: crypto.randomUUID(), 
        year: achievementForm.year!, 
        title: achievementForm.title!, 
        desc: achievementForm.desc!, 
        img: achievementForm.img || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c' 
      };
      updated = [...achievements, newAch];
    }
    
    await db.setAchievements(updated);
    setAchievements(updated);
    setPartialAchievementForm({ year: '', title: '', desc: '', img: '' });
    setEditingId(null);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.title || !mediaForm.url) return;
    
    let updated: MediaAsset[];
    if (editingId) {
      updated = mediaAssets.map(m => m.id === editingId ? { ...mediaForm, id: editingId } as MediaAsset : m);
    } else {
      const newMed: MediaAsset = { id: crypto.randomUUID(), title: mediaForm.title, url: mediaForm.url, type: mediaForm.type || 'POSTER', downloadCount: 0 };
      updated = [...mediaAssets, newMed];
    }
    
    await db.setMedia(updated);
    setMediaAssets(updated);
    setMediaForm({ title: '', url: '', type: 'POSTER' });
    setEditingId(null);
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderForm.name || !leaderForm.role) return;
    
    let updated: LeadershipMember[];
    if (editingId) {
      updated = leadership.map(l => l.id === editingId ? { ...leaderForm, id: editingId } as LeadershipMember : l);
    } else {
      const newLeader: LeadershipMember = {
        id: crypto.randomUUID(),
        name: leaderForm.name!,
        role: leaderForm.role!,
        bio: leaderForm.bio || '',
        image: leaderForm.image || 'https://i.pravatar.cc/300'
      };
      updated = [...leadership, newLeader];
    }
    
    await db.setLeadership(updated);
    setLeadership(updated);
    setLeaderForm({ name: '', role: '', bio: '', image: '' });
    setEditingId(null);
    if (onDataChange) onDataChange();
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.location) return;

    let updated: TVKEvent[];
    if (editingId) {
      updated = events.map(ev => ev.id === editingId ? { ...eventForm, id: editingId } as TVKEvent : ev);
    } else {
      const newEvent: TVKEvent = {
        id: crypto.randomUUID(),
        title: eventForm.title!,
        date: eventForm.date!,
        location: eventForm.location!,
        type: (eventForm.type as any) || 'Meeting',
        image: eventForm.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
      };
      updated = [newEvent, ...events];
    }
    
    await db.setEvents(updated);
    setEvents(updated);
    setEventForm({ title: '', date: '', location: '', type: 'Meeting', image: '' });
    setEditingId(null);
    if (onDataChange) onDataChange();
  };

  const handleAddManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manifestoForm.title || !manifestoForm.desc) return;
    
    let updated: ManifestoPoint[];
    if (editingId) {
      updated = manifestoPoints.map(p => p.id === editingId ? { ...manifestoForm, id: editingId } : p);
    } else {
      const newPoint = { id: crypto.randomUUID(), ...manifestoForm };
      updated = [...manifestoPoints, newPoint];
    }
    
    await db.setManifestoPoints(updated);
    setManifestoPoints(updated);
    setManifestoForm({title:'', desc:''});
    setEditingId(null);
  };

  const handleAddIdeology = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideologyForm.title || !ideologyForm.description) return;
    
    let updated: IdeologyPoint[];
    if (editingId) {
      updated = ideology.map(i => i.id === editingId ? { ...ideologyForm, id: editingId } : i);
    } else {
      const newPoint = { id: crypto.randomUUID(), ...ideologyForm };
      updated = [...ideology, newPoint];
    }
    
    await db.setIdeology(updated);
    setIdeology(updated);
    setIdeologyForm({title:'', description:''});
    setEditingId(null);
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
    setSuggestions(updated);
    setActiveReplyId(null);
    setReplyText('');
    if (onDataChange) onDataChange();
  };

  const savePoll = async () => {
    await db.setPollData(pollData);
    alert("Poll configuration updated.");
    if (onDataChange) onDataChange();
  };

  const filteredSuggestions = suggestions.filter(s => 
    suggestionFilter === 'All' ? true : s.status === suggestionFilter
  );

  const TABS = [
    { id: 'ANALYTICS', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'ACHIEVEMENTS', label: 'Milestones', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z' },
    { id: 'RESOURCES', label: 'Resources', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'IDEOLOGY', label: 'Ideology', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'LEADERSHIP', label: 'Leadership', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'TICKER', label: 'Live Ticker', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'SUGGESTIONS', label: 'Proposals', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
    { id: 'EVENTS', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'MANIFESTO', label: 'Manifesto', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'POLLS', label: 'Polls', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'BANNERS', label: 'Carousel', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ];

  const DragIndicator = () => (
    <div className="text-gray-600 px-2 group-hover:text-red-500 transition-colors">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4zM7 9a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4zm-6 7a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4zm3 0a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    </div>
  );

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col lg:flex-row font-poppins">
      <aside className="w-full lg:w-72 bg-gray-900 border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 z-40 overflow-y-auto max-h-screen sticky top-0">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-xl font-black tracking-tighter">TVK <span className="text-red-600 italic">OPS</span></h1>
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
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Registered Members', value: (registeredUsers.length + 12452088).toLocaleString(), color: 'text-red-600' },
                { label: 'Party Milestones', value: achievements.length, color: 'text-yellow-400' },
                { label: 'Vision Proposals', value: suggestions.length, color: 'text-blue-400' },
                { label: 'Active Events', value: events.length, color: 'text-green-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-10">Proposal Flow</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SUGGESTIONS_WEEKLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '16px' }} />
                      <Bar dataKey="suggestions" fill="#D41D24" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8">System Transactions</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <p className="text-[11px] font-bold text-gray-200 mb-1">{tx.details}</p>
                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-black uppercase">
                        <span>{tx.userName}</span>
                        <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ACHIEVEMENTS' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Milestone' : 'Record New Milestone'}</h3>
                <form onSubmit={handleAddAchievement} className="space-y-6">
                  <input required type="text" value={achievementForm.year} onChange={e => setPartialAchievementForm({...achievementForm, year: e.target.value})} placeholder="Year (e.g. Oct 2024)" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <input required type="text" value={achievementForm.title} onChange={e => setPartialAchievementForm({...achievementForm, title: e.target.value})} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <textarea required value={achievementForm.desc} onChange={e => setPartialAchievementForm({...achievementForm, desc: e.target.value})} placeholder="Description..." className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <div onClick={() => milestoneFileInputRef.current?.click()} className="h-40 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden">
                    {achievementForm.img ? <img src={achievementForm.img} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <span className="text-gray-400 text-xs font-black uppercase">Upload Media</span>}
                  </div>
                  <input type="file" ref={milestoneFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setPartialAchievementForm({...achievementForm, img}))} className="hidden" accept="image/*" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Milestone' : 'Deploy Milestone'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setPartialAchievementForm({ year:'', title:'', desc:'', img:'' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Active Timeline (Drag to reorder)</h3>
                <div className="space-y-3">
                  {achievements.map((a, idx) => (
                    <div 
                      key={a.id} 
                      draggable 
                      onDragStart={() => handleDragStart(idx, 'ACHIEVEMENTS')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'ACHIEVEMENTS')}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all group"
                    >
                      <DragIndicator />
                      <img src={a.img} className="w-20 h-20 rounded-xl object-cover pointer-events-none" />
                      <div className="flex-1">
                        <p className="text-[10px] text-red-500 font-black">{a.year}</p>
                        <h4 className="font-bold text-sm">{a.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(a.id); setPartialAchievementForm(a); }} className="text-gray-600 hover:text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = achievements.filter(x => x.id !== a.id); await db.setAchievements(updated); setAchievements(updated); }} className="text-gray-600 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'RESOURCES' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Resource' : 'Resource Hub Control'}</h3>
                <form onSubmit={handleAddResource} className="space-y-6">
                  <input required type="text" value={mediaForm.title} onChange={e => setMediaForm({...mediaForm, title: e.target.value})} placeholder="Asset Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <select value={mediaForm.type} onChange={e => setMediaForm({...mediaForm, type: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white">
                    <option value="POSTER">POSTER</option>
                    <option value="WALLPAPER">WALLPAPER</option>
                    <option value="VIDEO">VIDEO</option>
                  </select>
                  <input required type="text" value={mediaForm.url} onChange={e => setMediaForm({...mediaForm, url: e.target.value})} placeholder="Media URL or Base64" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Resource' : 'Sync Resource'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setMediaForm({ title: '', url: '', type: 'POSTER' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Library Inventory (Drag to reorder)</h3>
                <div className="space-y-3">
                  {mediaAssets.map((m, idx) => (
                    <div 
                      key={m.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx, 'RESOURCES')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'RESOURCES')}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center cursor-grab hover:bg-white/10 transition-all group"
                    >
                      <DragIndicator />
                      <div className="w-16 h-16 bg-gray-800 rounded-xl overflow-hidden"><img src={m.url} className="w-full h-full object-cover" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm truncate">{m.title}</h4>
                        <p className="text-[9px] text-gray-500 font-black uppercase">{m.type} • {m.downloadCount} DL</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(m.id); setMediaForm(m); }} className="text-gray-600 hover:text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = mediaAssets.filter(x => x.id !== m.id); await db.setMedia(updated); setMediaAssets(updated); }} className="text-gray-600 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LEADERSHIP' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Leader' : 'Command Structure'}</h3>
                <form onSubmit={handleAddLeader} className="space-y-6">
                  <input required type="text" value={leaderForm.name} onChange={e => setLeaderForm({...leaderForm, name: e.target.value})} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <input required type="text" value={leaderForm.role} onChange={e => setLeaderForm({...leaderForm, role: e.target.value})} placeholder="Role" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <textarea value={leaderForm.bio} onChange={e => setLeaderForm({...leaderForm, bio: e.target.value})} placeholder="Biography..." className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <div onClick={() => leaderFileInputRef.current?.click()} className="h-40 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden">
                    {leaderForm.image ? <img src={leaderForm.image} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <span className="text-gray-400 text-xs font-black uppercase">Portrait Upload</span>}
                  </div>
                  <input type="file" ref={leaderFileInputRef} onChange={handleLeaderImageUpload} className="hidden" accept="image/*" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Committee' : 'Update Committee'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setLeaderForm({ name: '', role: '', bio: '', image: '' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Active Leadership (Drag to order)</h3>
                <div className="space-y-3">
                  {leadership.map((l, idx) => (
                    <div 
                      key={l.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx, 'LEADERSHIP')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'LEADERSHIP')}
                      className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center cursor-grab hover:bg-white/10 transition-all group"
                    >
                      <DragIndicator />
                      <img src={l.image} className="w-16 h-16 rounded-xl object-cover pointer-events-none" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{l.name}</h4>
                        <p className="text-[10px] text-red-500 font-bold uppercase">{l.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(l.id); setLeaderForm(l); }} className="text-gray-600 hover:text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = leadership.filter(x => x.id !== l.id); await db.setLeadership(updated); setLeadership(updated); }} className="text-gray-600 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TICKER' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <h3 className="text-xl font-black uppercase mb-8">Broadcast Center</h3>
            <form onSubmit={handleAddTicker} className="mb-12 flex gap-4">
              <input required type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Live News Flash..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-red-600 text-white" />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">On Air</button>
            </form>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-2">Current Broadcast Queue (Drag to reorder)</h3>
              {tickerItems.map((item, idx) => (
                <div 
                  key={idx} 
                  draggable
                  onDragStart={() => handleDragStart(idx, 'TICKER')}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx, 'TICKER')}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/5 cursor-grab hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <DragIndicator />
                    <input 
                      type="text" 
                      value={item} 
                      onChange={(e) => {
                        const updated = [...tickerItems];
                        updated[idx] = e.target.value;
                        setTickerItems(updated);
                      }}
                      className="bg-transparent border-none outline-none text-sm font-bold text-gray-200 w-full"
                    />
                  </div>
                  <button onClick={() => removeTickerItem(idx)} className="text-gray-600 hover:text-red-500 ml-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'EVENTS' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <form onSubmit={handleAddEvent} className="space-y-6">
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Event' : 'Deploy Event'}</h3>
                <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} placeholder="Event Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white">
                    <option value="Conference">Conference</option>
                    <option value="Rally">Rally</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <input required type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                <div onClick={() => fileInputRef.current?.click()} className="h-40 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden">
                  {eventForm.image ? <img src={eventForm.image} className="absolute inset-0 w-full h-full object-cover opacity-50" /> : <span className="text-gray-400 text-xs font-black uppercase">Poster Upload</span>}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Event' : 'Publicize Event'}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setEventForm({ title: '', date: '', location: '', type: 'Meeting', image: '' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                </div>
              </form>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Upcoming Node (Drag to prioritize)</h3>
                <div className="space-y-3">
                  {events.map((ev, idx) => (
                    <div 
                      key={ev.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx, 'EVENTS')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'EVENTS')}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-grab hover:bg-white/10 transition-all group"
                    >
                      <DragIndicator />
                      <img src={ev.image} className="w-12 h-12 rounded-lg object-cover pointer-events-none" />
                      <div className="flex-1 truncate">
                        <h4 className="font-bold text-sm">{ev.title}</h4>
                        <p className="text-[10px] text-gray-500 font-black uppercase">{ev.date} • {ev.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(ev.id); setEventForm(ev); }} className="text-gray-600 hover:text-blue-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = events.filter(x => x.id !== ev.id); await db.setEvents(updated); setEvents(updated); }} className="text-gray-600 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'MANIFESTO' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Vision Pillar' : 'Vision Editor'}</h3>
                <form onSubmit={handleAddManifesto} className="space-y-6">
                  <input required type="text" value={manifestoForm.title} onChange={e => setManifestoForm({...manifestoForm, title: e.target.value})} placeholder="Pillar Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <textarea required value={manifestoForm.desc} onChange={e => setManifestoForm({...manifestoForm, desc: e.target.value})} placeholder="Policy Details..." className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Vision' : 'Add Vision Pillar'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setManifestoForm({ title:'', desc:'' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Active Pillars (Drag to reorder)</h3>
                <div className="space-y-3">
                  {manifestoPoints.map((p, idx) => (
                    <div 
                      key={p.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx, 'MANIFESTO')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'MANIFESTO')}
                      className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between group cursor-grab hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <DragIndicator />
                        <div className="pointer-events-none"><h4 className="font-bold text-red-500">{p.title}</h4><p className="text-xs text-gray-400 line-clamp-2">{p.desc}</p></div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <button onClick={() => { setEditingId(p.id); setManifestoForm(p); }} className="text-gray-600 hover:text-blue-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = manifestoPoints.filter(x => x.id !== p.id); await db.setManifestoPoints(updated); setManifestoPoints(updated); }} className="text-gray-600 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'POLLS' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-xl font-black uppercase tracking-tight">Public Opinion Config</h3>
              <button onClick={savePoll} className="bg-red-600 px-8 py-3 rounded-xl font-black uppercase text-[10px]">Save Config</button>
            </div>
            <div className="space-y-8">
              <input type="text" value={pollData.question} onChange={e => setPollData({...pollData, question: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold" />
              <div className="grid gap-4">
                {pollData.options.map((opt, idx) => (
                  <div key={opt.id} className="flex gap-4 items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                    <input type="text" value={opt.label} onChange={e => { const updated = [...pollData.options]; updated[idx].label = e.target.value; setPollData({...pollData, options: updated}); }} className="flex-1 bg-transparent outline-none" />
                    <input type="number" value={opt.percentage} onChange={e => { const updated = [...pollData.options]; updated[idx].percentage = parseInt(e.target.value); setPollData({...pollData, options: updated}); }} className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 text-center text-yellow-400 font-black" />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'BANNERS' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Main Carousel</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Manage existing banners or create new ones</p>
              </div>
              <button onClick={saveBanners} className="bg-blue-600 px-10 py-3 rounded-xl font-black uppercase text-[10px]">Save All Changes</button>
            </div>

            {/* Create New Banner Form */}
            <div className="bg-black/20 border border-white/10 p-8 rounded-[2.5rem] mb-12 animate-in fade-in duration-500">
              <h4 className="text-xs font-black uppercase text-red-500 tracking-widest mb-6">Create New Banner Slide</h4>
              <form onSubmit={handleAddNewBanner} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <input required type="text" value={newBannerForm.title} onChange={e => setNewBannerForm({...newBannerForm, title: e.target.value})} placeholder="Main Title (Tamil preferred)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                <input required type="text" value={newBannerForm.subtitle} onChange={e => setNewBannerForm({...newBannerForm, subtitle: e.target.value})} placeholder="Tagline/Subtitle" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                <input required type="text" value={newBannerForm.cta} onChange={e => setNewBannerForm({...newBannerForm, cta: e.target.value})} placeholder="Button Text (e.g. Enroll Now)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                <div className="flex gap-2">
                   <div 
                      onClick={() => newBannerFileInputRef.current?.click()}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer text-[10px] font-black uppercase overflow-hidden relative"
                   >
                     {newBannerForm.image ? <img src={newBannerForm.image} className="absolute inset-0 w-full h-full object-cover opacity-30" /> : null}
                     <span className="relative z-10">{newBannerForm.image ? 'Change Photo' : 'Upload Image'}</span>
                     <input type="file" ref={newBannerFileInputRef} onChange={e => e.target.files?.[0] && processImage(e.target.files[0], img => setNewBannerForm({...newBannerForm, image: img}))} className="hidden" accept="image/*" />
                   </div>
                   <button type="submit" className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px]">Add Slide</button>
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
                  className="p-8 bg-black/40 rounded-[2.5rem] border border-white/10 grid lg:grid-cols-3 gap-8 cursor-grab active:cursor-grabbing hover:bg-black/60 transition-all group"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover:border-red-500/50 transition-colors cursor-pointer" onClick={() => bannerFileRefs.current[idx]?.click()}>
                    <img src={banner.image} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-black uppercase">Change Image</div>
                    <input type="file" ref={el => { bannerFileRefs.current[idx] = el; }} onChange={e => handleBannerImageUpload(idx, e)} className="hidden" />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <DragIndicator />
                         <span className="text-[9px] font-black text-red-500 uppercase">NODE {idx + 1}</span>
                      </div>
                      <button onClick={() => removeBanner(banner.id)} className="text-gray-600 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <input type="text" value={banner.title} onChange={e => updateBannerField(idx, 'title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-red-600 outline-none" />
                    <textarea value={banner.subtitle} onChange={e => updateBannerField(idx, 'subtitle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-20 focus:border-red-600 outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'IDEOLOGY' && (
          <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 animate-in slide-in-from-bottom-6">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-black uppercase mb-8">{editingId ? 'Edit Ideology Point' : 'Pillar of Justice'}</h3>
                <form onSubmit={handleAddIdeology} className="space-y-6">
                  <input required type="text" value={ideologyForm.title} onChange={e => setIdeologyForm({...ideologyForm, title: e.target.value})} placeholder="Ideology Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <textarea required value={ideologyForm.description} onChange={e => setIdeologyForm({...ideologyForm, description: e.target.value})} placeholder="Philosophical basis..." className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest">{editingId ? 'Update Value' : 'Update Core Values'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setIdeologyForm({ title:'', description:'' }); }} className="px-8 py-5 bg-white/10 rounded-2xl font-black uppercase tracking-widest">Cancel</button>}
                  </div>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Philosophy Hub (Drag to reorder)</h3>
                <div className="space-y-3">
                  {ideology.map((p, idx) => (
                    <div 
                      key={p.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx, 'IDEOLOGY')}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx, 'IDEOLOGY')}
                      className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between cursor-grab hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <DragIndicator />
                        <div className="pointer-events-none"><h4 className="font-bold text-red-500">{p.title}</h4><p className="text-xs text-gray-400">{p.description}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(p.id); setIdeologyForm(p); }} className="text-gray-600 hover:text-blue-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={async () => { const updated = ideology.filter(x => x.id !== p.id); await db.setIdeology(updated); setIdeology(updated); }} className="text-gray-600 hover:text-red-500 h-fit ml-4"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
