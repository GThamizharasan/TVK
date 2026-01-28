
export type UserRole = 'GUEST' | 'MEMBER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  membershipId?: string;
  avatar?: string;
  mobile?: string;
  constituency?: string;
  joinedAt: string;
  ssoProvider?: 'GOOGLE' | 'FACEBOOK' | 'TVK_CORE';
}

export type AppView = 'HOME' | 'DASHBOARD' | 'EVENTS' | 'MANIFESTO' | 'ADMIN' | 'POLLS' | 'LOGIN' | 'REGISTER' | 'MEDIA' | 'ABOUT' | 'ACHIEVEMENTS' | 'COMMITTEE';
export type Language = 'en' | 'ta' | 'te' | 'ml' | 'kn' | 'hi';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
export type FontScale = 'normal' | 'large' | 'x-large';

export interface AccessibilitySettings {
  theme: ThemeMode;
  fontScale: FontScale;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Achievement {
  id: string;
  year: string;
  title: string;
  desc: string;
  img: string;
}

export interface IdeologyPoint {
  id: string;
  title: string;
  description: string;
}

export interface VoteOption {
  id: string;
  label: string;
  votes: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  links?: { web?: { uri: string; title: string } }[];
}

export interface TVKEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Rally' | 'Meeting' | 'Conference';
  image: string;
}

export interface ManifestoPoint {
  id: string;
  title: string;
  desc: string;
}

export interface PollOption {
  id: string;
  label: string;
  percentage: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
}

export interface ManifestoSuggestion {
  id: string;
  user: string;
  userId: string;
  timestamp: string;
  suggestion: string;
  status: 'Pending' | 'Responded';
  response?: string;
}

export interface Transaction {
  id: string;
  type: 'MEMBERSHIP' | 'VOTE' | 'SUGGESTION' | 'DONATION' | 'POLL';
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: 'POSTER' | 'WALLPAPER' | 'VIDEO';
  downloadCount: number;
}
