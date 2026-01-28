
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { LeadershipMember, IdeologyPoint } from '../types';
import WhistleIcon from './WhistleIcon';

const AboutView: React.FC = () => {
  const [leadership, setLeadership] = useState<LeadershipMember[]>([]);
  const [ideology, setIdeology] = useState<IdeologyPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [leaders, ideo] = await Promise.all([
        db.getLeadership(),
        db.getIdeology()
      ]);
      // For About view, we usually show the main leaders (e.g., President and General Secretary)
      setLeadership(leaders.slice(0, 2));
      setIdeology(ideo);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <div className="relative h-[60vh] bg-red-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
          <div className="text-center px-4">
            <WhistleIcon className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">OUR <span className="text-yellow-400">FOUNDATION</span></h1>
            <p className="text-white/80 max-w-2xl mx-auto mt-4 text-lg">Built on the bedrock of equality and social justice.</p>
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover opacity-60" 
          alt="Party Background"
        />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-16">
          <section>
            <h2 className="text-3xl font-black text-gray-900 border-l-8 border-red-600 pl-6 mb-8 uppercase">IDEOLOGY</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {ideology.length > 0 ? ideology.map(p => (
                <div key={p.id} className="p-8 bg-gray-50 rounded-3xl">
                  <h3 className="font-black text-red-600 text-xl mb-4">{p.title}</h3>
                  <p className="text-gray-600">{p.description}</p>
                </div>
              )) : (
                <p className="text-gray-400 font-bold uppercase tracking-widest text-center col-span-full py-12">Ideology documentation is being updated.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-gray-900 border-l-8 border-red-600 pl-6 mb-8 uppercase">PRIMARY LEADERSHIP</h2>
            {leadership.length > 0 ? leadership.map(leader => (
              <div key={leader.id} className="flex flex-col md:flex-row gap-10 items-center bg-gray-950 text-white rounded-[3rem] p-10 mb-8 last:mb-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-400 shrink-0">
                  <img src={leader.image} className="w-full h-full object-cover" alt={leader.name} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2">{leader.name}</h3>
                  <p className="text-yellow-400 font-bold uppercase tracking-widest mb-4">{leader.role}</p>
                  <p className="text-gray-400 leading-relaxed italic">"{leader.bio}"</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 font-bold uppercase tracking-widest text-center py-12">Leadership records are being updated.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
