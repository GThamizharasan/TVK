
import React from 'react';
import { LEADERSHIP } from '../constants';

interface LeadershipSectionProps {
  onViewFullCommittee: () => void;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ onViewFullCommittee }) => {
  return (
    <section id="leadership" className="py-20 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-black font-poppins mb-6">GUIDING <span className="text-yellow-400 italic">LIGHTS</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">Meet the visionaries who are driving the Tamizhaga Vettri Kazhagam towards a new dawn of social and economic prosperity.</p>
          </div>
          <button 
            onClick={onViewFullCommittee}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
          >
            Full Committee
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {LEADERSHIP.map((member) => (
            <div key={member.id} className="group flex flex-col md:flex-row bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-colors">
              <div className="md:w-1/2 h-[400px] overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" 
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-2">{member.role}</span>
                <h3 className="text-3xl font-black mb-4 font-poppins">{member.name}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{member.bio}</p>
                <div className="flex gap-4">
                  <button className="p-2 bg-white/10 rounded-full hover:bg-yellow-400 hover:text-black transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </button>
                  <button className="p-2 bg-white/10 rounded-full hover:bg-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
