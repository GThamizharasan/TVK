
import React, { useState } from 'react';
import { PARTY_NAME, FULL_PARTY_NAME, NEWS_ITEMS } from './constants';
import NewsTicker from './components/NewsTicker';
import VotingSection from './components/VotingSection';
import LeadershipSection from './components/LeadershipSection';
import AssistantFab from './components/AssistantFab';
import MemberDashboard from './components/MemberDashboard';
import EventsView from './components/EventsView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <MemberDashboard />;
      case 'EVENTS':
        return <EventsView />;
      case 'HOME':
      default:
        return (
          <>
            {/* Hero Banner */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-950">
              <div className="absolute inset-0 opacity-40">
                <img 
                  src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1920&q=80" 
                  className="w-full h-full object-cover" 
                  alt="Tamil Nadu Heritage"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
              </div>

              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 px-4 py-1.5 rounded-full text-red-400 text-xs font-bold tracking-widest uppercase mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    The New Era for Tamil Nadu
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black font-poppins text-white leading-[1.1] mb-8">
                    VOICE OF THE <span className="gradient-text">PEOPLE</span>, POWER OF THE <span className="text-red-600">YOUTH</span>.
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-xl">
                    Tamil Nadu is ready for a change. A change driven by integrity, equality, and vision. Tamizhaga Vettri Kazhagam is here to secure our future.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                      onClick={() => setCurrentView('DASHBOARD')}
                      className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-lg font-black rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                      MEMBERSHIP DRIVE 2024
                    </button>
                    <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-2xl backdrop-blur-md border border-white/20 transition-all">
                      WATCH OUR VISION
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="absolute bottom-0 left-0 right-0 glass-effect border-t border-white/10">
                <div className="container mx-auto px-4 py-8 flex flex-wrap justify-center md:justify-start gap-12 lg:gap-24">
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-black text-white">1.2Cr+</p>
                    <p className="text-xs text-yellow-400 uppercase font-bold tracking-widest">Members Enrolled</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-black text-white">234</p>
                    <p className="text-xs text-yellow-400 uppercase font-bold tracking-widest">Constituencies Represented</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-3xl font-black text-white">50K+</p>
                    <p className="text-xs text-yellow-400 uppercase font-bold tracking-widest">Active Volunteers</p>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-white relative">
              <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="lg:w-1/2 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
                    <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80" className="rounded-[4rem] shadow-2xl relative z-10 border-8 border-gray-50" alt="Mission" />
                    <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-8 rounded-3xl z-20 shadow-xl max-w-xs">
                       <p className="text-2xl font-black mb-2 italic">"Pirappokkum Ella Uyirkkum"</p>
                       <p className="text-sm opacity-80">- Our Core Philosophy</p>
                    </div>
                  </div>
                  <div className="lg:w-1/2">
                    <h3 className="text-red-600 font-black text-sm uppercase tracking-[0.3em] mb-4">Our Foundations</h3>
                    <h2 className="text-4xl md:text-5xl font-black font-poppins text-gray-900 mb-8 leading-tight">
                      A POLITICAL MOVEMENT <span className="underline decoration-yellow-400 decoration-8 underline-offset-4">FOR THE NEXT CENTURY</span>
                    </h2>
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                      <p>
                        Tamizhaga Vettri Kazhagam (TVK) isn't just a political party; it's a social revolution born from the aspirations of millions. We believe that true governance is service, not power.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-red-600 rounded-xl mb-4 flex items-center justify-center text-white font-bold">01</div>
                          <h4 className="font-bold text-gray-900 mb-2">Social Justice</h4>
                          <p className="text-sm">Ensuring every Tamilian has equal access to education, health, and opportunity.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-yellow-400 rounded-xl mb-4 flex items-center justify-center text-black font-bold">02</div>
                          <h4 className="font-bold text-gray-900 mb-2">Inclusive Growth</h4>
                          <p className="text-sm">Economic policies that lift the bottom 40% while fostering global innovation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <LeadershipSection />
            <VotingSection />

            {/* News Section */}
            <section id="news" className="py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-16">
                  <div>
                    <h2 className="text-4xl font-black font-poppins text-gray-900 mb-4">PRESS & <span className="text-red-600">UPDATES</span></h2>
                    <p className="text-gray-600">The latest developments from the field.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {NEWS_ITEMS.map((item) => (
                    <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="h-56 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="p-8">
                        <p className="text-red-600 font-bold text-xs mb-3 uppercase tracking-wider">{item.date}</p>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                        <button className="text-sm font-bold text-gray-900 border-b-2 border-red-600">Read More</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('HOME')}>
            <div className="bg-red-600 p-2 rounded-lg rotate-12 group hover:rotate-0 transition-transform">
              <span className="text-white font-black text-2xl drop-shadow-lg">{PARTY_NAME}</span>
            </div>
            <div className="hidden lg:block border-l border-gray-200 pl-4">
              <h1 className="text-sm font-bold tracking-widest text-gray-500 uppercase">{FULL_PARTY_NAME}</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setCurrentView('HOME')}
              className={`text-sm font-bold transition-colors uppercase ${currentView === 'HOME' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('EVENTS')}
              className={`text-sm font-bold transition-colors uppercase ${currentView === 'EVENTS' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Events
            </button>
            <button 
              onClick={() => setCurrentView('DASHBOARD')}
              className={`text-sm font-bold transition-colors uppercase ${currentView === 'DASHBOARD' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Member Portal
            </button>
          </nav>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setCurrentView('DASHBOARD')}
               className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-tighter transition-all hover:shadow-lg"
             >
                Join Movement
             </button>
             <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
             </button>
          </div>
        </div>
        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
             {['HOME', 'EVENTS', 'DASHBOARD'].map((view) => (
                <button 
                  key={view} 
                  className="block w-full text-left font-bold uppercase text-gray-600"
                  onClick={() => { setCurrentView(view as AppView); setIsMobileMenuOpen(false); }}
                >
                  {view}
                </button>
             ))}
          </div>
        )}
      </header>

      <NewsTicker />

      <main className="flex-1">
        {renderContent()}
      </main>

      <footer className="bg-gray-950 text-gray-400 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="bg-red-600 inline-block p-2 rounded rotate-12 mb-6">
                <span className="text-white font-black text-3xl">{PARTY_NAME}</span>
              </div>
              <p className="max-w-md text-lg leading-relaxed mb-8">
                Official suite portal of Tamizhaga Vettri Kazhagam. Secure, transparent, and unified.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Services</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setCurrentView('DASHBOARD')} className="hover:text-yellow-400">Digital ID Card</button></li>
                <li><button onClick={() => setCurrentView('EVENTS')} className="hover:text-yellow-400">Volunteer Portal</button></li>
                <li><a href="#" className="hover:text-yellow-400">Grievance Cell</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
              <p className="mb-4">Official HQ: Panaiyur, ECR, Chennai.</p>
              <p>Certified by State Election Commission.</p>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-sm">
            <p>&copy; 2024 Tamizhaga Vettri Kazhagam. Built for progress.</p>
          </div>
        </div>
      </footer>

      <AssistantFab />
    </div>
  );
};

export default App;
