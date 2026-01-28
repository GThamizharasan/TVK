
import React, { useState } from 'react';
import { MANIFESTO_POINTS } from '../constants';
import WhistleIcon from './WhistleIcon';
import { useAuth } from './AuthContext';

interface ManifestoViewProps {
  onAddSuggestion: (text: string) => void;
}

const ManifestoView: React.FC<ManifestoViewProps> = ({ onAddSuggestion }) => {
  const { isMember } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || !isMember) return;
    
    onAddSuggestion(suggestion);
    setSuggestion('');
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 4000);
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block p-4 bg-white rounded-3xl shadow-sm mb-6">
            <WhistleIcon className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-poppins text-gray-900 mb-6 uppercase tracking-tighter">The 2026 <span className="text-red-600 italic">Vision Doc</span></h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium">A roadmap for the restoration of Tamil Nadu's pride and the empowerment of its future generations.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {MANIFESTO_POINTS.map((point, i) => (
            <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 font-black text-xl md:text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                0{i + 1}
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-4 text-gray-900">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">{point.desc}</p>
              <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
                <button className="text-[10px] md:text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  Detailed Plan <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(n => <div key={n} className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 border-2 border-white"></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Interaction Section */}
        {!showForm ? (
          <div className="bg-red-700 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase">WANT TO SUGGEST A POLICY?</h2>
                <p className="text-red-100 text-base md:text-lg">We are the party of the people. Submit your ideas for the 2026 manifesto and help us build a better state.</p>
                {!isMember && (
                  <p className="mt-4 text-yellow-400 text-xs font-black uppercase tracking-widest bg-black/20 inline-block px-4 py-2 rounded-lg backdrop-blur">
                    Membership Required to Propose
                  </p>
                )}
              </div>
              <button 
                onClick={() => {
                  if (isMember) {
                    setShowForm(true);
                  } else {
                    window.scrollTo(0, 0); // Trigger view change in App
                  }
                }}
                className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-red-700 rounded-2xl font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors shadow-2xl text-sm md:text-base"
              >
                {isMember ? 'Submit Suggestion' : 'Enroll to Contribute'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
            {submitted ? (
              <div className="text-center py-10 md:py-20 animate-in zoom-in duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Thank You!</h2>
                <p className="text-gray-500 text-base md:text-lg max-w-sm mx-auto font-medium">Your suggestion has been sent to our vision committee. Together, we build the future.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <button type="button" onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Propose your <span className="text-red-600">Vision</span></h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Your Suggestion</label>
                    <textarea 
                      required
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="e.g., Implementing free transport for students in rural areas..."
                      className="w-full h-32 md:h-40 bg-gray-50 border-2 border-gray-100 rounded-2xl md:rounded-3xl p-6 text-gray-900 focus:outline-none focus:border-red-600 transition-colors placeholder-gray-300 text-base md:text-lg font-medium"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="w-full md:w-auto px-10 md:px-12 py-4 md:py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-gray-900 transition-all shadow-xl shadow-red-600/20 text-sm md:text-base"
                    >
                      Send Proposal
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManifestoView;
