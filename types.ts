
export type UserRole = 'GUEST' | 'MEMBER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  membershipId?: string;
  avatar?: string;
  mobile?: string;
  constituency?: string;
  joinedAt: string;
}

export type AppView = 'HOME' | 'DASHBOARD' | 'EVENTS' | 'MANIFESTO' | 'ADMIN' | 'POLLS' | 'LOGIN' | 'REGISTER' | 'MEDIA';
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
  type: 'MEMBERSHIP' | 'VOTE' | 'SUGGESTION' | 'DONATION';
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
