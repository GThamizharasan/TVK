
import { ManifestoSuggestion, VoteOption, User, TVKEvent, Transaction, MediaAsset, ManifestoPoint, PollData, LeadershipMember, IdeologyPoint, Achievement } from '../types';
import { MOCK_SUGGESTIONS, INITIAL_VOTES, EVENTS, HOME_BANNERS, MANIFESTO_POINTS, FULL_COMMITTEE } from '../constants';

// PostgreSQL Table simulation
interface DBUser extends User {
  password?: string;
}

const TABLES = {
    USERS: 'tbl_users',
    NEWS_TICKER: 'tbl_news_ticker',
    BANNERS: 'tbl_banners',
    EVENTS: 'tbl_events',
    MANIFESTO: 'tbl_manifesto',
    POLLS: 'tbl_polls',
    LEADERSHIP: 'tbl_leadership',
    IDEOLOGY: 'tbl_ideology',
    ACHIEVEMENTS: 'tbl_achievements',
    MEDIA: 'tbl_media',
    TRANSACTIONS: 'tbl_transactions'
};

const initializeDB = () => {
  if (!localStorage.getItem(TABLES.USERS)) {
    const admin: DBUser = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'TVK Admin',
      email: 'admin@tvk.org',
      role: 'ADMIN',
      password: 'admin12$',
      joinedAt: new Date().toISOString(),
      ssoProvider: 'TVK_CORE',
      isEmailVerified: true,
      isPhoneVerified: true
    };
    localStorage.setItem(TABLES.USERS, JSON.stringify([admin]));
  }

  if (!localStorage.getItem(TABLES.NEWS_TICKER)) {
    localStorage.setItem(TABLES.NEWS_TICKER, JSON.stringify([
      "TVK State Conference to be held in Vikravandi this month.",
      "Join the movement: Dial *100# for membership enrollment.",
      "Equality is our vision - Thalapathy Vijay.",
    ]));
  }

  if (!localStorage.getItem(TABLES.BANNERS)) {
    localStorage.setItem(TABLES.BANNERS, JSON.stringify(HOME_BANNERS));
  }

  if (!localStorage.getItem(TABLES.EVENTS)) {
    localStorage.setItem(TABLES.EVENTS, JSON.stringify(EVENTS));
  }

  if (!localStorage.getItem(TABLES.MANIFESTO)) {
    localStorage.setItem(TABLES.MANIFESTO, JSON.stringify(MANIFESTO_POINTS.map(p => ({ ...p, id: crypto.randomUUID() }))));
  }

  if (!localStorage.getItem(TABLES.POLLS)) {
    const defaultPoll: PollData = {
      question: "Which sector needs the most urgent reform in Tamil Nadu?",
      options: [
        { id: 'opt1', label: "Education", percentage: 45 },
        { id: 'opt2', label: "Agriculture", percentage: 30 },
        { id: 'opt3', label: "Employment", percentage: 25 },
      ]
    };
    localStorage.setItem(TABLES.POLLS, JSON.stringify(defaultPoll));
  }

  if (!localStorage.getItem(TABLES.LEADERSHIP)) {
    localStorage.setItem(TABLES.LEADERSHIP, JSON.stringify(FULL_COMMITTEE));
  }

  if (!localStorage.getItem(TABLES.IDEOLOGY)) {
    localStorage.setItem(TABLES.IDEOLOGY, JSON.stringify([
      { id: 'id1', title: 'Secular Social Justice', description: 'Upholding equality across all demographics of Tamil society.' },
      { id: 'id2', title: 'State Sovereignty', description: 'Ensuring the rights and resources of Tamil Nadu are protected.' }
    ]));
  }

  if (!localStorage.getItem(TABLES.ACHIEVEMENTS)) {
    localStorage.setItem(TABLES.ACHIEVEMENTS, JSON.stringify([
      { id: 'ac1', year: "2024", title: "Party Foundation", desc: "Launch of TVK and registration with the Election Commission.", img: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c" }
    ]));
  }

  if (!localStorage.getItem(TABLES.MEDIA)) {
    localStorage.setItem(TABLES.MEDIA, JSON.stringify([
      { id: 'med1', title: 'Official Party Flag Poster', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952', type: 'POSTER', downloadCount: 5200 }
    ]));
  }

  if (!localStorage.getItem(TABLES.TRANSACTIONS)) {
    localStorage.setItem(TABLES.TRANSACTIONS, JSON.stringify([]));
  }
};

initializeDB();

export const db = {
  async authenticate(email: string, password?: string): Promise<DBUser | null> {
    const users: DBUser[] = JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      return user;
    }
    return null;
  },

  async upsertSSOUser(email: string, name: string, provider: 'GOOGLE' | 'FACEBOOK', avatar?: string): Promise<DBUser> {
    const users: DBUser[] = JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    let userIndex = users.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());

    if (userIndex > -1) {
      users[userIndex] = {
        ...users[userIndex],
        ssoProvider: provider,
        avatar: avatar || users[userIndex].avatar || `https://i.pravatar.cc/150?u=${email}`
      };
      localStorage.setItem(TABLES.USERS, JSON.stringify(users));
      await this.logTransaction({ type: 'MEMBERSHIP', userId: users[userIndex].id, userName: name, details: `Logged in via ${provider} SSO` });
      return users[userIndex];
    } else {
      const newUser: DBUser = {
        id: crypto.randomUUID(),
        name,
        email,
        role: 'MEMBER',
        membershipId: `TVK-${provider.charAt(0)}-${Date.now().toString().slice(-4)}`,
        avatar: avatar || `https://i.pravatar.cc/150?u=${email}`,
        joinedAt: new Date().toISOString(),
        ssoProvider: provider,
        isEmailVerified: true,
        isPhoneVerified: false
      };
      users.push(newUser);
      localStorage.setItem(TABLES.USERS, JSON.stringify(users));
      await this.logTransaction({ type: 'MEMBERSHIP', userId: newUser.id, userName: name, details: `Registered via ${provider} SSO` });
      return newUser;
    }
  },

  async registerMember(data: Partial<DBUser>): Promise<DBUser> {
    const users: DBUser[] = JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    const newUser: DBUser = {
      id: crypto.randomUUID(),
      name: data.name || 'Anonymous',
      email: data.email,
      password: data.password,
      role: 'MEMBER',
      membershipId: `TVK-${Date.now().toString().slice(-6)}`,
      mobile: data.mobile,
      constituency: data.constituency,
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.email}`,
      joinedAt: new Date().toISOString(),
      ssoProvider: data.ssoProvider || 'TVK_CORE',
      isEmailVerified: false,
      isPhoneVerified: false
    };
    users.push(newUser);
    localStorage.setItem(TABLES.USERS, JSON.stringify(users));
    await this.logTransaction({ type: 'MEMBERSHIP', userId: newUser.id, userName: newUser.name, details: 'User registered via portal' });
    return newUser;
  },

  async updateUser(userId: string, updates: Partial<DBUser>): Promise<void> {
    const users: DBUser[] = JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    localStorage.setItem(TABLES.USERS, JSON.stringify(updated));
  },

  async findUserByEmail(email: string): Promise<DBUser | null> {
    const users: DBUser[] = JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
    return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUsers(): Promise<DBUser[]> {
    return JSON.parse(localStorage.getItem(TABLES.USERS) || '[]');
  },

  async getTickerNews(): Promise<string[]> {
    return JSON.parse(localStorage.getItem(TABLES.NEWS_TICKER) || '[]');
  },

  async setTickerNews(items: string[]): Promise<void> {
    localStorage.setItem(TABLES.NEWS_TICKER, JSON.stringify(items));
  },

  async getBanners(): Promise<any[]> {
    return JSON.parse(localStorage.getItem(TABLES.BANNERS) || '[]');
  },

  async setBanners(banners: any[]): Promise<void> {
    localStorage.setItem(TABLES.BANNERS, JSON.stringify(banners));
  },

  async getEvents(): Promise<TVKEvent[]> {
    return JSON.parse(localStorage.getItem(TABLES.EVENTS) || '[]');
  },

  async setEvents(events: TVKEvent[]): Promise<void> {
    localStorage.setItem(TABLES.EVENTS, JSON.stringify(events));
  },

  async getManifestoPoints(): Promise<ManifestoPoint[]> {
    return JSON.parse(localStorage.getItem(TABLES.MANIFESTO) || '[]');
  },

  async setManifestoPoints(points: ManifestoPoint[]): Promise<void> {
    localStorage.setItem(TABLES.MANIFESTO, JSON.stringify(points));
  },

  async getPollData(): Promise<PollData> {
    return JSON.parse(localStorage.getItem(TABLES.POLLS) || '{"question":"","options":[]}');
  },

  async setPollData(poll: PollData): Promise<void> {
    localStorage.setItem(TABLES.POLLS, JSON.stringify(poll));
  },

  async getLeadership(): Promise<LeadershipMember[]> {
    return JSON.parse(localStorage.getItem(TABLES.LEADERSHIP) || '[]');
  },

  async setLeadership(members: LeadershipMember[]): Promise<void> {
    localStorage.setItem(TABLES.LEADERSHIP, JSON.stringify(members));
  },

  async getIdeology(): Promise<IdeologyPoint[]> {
    return JSON.parse(localStorage.getItem(TABLES.IDEOLOGY) || '[]');
  },

  async setIdeology(points: IdeologyPoint[]): Promise<void> {
    localStorage.setItem(TABLES.IDEOLOGY, JSON.stringify(points));
  },

  async getAchievements(): Promise<Achievement[]> {
    return JSON.parse(localStorage.getItem(TABLES.ACHIEVEMENTS) || '[]');
  },

  async setAchievements(items: Achievement[]): Promise<void> {
    localStorage.setItem(TABLES.ACHIEVEMENTS, JSON.stringify(items));
  },

  async getMedia(): Promise<MediaAsset[]> {
    return JSON.parse(localStorage.getItem(TABLES.MEDIA) || '[]');
  },

  async setMedia(assets: MediaAsset[]): Promise<void> {
    localStorage.setItem(TABLES.MEDIA, JSON.stringify(assets));
  },

  async incrementMediaDownload(id: string): Promise<void> {
    const assets: MediaAsset[] = JSON.parse(localStorage.getItem(TABLES.MEDIA) || '[]');
    const updated = assets.map(a => a.id === id ? { ...a, downloadCount: a.downloadCount + 1 } : a);
    localStorage.setItem(TABLES.MEDIA, JSON.stringify(updated));
  },

  async getSuggestions(): Promise<ManifestoSuggestion[]> {
    return JSON.parse(localStorage.getItem('tbl_suggestions') || '[]');
  },

  async updateSuggestionStatus(id: string, status: 'Responded', response: string): Promise<void> {
    const sugs: ManifestoSuggestion[] = JSON.parse(localStorage.getItem('tbl_suggestions') || '[]');
    const updated = sugs.map(s => s.id === id ? { ...s, status, response } : s);
    localStorage.setItem('tbl_suggestions', JSON.stringify(updated));
  },

  async logTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Promise<void> {
    const txs: Transaction[] = JSON.parse(localStorage.getItem(TABLES.TRANSACTIONS) || '[]');
    const newTx: Transaction = { ...tx, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    txs.unshift(newTx);
    localStorage.setItem(TABLES.TRANSACTIONS, JSON.stringify(txs.slice(0, 100)));
  },

  async getTransactions(): Promise<Transaction[]> {
    return JSON.parse(localStorage.getItem(TABLES.TRANSACTIONS) || '[]');
  },

  async getVotes(): Promise<VoteOption[]> {
    return JSON.parse(localStorage.getItem('tbl_votes') || '[]');
  },

  async castVote(optionId: string): Promise<void> {
    const votes: VoteOption[] = JSON.parse(localStorage.getItem('tbl_votes') || '[]');
    const updated = votes.map(v => v.id === optionId ? { ...v, votes: v.votes + 1 } : v);
    localStorage.setItem('tbl_votes', JSON.stringify(updated));
  }
};
