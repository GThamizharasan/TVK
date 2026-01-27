
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INITIAL_VOTES, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';

const VotingSection: React.FC = () => {
  const [votes, setVotes] = useState(INITIAL_VOTES);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setVotes(prev => prev.map(v => v.id === id ? { ...v, votes: v.votes + 1 } : v));
    setHasVoted(true);
  };

  return (
    <section id="vote" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black font-poppins text-gray-900 mb-4">WHAT SHOULD BE OUR <span className="text-red-600">PRIORITY?</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Cast your vote on which issue the TVK should prioritize first in its manifesto for the upcoming assembly elections.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {votes.map((option) => (
              <button
                key={option.id}
                disabled={hasVoted}
                onClick={() => handleVote(option.id)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 flex justify-between items-center group
                  ${hasVoted ? 'border-gray-200 cursor-default' : 'border-gray-100 hover:border-red-500 hover:shadow-lg hover:-translate-y-1'}`}
              >
                <span className="text-lg font-bold text-gray-800">{option.label}</span>
                {!hasVoted && (
                  <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-sm group-hover:bg-red-600 group-hover:text-white transition-colors">Vote</span>
                )}
                {hasVoted && (
                  <span className="text-red-600 font-bold">{Math.round((option.votes / votes.reduce((a, b) => a + b.votes, 0)) * 100)}%</span>
                )}
              </button>
            ))}
            {hasVoted && <p className="text-green-600 font-bold text-center mt-4">Thank you for your valuable input!</p>}
          </div>

          <div className="h-[400px] bg-gray-50 rounded-3xl p-8 shadow-inner">
            <h3 className="text-xl font-bold mb-6 text-center text-gray-700 underline decoration-yellow-400 underline-offset-8">LIVE FEEDBACK RESULTS</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={votes} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={140} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                  {votes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VotingSection;
