
import { NewsItem, LeadershipMember, VoteOption, TVKEvent, ManifestoSuggestion } from './types';

export const PARTY_NAME = "TVK";
export const FULL_PARTY_NAME = "Tamizhaga Vettri Kazhagam";
export const PRIMARY_COLOR = "#D41D24"; // Red
export const SECONDARY_COLOR = "#FFD700"; // Gold

export const TRANSLATIONS = {
  en: {
    heroTitle: "BLOW THE WHISTLE FOR VICTORY",
    heroSub: "Voice of the People, Power of the Youth.",
    joinBtn: "Join Movement",
    enroll: "Enroll",
    home: "Home",
    events: "Events",
    portal: "Member Portal",
    admin: "Admin",
    polls: "Polls",
    slogan: "All are equal by birth",
    vision: "2026 Vision"
  },
  ta: {
    heroTitle: "வெற்றிக்கான விசிலை ஊதுங்கள்",
    heroSub: "மக்களின் குரல், இளைஞர்களின் சக்தி.",
    joinBtn: "இயக்கத்தில் இணையுங்கள்",
    enroll: "பதிவு செய்க",
    home: "முகப்பு",
    events: "நிகழ்வுகள்",
    portal: "உறுப்பினர் பக்கம்",
    admin: "நிர்வாகம்",
    polls: "வாக்கெடுப்பு",
    slogan: "பிறப்பொக்கும் எல்லா உயிர்க்கும்",
    vision: "2026 தொலைநோக்கு"
  },
  te: {
    heroTitle: "విజయం కోసం విజిల్ ఊదండి",
    heroSub: "ప్రజల గొంతుక, యువత శక్తి.",
    joinBtn: "ఉద్యమంలో చేరండి",
    enroll: "నమోదు చేసుకోండి",
    home: "హోమ్",
    events: "ఈవెంట్స్",
    portal: "సభ్యుల పోర్టల్",
    admin: "అడ్మిన్",
    polls: "పోల్స్",
    slogan: "పుట్టుకతో అందరూ సమానమే",
    vision: "2026 విజన్"
  },
  ml: {
    heroTitle: "വിജയത്തിനായി വിസിൽ മുഴക്കുക",
    heroSub: "ജനങ്ങളുടെ ശബ്ദം, യുവത്വത്തിന്റെ കരുത്ത്.",
    joinBtn: "പ്രസ്ഥാനത്തിൽ ചേരുക",
    enroll: "രജിസ്റ്റർ ചെയ്യുക",
    home: "ഹോം",
    events: "പരിപാടികൾ",
    portal: "അംഗങ്ങളുടെ പോർട്ടൽ",
    admin: "അഡ്മിൻ",
    polls: "പോളുകൾ",
    slogan: "എല്ലാ മനുഷ്യരും സമന്മാരാണ്",
    vision: "2026 വിഷൻ"
  },
  kn: {
    heroTitle: "ವಿಜಯಕ್ಕಾಗಿ ಸೀಟಿ ಊದಿ",
    heroSub: "ಜನರ ಧ್ವನಿ, ಯುವಕರ ಶಕ್ತಿ.",
    joinBtn: "ಚಳುವಳಿಗೆ ಸೇರಿ",
    enroll: "ನೋಂದಾಯಿಸಿ",
    home: "ಹోಮ್",
    events: "ಕಾರ್ಯಕ್ರಮಗಳು",
    portal: "ಸದಸ್ಯರ ಪೋರ್ಟಲ್",
    admin: "ಅಡ್ಮಿನ್",
    polls: "ಪೋಲ್ಸ್",
    slogan: "ಹುಟ್ಟಿನಿಂದ ಎಲ್ಲರೂ ಸಮಾನರು",
    vision: "2026 ವಿಜನ್"
  },
  hi: {
    heroTitle: "विजय के लिए बिगुल बजाएं",
    heroSub: "जनता की आवाज, युवाओं की शक्ति।",
    joinBtn: "आंदोलन में शामिल हों",
    enroll: "पंजीकरण करें",
    home: "होम",
    events: "कार्यक्रम",
    portal: "सदस्य पोर्टल",
    admin: "एडमिन",
    polls: "पोल",
    slogan: "जन्म से सभी समान हैं",
    vision: "2026 विजन"
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

export const HISTORICAL_VOTING_DATA = [
  { name: 'Week 1', education: 1200, farmers: 800, unemployment: 1500, environment: 400 },
  { name: 'Week 2', education: 2100, farmers: 1500, unemployment: 2400, environment: 700 },
  { name: 'Week 3', education: 3500, farmers: 2800, unemployment: 3900, environment: 1000 },
  { name: 'Week 4', education: 4500, farmers: 3200, unemployment: 5100, environment: 1200 },
];

export const MOCK_SUGGESTIONS: ManifestoSuggestion[] = [
  {
    id: 'sug-1',
    user: 'Karthikeyan R.',
    userId: 'user-001',
    timestamp: '2 hours ago',
    suggestion: 'We should include a policy for providing high-speed free internet in public libraries to aid student research.',
    status: 'Pending'
  },
  {
    id: 'sug-2',
    user: 'Meena Subramanian',
    userId: 'user-002',
    timestamp: '5 hours ago',
    suggestion: 'Implement a direct grievance cell for women entrepreneurs at the district level.',
    status: 'Pending'
  },
  {
    id: 'sug-3',
    user: 'Senthil Kumar',
    userId: 'user-003',
    timestamp: 'Yesterday',
    suggestion: 'Policy to mandate solar panels on all new government buildings to lead by example in green energy.',
    status: 'Responded',
    response: 'Thank you for this excellent suggestion. This aligns perfectly with our Environmental Justice pillar. We will include this in our 2026 Vision Doc.'
  }
];

export const TAMIL_NADU_CONSTITUENCIES = [
  "Chennai Central", "Chennai North", "Chennai South", "Madurai", "Coimbatore",
  "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Thanjavur",
  "Kancheepuram", "Vellore", "Dindigul", "Nagapattinam", "Cuddalore",
  "Tiruvallur", "Thoothukudi", "Karur", "Namakkal", "Theni", "Virudhunagar"
].sort();
