
export type AppView = 'HOME' | 'DASHBOARD' | 'EVENTS' | 'MANIFESTO';

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
}

export interface TVKEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'Rally' | 'Meeting' | 'Conference';
  image: string;
}
