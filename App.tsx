
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PARTY_NAME, FULL_PARTY_NAME, TRANSLATIONS, HISTORIC_ICONS, LEADERSHIP, MANIFESTO_POINTS } from './constants';
import NewsTicker from './components/NewsTicker';
import VotingSection from './components/VotingSection';
import LeadershipSection from './components/LeadershipSection';
import AssistantFab from './components/AssistantFab';
import MemberDashboard from './components/MemberDashboard';
import EventsView from './components/EventsView';
import AdminPanel from './components/AdminPanel';
import PublicPoll from './components/PublicPoll';
import WhistleIcon from './components/WhistleIcon';
import ManifestoView from './components/ManifestoView';
import RegistrationForm from './components/RegistrationForm';
import MediaLibrary from './components/MediaLibrary';
import AccessibilityMenu from './components/AccessibilityMenu';
import HomeCarousel from './components/HomeCarousel';
import AboutView from './components/AboutView';
import AchievementsView from './components/AchievementsView';
import CommitteeView from './components/CommitteeView';
import { AppView, Language, ManifestoSuggestion, TVKEvent, ManifestoPoint } from './types';
import { getNearbyOffices } from './services/geminiService';
import { AuthProvider, useAuth } from './components/AuthContext';
import { AccessibilityProvider, useAccessibility } from './components/AccessibilityContext';
import { db } from './services/db';

