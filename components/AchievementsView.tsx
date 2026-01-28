
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Achievement } from '../types';

const AchievementsView: React.FC = () => {
  const [milestones, setMilestones] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.getAchievements();
      setMilestones(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">OUR <span className="text-red-600 italic">MILESTONES</span></h1>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Tracing the historic rise of the people's movement.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-12">
          {milestones.length > 0 ? milestones.map((m, i) => (
            <div key={m.id} className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
              <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img src={m.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={m.title} />
              </div>
              <div className="flex-1">
                <div className="text-red-600 font-black text-xl mb-2">{m.year}</div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">{m.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{m.desc}</p>
              </div>
            </div>
          )) : (
            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-[3rem]">
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Milestone documentation is being updated.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
