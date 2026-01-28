
import React from 'react';
import { TVKEvent } from '../types';

interface EventsViewProps {
  events: TVKEvent[];
  isSection?: boolean;
}

const EventsView: React.FC<EventsViewProps> = ({ events, isSection = false }) => {
  const formatICSDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '20240101'; // Fallback
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const handleAddToCalendar = (event: TVKEvent) => {
    const startDate = formatICSDate(event.date);
    
    // Calculate end date (next day for all-day event)
    const d = new Date(event.date);
    d.setDate(d.getDate() + 1);
    const endDate = formatICSDate(d.toDateString());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TVK//Official Event//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@tvk.org`,
      `DTSTAMP:${startDate}T000000Z`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location}`,
      `DESCRIPTION:Join us for the TVK ${event.type}: ${event.title}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`${isSection ? 'py-24' : 'py-20'} bg-white dark:bg-gray-900 transition-colors`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black font-poppins text-gray-900 dark:text-white mb-4 tracking-tighter">UPCOMING <span className="text-red-600">GATHERINGS</span></h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">Be the wave of change. Join our state-wide rallies and community meetings to hear directly from our leadership.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {events.length > 0 ? events.map((event) => (
            <div key={event.id} className="group bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
              <div className="h-64 relative overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {event.type}
                </div>
              </div>
              <div className="p-8">
                <p className="text-red-600 font-black text-sm mb-2 uppercase tracking-wider">{event.date}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{event.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold mb-6">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {event.location}
                </div>
                
                <div className="space-y-3">
                  <button className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-red-600 transition-colors shadow-lg">
                    RSVP FOR EVENT
                  </button>
                  <button 
                    onClick={() => handleAddToCalendar(event)}
                    className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl font-black uppercase tracking-widest hover:bg-white dark:hover:bg-gray-700 hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center gap-2 text-[9px]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    ADD TO CALENDAR
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">No upcoming events scheduled at this time.</p>
            </div>
          )}
        </div>

        {isSection && (
          <div className="mt-20 p-12 bg-yellow-400 rounded-[3rem] text-center shadow-xl shadow-yellow-400/20">
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">CAN'T ATTEND IN PERSON?</h3>
            <p className="font-bold mb-8 text-black/70">All major TVK events are streamed live exclusively for our registered members.</p>
            <button className="px-12 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl text-xs">Get Virtual Access</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsView;
