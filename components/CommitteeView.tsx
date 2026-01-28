
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { LeadershipMember } from '../types';

const CommitteeView: React.FC = () => {
  const [committee, setCommittee] = useState<LeadershipMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.getLeadership();
      setCommittee(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">STATE <span className="text-red-600">COMMITTEE</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">The dedicated team behind the TVK vision.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {committee.length > 0 ? committee.map((member) => (
            <div key={member.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-white text-xs italic font-medium">"{member.bio}"</p>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-red-100">
                    {member.role}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{member.name}</h3>
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-gray-50">
                   <button className="text-gray-400 hover:text-red-600 transition-colors">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                   </button>
                   <button className="text-gray-400 hover:text-blue-600 transition-colors">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                   </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 rounded-[3rem]">
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No committee members found in database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitteeView;
