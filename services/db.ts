
import { ManifestoSuggestion, VoteOption, User, TVKEvent, Transaction, MediaAsset, ManifestoPoint, PollData, LeadershipMember, IdeologyPoint, Achievement } from '../types';
import { MOCK_SUGGESTIONS, INITIAL_VOTES, EVENTS, HOME_BANNERS, MANIFESTO_POINTS, FULL_COMMITTEE } from '../constants';

const STORE_KEYS = {
  SUGGESTIONS: 'tvk_db_suggestions',
  TICKER: 'tvk_db_ticker',
  VOTES: 'tvk_db_votes',
  USERS: 'tvk_db_users',
  EVENTS: 'tvk_db_events',
  TRANSACTIONS: 'tvk_db_transactions',
  MEDIA: 'tvk_db_media',
  BANNERS: 'tvk_db_banners',
  MANIFESTO: 'tvk_db_manifesto',
  POLL: 'tvk_db_poll',
  LEADERSHIP: 'tvk_db_leadership',
  IDEOLOGY: 'tvk_db_ideology',
  ACHIEVEMENTS: 'tvk_db_achievements'
};

const initializeDB = () => {
  if (!localStorage.getItem(STORE_KEYS.SUGGESTIONS)) {
    localStorage.setItem(STORE_KEYS.SUGGESTIONS, JSON.stringify(MOCK_SUGGESTIONS));
  }
  if (!localStorage.getItem(STORE_KEYS.TICKER)) {
    localStorage.setItem(STORE_KEYS.TICKER, JSON.stringify([
      "TVK State Conference to be held in Vikravandi this month.",
      "Join the movement: Dial *100# for membership enrollment.",
      "Education for all is our primary mission - Thalapathy Vijay.",
    ]));
  }
  if (!localStorage.getItem(STORE_KEYS.VOTES)) {
    localStorage.setItem(STORE_KEYS.VOTES, JSON.stringify(INITIAL_VOTES));
  }
  if (!localStorage.getItem(STORE_KEYS.USERS)) {
    const defaultAdmin: User = {
      id: 'admin-001',
      name: 'Admin User',
      email: 'admin@tvk.org',
      role: 'ADMIN',
      joinedAt: new Date().toISOString()
    };
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify([defaultAdmin]));
  }
  if (!localStorage.getItem(STORE_KEYS.EVENTS)) {
    localStorage.setItem(STORE_KEYS.EVENTS, JSON.stringify(EVENTS));
  }
  if (!localStorage.getItem(STORE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORE_KEYS.TRANSACTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORE_KEYS.MEDIA)) {
    localStorage.setItem(STORE_KEYS.MEDIA, JSON.stringify([
      { id: 'm1', title: 'TVK Official Poster 2024', url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c', type: 'POSTER', downloadCount: 1240 },
      { id: 'm2', title: 'Thalapathy Vision Wallpaper', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', type: 'WALLPAPER', downloadCount: 850 },
    ]));
  }
  if (!localStorage.getItem(STORE_KEYS.BANNERS)) {
    localStorage.setItem(STORE_KEYS.BANNERS, JSON.stringify(HOME_BANNERS));
  }
  if (!localStorage.getItem(STORE_KEYS.MANIFESTO)) {
    const initialPoints = MANIFESTO_POINTS.map(p => ({ ...p, id: crypto.randomUUID() }));
    localStorage.setItem(STORE_KEYS.MANIFESTO, JSON.stringify(initialPoints));
  }
  if (!localStorage.getItem(STORE_KEYS.POLL)) {
    const initialPoll: PollData = {
      question: "Do you believe current state policies are effectively addressing youth unemployment?",
      options: [
        { id: 'p1', label: "Strongly Agree", percentage: 12 },
        { id: 'p2', label: "Agree", percentage: 18 },
        { id: 'p3', label: "Neutral", percentage: 15 },
        { id: 'p4', label: "Disagree", percentage: 25 },
        { id: 'p5', label: "Strongly Disagree", percentage: 30 },
      ]
    };
    localStorage.setItem(STORE_KEYS.POLL, JSON.stringify(initialPoll));
  }
  if (!localStorage.getItem(STORE_KEYS.LEADERSHIP)) {
    localStorage.setItem(STORE_KEYS.LEADERSHIP, JSON.stringify(FULL_COMMITTEE));
  }
  if (!localStorage.getItem(STORE_KEYS.IDEOLOGY)) {
    localStorage.setItem(STORE_KEYS.IDEOLOGY, JSON.stringify([
      { id: 'i1', title: 'Secular Social Justice', description: 'TVK stands for a Tamil Nadu where no citizen is left behind, regardless of their caste, religion, or background.' },
      { id: 'i2', title: 'Democratic Progress', description: 'Power belongs to the people. We believe in transparent governance led by youth energy and experienced wisdom.' }
    ]));
  }
  if (!localStorage.getItem(STORE_KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify([
      { id: 'a1', year: "Oct 2024", title: "The 1 Crore Mark", desc: "Achieved an unprecedented milestone of 1 Crore registered members within months of party launch.", img: "https://images.unsplash.com/photo-1529070532902-179e50436d41?auto=format&fit=crop&w=800&q=80" },
      { id: 'a2', year: "Dec 2024", title: "State Conference", desc: "Historic gathering at Vikravandi where the party vision was unveiled to millions of supporters.", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" }
    ]));
  }
};

initializeDB();

export const db = {
  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(STORE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  },

  async registerMember(data: Partial<User>): Promise<User> {
    const users = await this.getUsers();
    const membershipId = `TVK-2024-${Math.floor(Math.random() * 90000) + 10000}`;
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name || 'Unknown',
      email: data.email,
      role: data.role || 'MEMBER',
      membershipId,
      mobile: data.mobile,
      constituency: data.constituency,
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email || data.mobile}`,
      joinedAt: new Date().toISOString(),
      ssoProvider: data.ssoProvider
    };
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify([...users, newUser]));
    await this.logTransaction({ type: 'MEMBERSHIP', userId: newUser.id, userName: newUser.name, details: `New registration via ${newUser.ssoProvider || 'DIRECT'}` });
    return newUser;
  },

  async updateUserAvatar(userId: string, avatar: string): Promise<void> {
    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, avatar } : u);
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(updated));
  },

  async getManifestoPoints(): Promise<ManifestoPoint[]> {
    const data = localStorage.getItem(STORE_KEYS.MANIFESTO);
    return data ? JSON.parse(data) : [];
  },

  async setManifestoPoints(points: ManifestoPoint[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.MANIFESTO, JSON.stringify(points));
  },

  async getLeadership(): Promise<LeadershipMember[]> {
    const data = localStorage.getItem(STORE_KEYS.LEADERSHIP);
    return data ? JSON.parse(data) : [];
  },

  async setLeadership(members: LeadershipMember[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.LEADERSHIP, JSON.stringify(members));
  },

  async getIdeology(): Promise<IdeologyPoint[]> {
    const data = localStorage.getItem(STORE_KEYS.IDEOLOGY);
    return data ? JSON.parse(data) : [];
  },

  async setIdeology(points: IdeologyPoint[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.IDEOLOGY, JSON.stringify(points));
  },

  async getAchievements(): Promise<Achievement[]> {
    const data = localStorage.getItem(STORE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  },

  async setAchievements(achievements: Achievement[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  async getPollData(): Promise<PollData> {
    const data = localStorage.getItem(STORE_KEYS.POLL);
    return data ? JSON.parse(data) : { question: '', options: [] };
  },

  async setPollData(poll: PollData): Promise<void> {
    localStorage.setItem(STORE_KEYS.POLL, JSON.stringify(poll));
  },

  async logTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Promise<void> {
    const data = localStorage.getItem(STORE_KEYS.TRANSACTIONS);
    const transactions = data ? JSON.parse(data) : [];
    const newTx: Transaction = { ...tx, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    localStorage.setItem(STORE_KEYS.TRANSACTIONS, JSON.stringify([newTx, ...transactions]));
  },

  async getTransactions(): Promise<Transaction[]> {
    const data = localStorage.getItem(STORE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  async getMedia(): Promise<MediaAsset[]> {
    const data = localStorage.getItem(STORE_KEYS.MEDIA);
    return data ? JSON.parse(data) : [];
  },

  async setMedia(assets: MediaAsset[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.MEDIA, JSON.stringify(assets));
  },

  async incrementMediaDownload(id: string): Promise<void> {
    const media = await this.getMedia();
    const updated = media.map(m => m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m);
    localStorage.setItem(STORE_KEYS.MEDIA, JSON.stringify(updated));
  },

  async getEvents(): Promise<TVKEvent[]> {
    const data = localStorage.getItem(STORE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },

  async setEvents(events: TVKEvent[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.EVENTS, JSON.stringify(events));
  },

  async getBanners(): Promise<any[]> {
    const data = localStorage.getItem(STORE_KEYS.BANNERS);
    return data ? JSON.parse(data) : [];
  },

  async setBanners(banners: any[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.BANNERS, JSON.stringify(banners));
  },

  async getSuggestions(): Promise<ManifestoSuggestion[]> {
    const data = localStorage.getItem(STORE_KEYS.SUGGESTIONS);
    return data ? JSON.parse(data) : [];
  },

  async updateSuggestionStatus(id: string, status: 'Responded', response: string): Promise<void> {
    const all = await this.getSuggestions();
    const updated = all.map(s => s.id === id ? { ...s, status, response } : s);
    localStorage.setItem(STORE_KEYS.SUGGESTIONS, JSON.stringify(updated));
  },

  async getTickerNews(): Promise<string[]> {
    const data = localStorage.getItem(STORE_KEYS.TICKER);
    return data ? JSON.parse(data) : [];
  },

  async setTickerNews(items: string[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.TICKER, JSON.stringify(items));
  },

  async getVotes(): Promise<VoteOption[]> {
    const data = localStorage.getItem(STORE_KEYS.VOTES);
    return data ? JSON.parse(data) : [];
  },

  async castVote(optionId: string): Promise<void> {
    const all = await this.getVotes();
    const updated = all.map(v => v.id === optionId ? { ...v, votes: v.votes + 1 } : v);
    localStorage.setItem(STORE_KEYS.VOTES, JSON.stringify(updated));
  }
};