const LoginView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const { login, loginWithSSO } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authType, setAuthType] = useState<'DIRECT' | 'SSO'>('DIRECT');

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      // Check role to direct accordingly
      const user = await db.findUserByEmail(email);
      onNavigate(user?.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
    } else {
      setError('Invalid credentials. Admin users use party password.');
    }
    setIsLoading(false);
  };

  const handleSSO = async (provider: 'GOOGLE' | 'FACEBOOK') => {
    setIsLoading(true);
    const success = await loginWithSSO(
      provider === 'GOOGLE' ? 'user@gmail.com' : 'user@fb.com',
      provider === 'GOOGLE' ? 'Google Comrade' : 'Facebook Comrade',
      provider
    );
    if (success) onNavigate('DASHBOARD');
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 py-20">
      <div className="bg-white dark:bg-gray-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="relative mb-6 inline-block">
            <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full"></div>
            <WhistleIcon className="w-20 h-20 mx-auto relative z-10 text-red-700" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">TVK <span className="text-red-600">ID</span></h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Unified Political Infrastructure</p>
        </div>

        {/* Auth Type Switch */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-8">
          <button onClick={() => setAuthType('DIRECT')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authType === 'DIRECT' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-400'}`}>Direct Login</button>
          <button onClick={() => setAuthType('SSO')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authType === 'SSO' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-400'}`}>SSO Secure</button>
        </div>

        {authType === 'DIRECT' ? (
          <form onSubmit={handleDirectLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Identity</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tvk.org or member email" 
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors font-bold dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Credential Secret</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors font-bold dark:text-white" 
              />
            </div>

            {error && <p className="text-red-600 text-[10px] font-bold uppercase text-center bg-red-50 py-2 rounded-lg">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/30 transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Verifying Node...' : 'Establish Session'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => handleSSO('GOOGLE')}
              className="w-full py-4 flex items-center justify-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-[10px] text-gray-700 dark:text-white"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
            <button 
              onClick={() => handleSSO('FACEBOOK')}
              className="w-full py-4 flex items-center justify-center gap-4 bg-[#1877F2] text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all text-[10px]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Connect with Facebook
            </button>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 mt-4">
               <p className="text-[9px] text-blue-700 dark:text-blue-300 font-bold uppercase leading-relaxed text-center">Identity is federated through TVK Core Cloud. Direct enrollment is recommended for official ID cards.</p>
            </div>
          </div>
        )}

        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 font-bold mb-4 uppercase">New to TVK?</p>
          <button 
            onClick={() => onNavigate('REGISTER')} 
            className="w-full py-5 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-gray-900 dark:hover:bg-white dark:hover:text-black transition-all text-[10px]"
          >
            Create Membership Account
          </button>
        </div>
      </div>
    </div>
  );
};

const ManifestoHighlights: React.FC<{ onExplore: () => void; points: ManifestoPoint[] }> = ({ onExplore, points }) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, points.length - itemsPerView);

  const nextSlide = useCallback(() => {
    if (points.length <= itemsPerView) return;
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [points.length, itemsPerView, maxIndex]);

  const prevSlide = () => {
    if (points.length <= itemsPerView) return;
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (!isPaused && points.length > itemsPerView) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextSlide, points.length, itemsPerView]);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black font-poppins text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">VISION <span className="text-red-600">2026</span></h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-relaxed">Explore the core pillars of our governance model, designed to transform Tamil Nadu into a hub of equality and prosperity.</p>
          </div>
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-full font-black uppercase tracking-widest border-2 border-red-600 dark:border-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-black transition-all shadow-xl shadow-red-600/10 text-xs"
          >
            View Full Manifesto
          </button>
        </div>

        <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="relative overflow-visible">
            <div className="flex transition-transform duration-700 ease-out gap-6" style={{ transform: `translateX(-${current * (100 / itemsPerView)}%)` }}>
              {points.map((point, i) => (
                <div key={point.id} className="shrink-0 transition-all duration-500" style={{ width: itemsPerView === 1 ? '100%' : 'calc(50% - 12px)' }}>
                  <div className={`bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-lg h-full flex flex-col justify-between group relative overflow-hidden transition-all duration-300 ${i === current || (itemsPerView === 2 && i === current + 1) ? 'opacity-100 scale-100 shadow-2xl' : 'opacity-40 scale-95 blur-[1px]'}`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-colors"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-red-600/30 mb-8">{String(i + 1).padStart(2, '0')}</div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-red-600 transition-colors">{point.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base line-clamp-4">{point.desc}</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                      <button onClick={onExplore} className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 flex items-center gap-2 group/btn">
                        Learn More 
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-12">
            <div className="flex gap-2">
              {points.slice(0, points.length - (itemsPerView - 1)).map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-red-600' : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-red-300'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={prevSlide} className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-600 hover:shadow-xl transition-all active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-600 hover:shadow-xl transition-all active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AppContent: React.FC = () => {
  const { user, isAdmin, isMember, isAuthenticated, logout } = useAuth();
  const { theme } = useAccessibility();
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [language, setLanguage] = useState<Language>('ta');
  const [tickerNews, setTickerNews] = useState<string[]>([]);
  const [events, setEvents] = useState<TVKEvent[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [manifestoPoints, setManifestoPoints] = useState<ManifestoPoint[]>([]);
  const [handshakeData, setHandshakeData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const loadInitialData = useCallback(async () => {
    const [sugs, news, evs, bans, points] = await Promise.all([
      db.getSuggestions(),
      db.getTickerNews(),
      db.getEvents(),
      db.getBanners(),
      db.getManifestoPoints()
    ]);
    setTickerNews(news);
    setEvents(evs);
    setBanners(bans);
    setManifestoPoints(points);
  }, []);

  useEffect(() => {
    loadInitialData();
    setHandshakeData({ status: 'CONNECTED', source: 'TVK_CORE_V2', uptime: '99.99%', load: 'Optimized' });
  }, [loadInitialData]);

  const navigateTo = (view: AppView) => {
    if (view === 'DASHBOARD' && !isMember) { setCurrentView('LOGIN'); }
    else if (view === 'ADMIN' && !isAdmin) { setCurrentView('HOME'); }
    else if (view === 'MEDIA' && !isMember) { setCurrentView('LOGIN'); }
    else { setCurrentView(view); }
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': return isMember ? <MemberDashboard /> : <LoginView onNavigate={navigateTo} />;
      case 'EVENTS': return <EventsView events={events} />;
      case 'MANIFESTO': return <ManifestoView onAddSuggestion={(text) => {}} />;
      case 'REGISTER': return <RegistrationForm onSuccess={() => setCurrentView('DASHBOARD')} />;
      case 'MEDIA': return isMember ? <MediaLibrary /> : <LoginView onNavigate={navigateTo} />;
      case 'ABOUT': return <AboutView />;
      case 'ACHIEVEMENTS': return <AchievementsView />;
      case 'COMMITTEE': return <CommitteeView />;
      case 'ADMIN': return isAdmin ? (
        <AdminPanel 
          tickerItems={tickerNews} 
          setTickerItems={async (items) => { await db.setTickerNews(items); setTickerNews(items); }} 
          suggestions={[]}
          setSuggestions={async () => {}}
          events={events}
          setEvents={async (evs) => { await db.setEvents(evs); setEvents(evs); }}
          banners={banners}
          setBanners={async (bans) => { await db.setBanners(bans); setBanners(bans); }}
          onDataChange={loadInitialData}
        />
      ) : <LoginView onNavigate={navigateTo} />;
      case 'POLLS': return <PublicPoll />;
      case 'LOGIN': return <LoginView onNavigate={navigateTo} />;
      default: return (
        <>
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-40 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
            {HISTORIC_ICONS.map((icon, i) => (
              <div key={i} className="w-10 h-10 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-yellow-400 shadow-xl bg-white p-0.5 transform hover:scale-110 transition-all cursor-help" title={icon.name}>
                <img src={icon.img} alt={icon.name} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <HomeCarousel banners={banners} onRegisterClick={() => navigateTo('REGISTER')} onManifestoClick={() => navigateTo('MANIFESTO')} />
          <NewsTicker items={tickerNews} />
          <EventsView events={events} isSection={true} />
          <LeadershipSection onViewFullCommittee={() => navigateTo('COMMITTEE')} />
          <ManifestoHighlights onExplore={() => navigateTo('MANIFESTO')} points={manifestoPoints} />
          <VotingSection />
          <PublicPoll />
        </>
      );
    }
  };

  return (
    <div className={`min-h-screen font-poppins transition-colors duration-300 ${theme === 'dark' || theme === 'high-contrast' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="bg-gray-950 text-[8px] md:text-[9px] font-black text-white/40 py-1.5 uppercase tracking-[0.3em] border-b border-white/5 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hidden sm:inline">CENTRAL SYSTEM STATUS: {handshakeData?.status || 'INIT...'}</span>
            <span className="truncate max-w-[150px] md:max-w-none">ENCRYPTION: AES-256_SSO_TLS</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-green-500 animate-pulse font-bold">● CLOUD_PERSISTENCE_ACTIVE</span>
            {isAuthenticated && <span className="text-yellow-400 font-bold ml-2">ACCESS_GRANTED: {user?.role}</span>}
          </div>
        </div>
      </div>

      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm h-16 md:h-20" role="navigation">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('HOME')} aria-label="TVK Home">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-2.5 bg-red-700 rounded-xl group-hover:scale-110 transition-transform shadow-xl shadow-red-700/20 flex items-center justify-center">
                 <WhistleIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none block tracking-tighter">{PARTY_NAME}</span>
              <span className="text-[9px] md:text-[11px] font-bold text-red-600 dark:text-red-500 uppercase tracking-[0.2em] mt-0.5 truncate max-w-[120px] md:max-w-none">{FULL_PARTY_NAME}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => navigateTo('HOME')} className={`font-black text-[10px] uppercase tracking-widest ${currentView === 'HOME' ? 'text-red-700' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>{t.home}</button>
            <button onClick={() => navigateTo('ABOUT')} className={`font-black text-[10px] uppercase tracking-widest ${currentView === 'ABOUT' ? 'text-red-700' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>{t.party}</button>
            <button onClick={() => navigateTo('ACHIEVEMENTS')} className={`font-black text-[10px] uppercase tracking-widest ${currentView === 'ACHIEVEMENTS' ? 'text-red-700' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>{t.achievements}</button>
            <button onClick={() => navigateTo('MEDIA')} className={`font-black text-[10px] uppercase tracking-widest ${currentView === 'MEDIA' ? 'text-red-700' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>{t.resources}</button>
            <button onClick={() => navigateTo('MANIFESTO')} className={`font-black text-[10px] uppercase tracking-widest ${currentView === 'MANIFESTO' ? 'text-red-700' : 'text-gray-600 dark:text-gray-400 hover:text-red-600'}`}>{t.manifesto}</button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button onClick={() => navigateTo('ADMIN')} className={`font-black text-[10px] uppercase tracking-widest px-6 py-2 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg ${currentView === 'ADMIN' ? 'bg-red-600 text-white' : ''}`}>Admin Panel</button>
                )}
                <button onClick={() => navigateTo('DASHBOARD')} className={`font-black text-[10px] uppercase tracking-widest px-6 py-2 bg-gray-900 dark:bg-black text-white rounded-full hover:bg-red-700 transition-colors shadow-lg ${currentView === 'DASHBOARD' ? 'bg-red-700' : ''}`}>Dashboard</button>
                <button onClick={() => { logout(); navigateTo('HOME'); }} className="text-[9px] font-black uppercase text-gray-400 hover:text-red-600 transition-colors">Logout</button>
              </div>
            ) : (
              <button onClick={() => navigateTo('LOGIN')} className="font-black text-[10px] uppercase tracking-widest px-6 py-2.5 bg-red-600 text-white rounded-full hover:bg-gray-900 transition-all shadow-xl shadow-red-600/30 transform hover:scale-105 active:scale-95">Member Login</button>
            )}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
               <button onClick={() => setLanguage('ta')} className={`px-3 py-1 text-[9px] font-bold rounded-full transition-all ${language === 'ta' ? 'bg-red-700 text-white shadow-md' : 'text-gray-400'}`}>TAM</button>
               <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-[9px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-red-700 text-white shadow-md' : 'text-gray-400'}`}>ENG</button>
            </div>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-900 dark:text-white z-[60]" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white dark:bg-gray-950 z-[55] lg:hidden animate-in fade-in slide-in-from-top duration-300">
            <div className="flex flex-col h-full pt-24 px-8 space-y-4 overflow-y-auto pb-10">
              <button onClick={() => navigateTo('HOME')} className="text-2xl font-black uppercase tracking-tighter text-left py-2 border-b border-gray-50 dark:border-gray-900">Home</button>
              <button onClick={() => navigateTo('ABOUT')} className="text-2xl font-black uppercase tracking-tighter text-left py-2 border-b border-gray-50 dark:border-gray-900">Party</button>
              <button onClick={() => navigateTo('ACHIEVEMENTS')} className="text-2xl font-black uppercase tracking-tighter text-left py-2 border-b border-gray-50 dark:border-gray-900">Achievements</button>
              <button onClick={() => navigateTo('MEDIA')} className="text-2xl font-black uppercase tracking-tighter text-left py-2 border-b border-gray-50 dark:border-gray-900">Resources</button>
              <button onClick={() => navigateTo('MANIFESTO')} className="text-2xl font-black uppercase tracking-tighter text-left py-2 border-b border-gray-50 dark:border-gray-900 text-red-600">Manifesto 2026</button>
              <div className="pt-8 space-y-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    {isAdmin && (
                      <button onClick={() => navigateTo('ADMIN')} className="w-full py-5 border-2 border-red-600 text-red-600 rounded-2xl font-black uppercase tracking-widest text-sm">Admin Center</button>
                    )}
                    <button onClick={() => navigateTo('DASHBOARD')} className="w-full py-5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black uppercase tracking-widest text-sm">Member Dashboard</button>
                    <button onClick={() => { logout(); navigateTo('HOME'); }} className="w-full text-center text-red-600 font-black uppercase tracking-widest text-xs">Logout</button>
                  </div>
                ) : (
                  <button onClick={() => navigateTo('LOGIN')} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm">Member Login</button>
                )}
              </div>
              <div className="flex items-center gap-4 pt-4">
                 <button onClick={() => setLanguage('ta')} className={`flex-1 py-3 rounded-xl font-black text-xs ${language === 'ta' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>TAMIL</button>
                 <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl font-black text-xs ${language === 'en' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>ENGLISH</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main role="main">{renderView()}</main>
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <WhistleIcon className="w-20 h-20 mx-auto mb-8" />
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{FULL_PARTY_NAME}</h2>
          <p className="text-red-700 font-black italic text-xl uppercase tracking-widest mb-12">{t.slogan}</p>
          <div className="pt-12 border-t border-gray-200 dark:border-gray-800 text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] opacity-60">© 2026 TVK CENTRAL SYSTEMS • SECURE CLOUD DEPLOYMENT</div>
        </div>
      </footer>
      <AssistantFab />
      <AccessibilityMenu />
    </div>
  );
};

const App: React.FC = () => (
  <AccessibilityProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </AccessibilityProvider>
);
export default App;
