
import React from 'react';
import { EVENTS } from '../constants';

const EventsView: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black font-poppins text-gray-900 mb-4 tracking-tighter">UPCOMING <span className="text-red-600">GATHERINGS</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto">Be the wave of change. Join our state-wide rallies and community meetings to hear directly from our leadership.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {EVENTS.map((event) => (
            <div key={event.id} className="group bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
              <div className="h-64 relative overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  {event.type}
                </div>
              </div>
              <div className="p-8">
                <p className="text-red-600 font-bold text-sm mb-2">{event.date}</p>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-8">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {event.location}
                </div>
                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold group-hover:bg-red-600 transition-colors">RSVP FOR EVENT</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-yellow-400 rounded-[3rem] text-center">
          <h3 className="text-3xl font-black mb-4">CAN'T ATTEND IN PERSON?</h3>
          <p className="font-bold mb-8">All major TVK events are streamed live exclusively for our members.</p>
          <button className="px-12 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Get Virtual Access</button>
        </div>
      </div>
    </div>
  );
};

export default EventsView;
