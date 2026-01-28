
import React, { useState, useEffect } from 'react';
import WhistleIcon from './WhistleIcon';
import { db } from '../services/db';
import { PollData } from '../types';

const PublicPoll: React.FC = () => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      const data = await db.getPollData();
      setPollData(data);
    };
    fetchPoll();
  }, []);

  const handleVote = (id: string) => {
    setSelectedOption(id);
    setVoted(true);
    // Note: We could use db.castVote here if we wanted to track actual counts, 
    // but for the Public Opinion Poll we're displaying percentages set by admin or computed elsewhere.
  };

  if (!pollData) return null;

  return (
    <section className="py-24 bg-gray-900 text-white border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 text-red-700 shadow-lg shadow-yellow-400/20">
            <WhistleIcon className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black font-poppins mb-4 tracking-tight">PUBLIC <span className="text-yellow-400">OPINION</span> POLL</h2>
          <p className="text-gray-400 max-w-2xl">Your voice matters. Help us understand the pulse of Tamil Nadu by participating in our weekly opinion polls.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-8 text-center">{pollData.question}</h3>
          
          <div className="space-y-4">
            {pollData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={voted}
                className={`w-full relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 group
                  ${voted 
                    ? (selectedOption === option.id ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/10 bg-white/5') 
                    : 'border-white/20 hover:border-yellow-400 hover:bg-white/5'
                  }`}
              >
                {/* Result Bar */}
                {voted && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-yellow-400/20 transition-all duration-1000 ease-out"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                )}
                
                <div className="relative flex justify-between items-center z-10">
                  <span className="font-bold">{option.label}</span>
                  {voted && <span className="text-yellow-400 font-black">{option.percentage}%</span>}
                </div>
              </button>
            ))}
          </div>

          {voted && (
            <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-yellow-400 font-bold mb-2">Thank you for your response!</p>
              <p className="text-gray-500 text-sm">Total responses: 1,42,882 • Last updated: 5 mins ago</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicPoll;
