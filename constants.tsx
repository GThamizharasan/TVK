
import { NewsItem, LeadershipMember, VoteOption, TVKEvent, ManifestoSuggestion } from './types';

export const PARTY_NAME = "TVK";
export const FULL_PARTY_NAME = "தமிழக வெற்றிக் கழகம்";
export const PRIMARY_COLOR = "#D41D24"; // Red
export const SECONDARY_COLOR = "#FFD700"; // Gold

export const HISTORIC_ICONS = [
  { name: "Velu Nachiyar", img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Velu_Nachiyar.jpg" },
  { name: "Kamarajar", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/K_Kamaraj.jpg/220px-K_Kamaraj.jpg" },
  { name: "Periyar", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Periyar_E._V._Ramasamy.jpg/220px-Periyar_E._V._Ramasamy.jpg" },
  { name: "Ambedkar", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._B._R._Ambedkar.jpg/220px-Dr._B._R._Ambedkar.jpg" },
  { name: "C. N. Annadurai", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/C._N._Annadurai.jpg/220px-C._N._Annadurai.jpg" }
];

export const HOME_BANNERS = [
  {
    id: 1,
    title: "தமிழக வெற்றிக் கழகம்",
    subtitle: "மக்களின் விடியல் - தலைவன் தலைமையில்",
    cta: "இயக்கத்தில் இணையுங்கள்",
    image: "https://i.ibb.co/hZ7mKkX/vijay-tvk-leader.jpg",
    accent: "#FFD700"
  },
  {
    id: 2,
    title: "கல்விப் புரட்சி",
    subtitle: "அனைவருக்கும் சமமான, தரமான இலவச கல்வி",
    cta: "கொள்கை அறிக்கை",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80",
    accent: "#ffffff"
  },
  {
    id: 3,
    title: "உழவே உயர்வு",
    subtitle: "விவசாயிகளின் உழைப்பிற்கு உரிய விலை மற்றும் கௌரவம்",
    cta: "எம்முடன் இணையுங்கள்",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
    accent: "#4ADE80"
  },
  {
    id: 4,
    title: "இளைஞர் சக்தி",
    subtitle: "2026 தொலைநோக்கு: வேலைவாய்ப்பு மற்றும் திறன் மேம்பாடு",
    cta: "பதிவு செய்க",
    image: "https://images.unsplash.com/photo-1529070532902-179e50436d41?auto=format&fit=crop&w=1920&q=80",
    accent: "#60A5FA"
  },
  {
    id: 5,
    title: "சமத்துவம்",
    subtitle: "பிறப்பொக்கும் எல்லா உயிர்க்கும் - ஜாதி மதமற்ற ஒற்றுமை",
    cta: "கழகப் பணிகள்",
    image: "https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&w=1920&q=80",
    accent: "#F87171"
  }
];

export const TRANSLATIONS = {
  en: {
    heroTitle: "TAMIZHAGA VETTRI KAZHAGAM",
    heroSub: "Our Symbol is the Whistle - Voice of the People.",
    joinBtn: "Join Movement",
    enroll: "Enroll",
    home: "Home",
    party: "Party",
    achievements: "Achievements",
    resources: "Resources",
    manifesto: "Manifesto 2026",
    events: "Political Meets",
    portal: "Member Portal",
    admin: "Command",
    polls: "Opinion",
    slogan: "Pirappokkum Ella Uyirkkum (All are equal by birth)",
    vision: "2026 Vision"
  },
  ta: {
    heroTitle: "தமிழக வெற்றிக் கழகம்",
    heroSub: "நமது வெற்றிச் சின்னம் விசில் - மக்களின் குரல்.",
    joinBtn: "இயக்கத்தில் இணையுங்கள்",
    enroll: "பதிவு செய்க",
    home: "முகப்பு",
    party: "கழகம்",
    achievements: "சாதனைகள்",
    resources: "வளங்கள்",
    manifesto: "2026 அறிக்கை",
    events: "மாநாடுகள்",
    portal: "உறுப்பினர் பக்கம்",
    admin: "நிர்வாகம்",
    polls: "வாக்கெடுப்பு",
    slogan: "பிறப்பொக்கும் எல்லா உயிர்க்கும்",
    vision: "2026 தொலைநோக்கு"
  }
};

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
  }
];

export const MANIFESTO_POINTS = [
  { title: "Universal Quality Education", desc: "Digital classrooms in every village and zero-cost higher education for all." },
  { title: "Agricultural Sovereignty", desc: "Minimum Support Price (MSP) determined by farmers, not middlemen." }
];

export const LEADERSHIP: LeadershipMember[] = [
  {
    id: 'leader-1',
    name: 'Thalapathy Vijay',
    role: 'Founder & President',
    image: 'https://i.ibb.co/hZ7mKkX/vijay-tvk-leader.jpg',
    bio: 'Champion of the people, leading the charge for a transparent and equal Tamil Nadu through the TVK movement. Committed to the welfare of every citizen.'
  },
  {
    id: 'leader-2',
    name: 'Bussy N. Anand',
    role: 'General Secretary',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Experienced organizer and key strategist driving the party ground operations across 234 constituencies.'
  }
];

export const FULL_COMMITTEE: LeadershipMember[] = [
  ...LEADERSHIP,
  {
    id: 'leader-3',
    name: 'S. K. Venkatesh',
    role: 'Treasurer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Overseeing party finances with transparency and accountability, ensuring resources reach the grassroots.'
  },
  {
    id: 'leader-4',
    name: 'Dr. Meena Ramesh',
    role: 'State Women Wing Coordinator',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Leading the empowerment of women in politics and ensuring gender-inclusive policy making.'
  },
  {
    id: 'leader-5',
    name: 'K. Rajesh Kumar',
    role: 'Youth Wing President',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    bio: 'Mobilizing the youth of Tamil Nadu for a systemic change in governance and political transparency.'
  },
  {
    id: 'leader-6',
    name: 'A. Mohammed Ibrahim',
    role: 'IT Wing State Head',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'Driving digital transformation and managing the party state-of-the-art technological infrastructure.'
  }
];

export const INITIAL_VOTES: VoteOption[] = [
  { id: '1', label: 'Education Reform', votes: 4500 },
  { id: '2', label: 'Farmers Support', votes: 3200 }
];

export const HISTORICAL_VOTING_DATA = [
  { name: 'Week 1', education: 1200, farmers: 800, unemployment: 1500, environment: 400 },
  { name: 'Week 2', education: 2100, farmers: 1500, unemployment: 2400, environment: 700 },
];

export const MOCK_SUGGESTIONS: ManifestoSuggestion[] = [
  {
    id: 'sug-1',
    user: 'Karthikeyan R.',
    userId: 'user-001',
    timestamp: '2 hours ago',
    suggestion: 'Focus on digital infrastructure for rural students.',
    status: 'Pending'
  }
];

export const TAMIL_NADU_CONSTITUENCIES = [
  "Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Vikravandi"
].sort();
