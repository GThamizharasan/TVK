
import { NewsItem, LeadershipMember, VoteOption, TVKEvent } from './types';

export const PARTY_NAME = "TVK";
export const FULL_PARTY_NAME = "Tamizhaga Vettri Kazhagam";
export const PRIMARY_COLOR = "#D41D24"; // Red
export const SECONDARY_COLOR = "#FFD700"; // Gold

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'Historic Membership Drive Surpasses 1 Crore Mark',
    category: 'Update',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Leadership Summit in Madurai Outlines 2026 Vision',
    category: 'Events',
    date: 'Nov 02, 2024',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Youth Wing Training Camp Scheduled for Next Month',
    category: 'Announcements',
    date: 'Nov 05, 2024',
    image: 'https://images.unsplash.com/photo-1523580494863-6f30312248f5?auto=format&fit=crop&w=800&q=80'
  }
];

export const EVENTS: TVKEvent[] = [
  {
    id: 'e1',
    title: 'State General Conference',
    date: 'Dec 15, 2024',
    location: 'Vikravandi, Villupuram',
    type: 'Conference',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e2',
    title: 'Youth Empowerment Rally',
    date: 'Jan 10, 2025',
    location: 'Marina Grounds, Chennai',
    type: 'Rally',
    image: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'e3',
    title: 'District Coordinators Meet',
    date: 'Jan 22, 2025',
    location: 'Trichy Central',
    type: 'Meeting',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  }
];

export const MANIFESTO_POINTS = [
  { title: "Universal Quality Education", desc: "Digital classrooms in every village and zero-cost higher education for all." },
  { title: "Agricultural Sovereignty", desc: "Minimum Support Price (MSP) determined by farmers, not middlemen." },
  { title: "Youth Employment Hubs", desc: "One skill-development center for every 5 constituencies." },
  { title: "Environmental Justice", desc: "Strict protection of Tamil Nadu's coastline and sacred water bodies." }
];

export const LEADERSHIP: LeadershipMember[] = [
  {
    id: 'leader-1',
    name: 'Thalapathy Vijay',
    role: 'Founder & President',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'Visionary leader dedicated to social justice, secularism, and the progress of Tamil Nadu.'
  },
  {
    id: 'leader-2',
    name: 'Dr. S. Karthik',
    role: 'General Secretary',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=500&q=80',
    bio: 'Political strategist with over 20 years of experience in administrative reforms.'
  }
];

export const INITIAL_VOTES: VoteOption[] = [
  { id: '1', label: 'Education Reform', votes: 4500 },
  { id: '2', label: 'Farmers Support', votes: 3200 },
  { id: '3', label: 'Unemployment Solutions', votes: 5100 },
  { id: '4', label: 'Environmental Protection', votes: 1200 }
];
