
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { PRIMARY_COLOR, SECONDARY_COLOR, HISTORICAL_VOTING_DATA } from '../constants';
import { db } from '../services/db';
import { VoteOption } from '../types';
import { useAuth } from './AuthContext';

const VotingSection: React.FC = () => {
  const { isMember } = useAuth();
  const [votes, setVotes] = useState<VoteOption[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      const data = await db.getVotes();
      setVotes(data);
    };
    fetchVotes();
  }, []);

  const handleVote = async (id: string) => {
    if (hasVoted || !isMember) return;
    await db.castVote(id);
    const updated = await db.getVotes();
    setVotes(updated);
    setHasVoted(true);
  };

  return (
    <section id="vote" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-poppins text-gray-900 mb-6">WHAT SHOULD BE OUR <span className="text-red-600">PRIORITY?</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Cast your vote on which issue the TVK should prioritize first in its manifesto for the upcoming assembly elections.</p>
          {!isMember && (
            <p className="mt-4 text-red-600 font-bold bg-red-50 inline-block px-4 py-2 rounded-lg text-sm border border-red-100">Login to participate in the official poll</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              {votes.map((option) => (
                <button
                  key={option.id}
                  disabled={hasVoted || !isMember}
                  onClick={() => handleVote(option.id)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 flex justify-between items-center group
                    ${(hasVoted || !isMember) ? 'border-gray-100 cursor-default' : 'border-gray-100 hover:border-red-500 hover:shadow-xl hover:-translate-y-1'}`}
                >
                  <span className="text-xl font-bold text-gray-800">{option.label}</span>
                  {!hasVoted && isMember && (
                    <span className="bg-gray-100 text-gray-500 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-colors">Vote</span>
                  )}
                  {(hasVoted || !isMember) && (
                    <span className="text-red-600 font-black text-lg">{Math.round((option.votes / (votes.reduce((a, b) => a + b.votes, 0) || 1)) * 100)}%</span>
                  )}
                </button>
              ))}
            </div>
            
            {hasVoted && (
              <div className="p-6 bg-green-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  Your vote has been recorded in the database.
                </p>
              </div>
            )}

            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              {showHistory ? 'View Live Standings' : 'View Voting Trends'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-[3rem] p-10 shadow-inner min-h-[500px] flex flex-col">
            <h3 className="text-2xl font-black mb-8 text-center text-gray-800 uppercase tracking-tighter">
              {showHistory ? 'HISTORICAL PROGRESSION' : 'LIVE FEEDBACK RESULTS'}
              <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            </h3>
            
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {!showHistory ? (
                  <BarChart data={votes} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="label" 
                      type="category" 
                      width={140} 
                      tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={32}>
                      {votes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <LineChart data={HISTORICAL_VOTING_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      wrapperStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', paddingBottom: '20px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="education" 
                      name="Education" 
                      stroke={PRIMARY_COLOR} 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: PRIMARY_COLOR, strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="unemployment" 
                      name="Unemployment" 
                      stroke="#2563eb" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="farmers" 
                      name="Farmers" 
                      stroke={SECONDARY_COLOR} 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: SECONDARY_COLOR, strokeWidth: 2, stroke: '#fff' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="environment" 
                      name="Environment" 
                      stroke="#059669" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }} 
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
              Verified Database Totals: {votes.reduce((a, b) => a + b.votes, 0).toLocaleString()} votes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VotingSection;
