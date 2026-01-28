
/**
 * POSTGRESQL SCHEMA DEFINITION (Final Professional Standard)
 * 
 * CREATE TABLE users (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   role TEXT CHECK (role IN ('GUEST', 'MEMBER', 'ADMIN')) DEFAULT 'GUEST',
 *   membership_id TEXT UNIQUE,
 *   mobile TEXT UNIQUE,
 *   constituency TEXT,
 *   avatar TEXT, -- Base64 for images
 *   joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * ... (other tables)
 */

import { ManifestoSuggestion, VoteOption, User, TVKEvent, Transaction, MediaAsset } from '../types';
import { MOCK_SUGGESTIONS, INITIAL_VOTES, EVENTS } from '../constants';

const STORE_KEYS = {
  SUGGESTIONS: 'tvk_db_suggestions',
  TICKER: 'tvk_db_ticker',
  VOTES: 'tvk_db_votes',
  USERS: 'tvk_db_users',
  EVENTS: 'tvk_db_events',
  TRANSACTIONS: 'tvk_db_transactions',
  MEDIA: 'tvk_db_media'
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
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify([]));
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
};

initializeDB();

export const db = {
  // Members / Users
  async registerMember(data: { name: string; mobile: string; constituency: string; avatar?: string }): Promise<User> {
    const users = await this.getUsers();
    const membershipId = `TVK-2024-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      role: 'MEMBER',
      membershipId,
      mobile: data.mobile,
      constituency: data.constituency,
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${data.mobile}`,
      joinedAt: new Date().toISOString()
    };

    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify([...users, newUser]));
    
    await this.logTransaction({
      type: 'MEMBERSHIP',
      userId: newUser.id,
      userName: newUser.name,
      details: `New membership registration from ${newUser.constituency}`
    });

    return newUser;
  },

  async updateUserAvatar(userId: string, avatar: string): Promise<void> {
    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, avatar } : u);
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(updated));
    
    await this.logTransaction({
      type: 'MEMBERSHIP',
      userId,
      userName: 'User Update',
      details: 'Profile avatar updated successfully'
    });
  },

  async getUsers(): Promise<User[]> {
    const data = localStorage.getItem(STORE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  // Transactions
  async logTransaction(tx: Omit<Transaction, 'id' | 'timestamp'>): Promise<void> {
    const data = localStorage.getItem(STORE_KEYS.TRANSACTIONS);
    const transactions = data ? JSON.parse(data) : [];
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORE_KEYS.TRANSACTIONS, JSON.stringify([newTx, ...transactions]));
  },

  async getTransactions(): Promise<Transaction[]> {
    const data = localStorage.getItem(STORE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  // Media Assets
  async getMedia(): Promise<MediaAsset[]> {
    const data = localStorage.getItem(STORE_KEYS.MEDIA);
    return data ? JSON.parse(data) : [];
  },

  async incrementMediaDownload(id: string): Promise<void> {
    const media = await this.getMedia();
    const updated = media.map(m => m.id === id ? { ...m, downloadCount: m.downloadCount + 1 } : m);
    localStorage.setItem(STORE_KEYS.MEDIA, JSON.stringify(updated));
  },

  // Events
  async getEvents(): Promise<TVKEvent[]> {
    const data = localStorage.getItem(STORE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },

  async setEvents(events: TVKEvent[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.EVENTS, JSON.stringify(events));
  },

  // Suggestions
  async addSuggestion(suggestion: Omit<ManifestoSuggestion, 'id' | 'status'>): Promise<void> {
    const all = await this.getSuggestions();
    const newItem: ManifestoSuggestion = {
      ...suggestion,
      id: crypto.randomUUID(),
      status: 'Pending'
    };
    localStorage.setItem(STORE_KEYS.SUGGESTIONS, JSON.stringify([newItem, ...all]));
    await this.logTransaction({
      type: 'SUGGESTION',
      userId: suggestion.userId,
      userName: suggestion.user,
      details: `Policy suggestion submitted: "${suggestion.suggestion.substring(0, 30)}..."`
    });
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

  // News Ticker
  async getTickerNews(): Promise<string[]> {
    const data = localStorage.getItem(STORE_KEYS.TICKER);
    return data ? JSON.parse(data) : [];
  },

  async setTickerNews(items: string[]): Promise<void> {
    localStorage.setItem(STORE_KEYS.TICKER, JSON.stringify(items));
  },

  // Voting
  async getVotes(): Promise<VoteOption[]> {
    const data = localStorage.getItem(STORE_KEYS.VOTES);
    return data ? JSON.parse(data) : [];
  },

  async castVote(optionId: string): Promise<void> {
    const all = await this.getVotes();
    const updated = all.map(v => v.id === optionId ? { ...v, votes: v.votes + 1 } : v);
    localStorage.setItem(STORE_KEYS.VOTES, JSON.stringify(updated));
    await this.logTransaction({
      type: 'VOTE',
      userId: 'anon',
      userName: 'Verified Voter',
      details: `Vote cast for option ID: ${optionId}`
    });
  }
};
