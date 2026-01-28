
import React, { useState, useEffect } from 'react';
import { PARTY_NAME, FULL_PARTY_NAME, TRANSLATIONS } from './constants';
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
import { AppView, Language, ManifestoSuggestion, TVKEvent } from './types';
import { getNearbyOffices } from './services/geminiService';
import { AuthProvider, useAuth } from './components/AuthContext';
import { AccessibilityProvider, useAccessibility } from './components/AccessibilityContext';
import { db } from './services/db';

const AppContent: React.FC = () => {
  const { user, isAdmin, isMember, isAuthenticated, logout, login } = useAuth();
  const { theme } = useAccessibility();
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [language, setLanguage] = useState<Language>('en');
  const [nearestOffices, setNearestOffices] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<ManifestoSuggestion[]>([]);
  const [tickerNews, setTickerNews] = useState<string[]>([]);
  const [events, setEvents] = useState<TVKEvent[]>([]);
  const [handshakeData, setHandshakeData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const loadInitialData = async () => {
      const [sugs, news, evs] = await Promise.all([
        db.getSuggestions(),
        db.getTickerNews(),
        db.getEvents()
      ]);
      setSuggestions(sugs);
      setTickerNews(news);
      setEvents(evs);
    };
    loadInitialData();

    const simulateExternalHandshake = async () => {
      try {
        await new Promise(r => setTimeout(r, 1500));
        setHandshakeData({
          status: 'CONNECTED',
          source: 'TVK CENTRAL NODE v2.1',
          uptime: '99.98%',
          load: 'Normal'
        });
      } catch (e) {
        console.error("External handshake failed");
      }
    };
    simulateExternalHandshake();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const data = await getNearbyOffices(position.coords.latitude, position.coords.longitude);
          setNearestOffices(data);
        } catch (error) {
          console.error("Location error:", error);
        }
      });
    }
  }, []);

  const handleAddSuggestion = async (text: string) => {
    if (!isMember) return;
    await db.addSuggestion({
      user: user?.name || "Verified Citizen",
      userId: user?.id || "anon",
      timestamp: "Just now",
      suggestion: text
    });
    const updated = await db.getSuggestions();
    setSuggestions(updated);
  };

  const navigateTo = (view: AppView) => {
    if (view === 'DASHBOARD' && !isMember) {
      setCurrentView('LOGIN');
    } else if (view === 'ADMIN' && !isAdmin) {
      setCurrentView('HOME');
    } else if (view === 'MEDIA' && !isMember) {
      setCurrentView('LOGIN');
    } else {
      setCurrentView(view);
    }
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': 
        return isMember ? <MemberDashboard /> : <div className="p-20 text-center font-bold dark:text-white">Access Denied. Please Login.</div>;
      case 'EVENTS': 
        return <EventsView events={events} />;
      case 'MANIFESTO': 
        return <ManifestoView onAddSuggestion={handleAddSuggestion} />;
      case 'REGISTER':
        return <RegistrationForm onSuccess={() => setCurrentView('DASHBOARD')} />;
      case 'MEDIA':
        return isMember ? <MediaLibrary /> : <div className="p-20 text-center font-bold dark:text-white">Membership required to access Resource Hub.</div>;
      case 'ADMIN': 
        return isAdmin ? (
          <AdminPanel 
            tickerItems={tickerNews} 
            setTickerItems={handleUpdateTicker} 
            suggestions={suggestions}
            setSuggestions={async (updatedSugs) => {
              setSuggestions(updatedSugs as ManifestoSuggestion[]);
            }}
            events={events}
            setEvents={async (evs) => {
                await db.setEvents(evs);
                setEvents(evs);
            }}
          />
        ) : <div className="p-20 text-center font-bold dark:text-white">Administrator Access Required.</div>;
      case 'POLLS': 
        return <PublicPoll />;
      case 'LOGIN':
        return (
          <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full text-center">
              <WhistleIcon className="w-16 h-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight dark:text-white">Portal Access</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold text-xs md:text-sm uppercase tracking-widest">Authorized Handshake Only</p>
              <div className="space-y-4">
                <button onClick={() => { login('MEMBER'); navigateTo('DASHBOARD'); }} className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all text-xs">Member Login</button>
                <button onClick={() => { login('ADMIN'); navigateTo('ADMIN'); }} className="w-full py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-white dark:hover:text-black transition-all text-xs">Admin Login</button>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => navigateTo('REGISTER')} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/20 text-xs">New Enrollment</button>
                </div>
              </div>
            </div>
          </div>
        );
      default: return (
        <>
          <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center bg-red-800 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
            </div>
            <div className="container mx-auto px-4 relative z-10 text-center text-white py-20">
              <div className="inline-block mb-6 md:mb-8 animate-bounce" aria-hidden="true">
                <WhistleIcon className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
              </div>
              <h1 className="text-4xl md:text-8xl font-black mb-4 md:mb-6 leading-tight drop-shadow-2xl uppercase tracking-tighter" id="hero-heading">{t.heroTitle}</h1>
              <p className="text-base md:text-2xl font-bold text-yellow-400 mb-8 md:mb-10 tracking-[0.1em] md:tracking-[0.2em] uppercase px-4">{t.heroSub}</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-6">
                {!isAuthenticated ? (
                  <button onClick={() => navigateTo('REGISTER')} className="w-full md:w-auto px-10 py-4 md:py-5 bg-white text-red-700 rounded-full font-black text-sm md:text-lg hover:bg-yellow-400 hover:text-red-900 transition-all transform hover:scale-105 shadow-2xl">{t.joinBtn}</button>
                ) : (
                  <button onClick={() => navigateTo('DASHBOARD')} className="w-full md:w-auto px-10 py-4 md:py-5 bg-white text-red-700 rounded-full font-black text-sm md:text-lg hover:bg-yellow-400 hover:text-red-900 transition-all transform hover:scale-105 shadow-2xl">Member Portal</button>
                )}
                <button onClick={() => navigateTo('MANIFESTO')} className="w-full md:w-auto px-10 py-4 md:py-5 bg-transparent border-2 md:border-4 border-white text-white rounded-full font-black text-sm md:text-lg hover:bg-white hover:text-red-700 transition-all">{t.vision}</button>
              </div>
            </div>
          </section>

          <NewsTicker items={tickerNews} />
          
          <LeadershipSection />
          
          {nearestOffices && nearestOffices.text && (
            <section className="py-8 md:py-12 bg-yellow-50 dark:bg-yellow-900/10 border-y border-yellow-200 dark:border-yellow-800">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-[10px] md:text-xs font-black text-yellow-800 dark:text-yellow-400 uppercase tracking-widest mb-3 md:mb-4">Nearby Handshake Node</h3>
                <p className="text-sm md:text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto px-2">{nearestOffices.text}</p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                  {nearestOffices.links?.map((link: any, i: number) => link.maps && (
                    <a key={i} href={link.maps.uri} target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl border border-yellow-300 dark:border-yellow-800 text-[10px] md:text-xs font-bold text-yellow-900 dark:text-yellow-400 shadow-sm">
                      {link.maps.title || "Office Point"}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          <VotingSection />
        </>
      );
    }
  };

  const handleUpdateTicker = async (items: string[]) => {
    await db.setTickerNews(items);
    setTickerNews(items);
  };

  const primaryLanguages = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'TA' }
  ];

  const otherLanguages = [
    { code: 'te', label: 'TE' },
    { code: 'ml', label: 'ML' },
    { code: 'kn', label: 'KN' },
    { code: 'hi', label: 'HI' }
  ];

  const allLanguages = [...primaryLanguages, ...otherLanguages];

  return (
    <div className={`min-h-screen font-poppins transition-colors duration-300 ${theme === 'dark' || theme === 'high-contrast' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="bg-gray-900 text-[8px] md:text-[9px] font-black text-white/50 py-1 uppercase tracking-[0.2em] md:tracking-[0.3em] overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-2 md:gap-4">
            <span className="hidden sm:inline">NETWORK: {handshakeData?.status || 'INIT...'}</span>
            <span className="truncate max-w-[100px] md:max-w-none">NODE: {handshakeData?.source || 'PENDING'}</span>
          </div>
          <div className="flex gap-2 md:gap-4">
            <span className="hidden sm:inline">UPTIME: {handshakeData?.uptime || '---'}</span>
            <span className="text-green-500 animate-pulse">DB_ACTIVE</span>
            {isAuthenticated && <span className="text-yellow-400 font-bold ml-2">ROLE: {user?.role}</span>}
          </div>
        </div>
      </div>

      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm h-16 md:h-20" role="navigation">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => navigateTo('HOME')} aria-label="TVK Home">
            <div className="p-1.5 md:p-2 bg-red-700 rounded-lg md:rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-red-700/20"><WhistleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" /></div>
            <div>
              <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none block">{PARTY_NAME}</span>
              <span className="text-[8px] md:text-[10px] font-bold text-red-600 uppercase tracking-widest">CENTRAL SYSTEM</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('HOME')} className={`font-bold text-xs uppercase tracking-widest ${currentView === 'HOME' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>{t.home}</button>
            <button onClick={() => navigateTo('EVENTS')} className={`font-bold text-xs uppercase tracking-widest ${currentView === 'EVENTS' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>{t.events}</button>
            
            {isMember && (
              <button onClick={() => navigateTo('MEDIA')} className={`font-bold text-xs uppercase tracking-widest ${currentView === 'MEDIA' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>Resources</button>
            )}
            
            {isAuthenticated ? (
              <button onClick={() => navigateTo('DASHBOARD')} className={`font-bold text-xs uppercase tracking-widest px-6 py-2 bg-gray-900 dark:bg-black text-white rounded-full hover:bg-red-700 transition-colors`}>Dashboard</button>
            ) : (
              <button onClick={() => navigateTo('LOGIN')} className={`font-bold text-xs uppercase tracking-widest px-6 py-2 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-full hover:bg-gray-900 dark:hover:bg-white dark:hover:text-black transition-all`}>Portal</button>
            )}
            
            {isAdmin && <button onClick={() => navigateTo('ADMIN')} className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900">Admin</button>}

            <div className="relative group/lang flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-md">
              <div className="flex">
                {primaryLanguages.map(({ code, label }) => (
                  <button 
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === code ? 'bg-white dark:bg-gray-700 shadow-sm text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
                  >{label}</button>
                ))}
              </div>
              
              <div className="flex w-0 overflow-hidden opacity-0 group-hover/lang:w-[160px] group-hover/lang:opacity-100 transition-all duration-500 ease-in-out">
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 self-center mx-1"></div>
                {otherLanguages.map(({ code, label }) => (
                  <button 
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === code ? 'bg-white dark:bg-gray-700 shadow-sm text-red-600' : 'text-gray-400 dark:text-gray-500'}`}
                  >{label}</button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-gray-900 dark:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        <div className={`md:hidden fixed inset-0 z-[100] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-[80%] bg-white dark:bg-gray-900 shadow-2xl p-8 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-12">
                   <div className="flex items-center gap-2">
                        <WhistleIcon className="w-6 h-6 text-red-700" />
                        <span className="font-black text-xl dark:text-white">{PARTY_NAME}</span>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>

                <div className="flex flex-col gap-6">
                    <button onClick={() => navigateTo('HOME')} className="text-left font-black text-lg uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Home</button>
                    <button onClick={() => navigateTo('EVENTS')} className="text-left font-black text-lg uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Events</button>
                    {isMember && (
                      <button onClick={() => navigateTo('MEDIA')} className="text-left font-black text-lg uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Resources</button>
                    )}
                    <button onClick={() => navigateTo('MANIFESTO')} className="text-left font-black text-lg uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Vision 2026</button>
                    
                    {isAuthenticated ? (
                        <button onClick={() => navigateTo('DASHBOARD')} className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black uppercase tracking-widest">Dashboard</button>
                    ) : (
                        <button onClick={() => navigateTo('LOGIN')} className="w-full py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-2xl font-black uppercase tracking-widest">Login Portal</button>
                    )}

                    {isAdmin && (
                        <button onClick={() => navigateTo('ADMIN')} className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl font-black uppercase tracking-widest border border-red-100 dark:border-red-900">Admin Panel</button>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Language</p>
                        <div className="grid grid-cols-3 gap-2">
                          {allLanguages.map(({ code, label }) => (
                            <button 
                              key={code}
                              onClick={() => setLanguage(code as Language)} 
                              className={`py-2 text-[10px] font-black rounded-xl transition-all ${language === code ? 'bg-red-700 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                            >{label}</button>
                          ))}
                        </div>
                    </div>

                    {user && (
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mt-8 text-gray-400 font-bold text-xs uppercase flex items-center justify-center gap-2">
                           Logout Session <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
      </nav>

      <main role="main">{renderView()}</main>

      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 md:gap-12 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4 md:mb-6"><WhistleIcon className="w-7 h-7 md:w-8 md:h-8 text-red-700" /><span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{PARTY_NAME}</span></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 md:mb-8 font-medium">Standardized mobile-first portal for TVK. Secure SSL Handshake enabled.</p>
              <p className="text-red-600 font-black italic text-lg md:text-xl uppercase tracking-tighter leading-tight">{t.slogan}</p>
            </div>
            <div className="grid grid-cols-2 md:block gap-4">
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Platform</h4>
                  <ul className="space-y-3 md:space-y-4 text-gray-500 dark:text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                    <li><button onClick={() => navigateTo('MEDIA')}>Media Hub</button></li>
                    <li><button onClick={() => navigateTo('MANIFESTO')}>Vision Doc</button></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">System</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest leading-relaxed">Status: {handshakeData?.status}<br />Encryption: AES-256<br />Node: Stable</p>
               </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.5em]">© 2024 TVK CENTRAL SYSTEMS • MULTI-LANGUAGE SUPPORT</div>
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
