
import React, { useState, useRef, useEffect } from 'react';
import { getPoliticalResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AssistantFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to TVK! I'm your official Vision Assistant. I can now search the web for real-time news about our party. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen) {
      document.body.style.overflow = window.innerWidth < 768 ? 'hidden' : 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const result = await getPoliticalResponse(input);
    const assistantMsg: ChatMessage = { 
      role: 'assistant', 
      content: result.text,
      links: result.links
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end ${isOpen && window.innerWidth < 768 ? 'inset-0 bottom-0 right-0 m-0 w-full h-full' : ''}`}>
      {isOpen && (
        <div className={`bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300
          ${window.innerWidth < 768 
            ? 'w-full h-full rounded-none mb-0' 
            : 'w-[380px] h-[550px] rounded-[2rem] mb-4'}`}>
          
          <div className="bg-red-700 p-4 text-white flex justify-between items-center safe-top">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-red-700 font-black shadow-lg">TVK</div>
              <div>
                <p className="font-bold text-sm">Vision Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[9px] text-red-200 uppercase font-bold tracking-widest">Live Node Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-200 p-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-10">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
                {m.links && m.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.links.map((link, idx) => link.web && (
                      <a 
                        key={idx} 
                        href={link.web.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9px] bg-white hover:bg-red-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider shadow-sm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        {link.web.title || "Source"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 pb-safe">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Vision AI..."
              className="flex-1 px-5 py-3.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />
            <button 
              onClick={handleSend}
              className="p-3.5 bg-red-700 text-white rounded-full hover:bg-red-800 transition-all shadow-lg active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </button>
          </div>
        </div>
      )}

      {(!isOpen || window.innerWidth >= 768) && (
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 md:w-16 md:h-16 bg-red-700 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white group"
        >
            {!isOpen ? (
            <div className="relative">
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-red-700 animate-ping"></span>
            </div>
            ) : (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
        </button>
      )}
    </div>
  );
};

export default AssistantFab;
