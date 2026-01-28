
import React, { useState, useRef } from 'react';
import { db } from '../services/db';
import { TAMIL_NADU_CONSTITUENCIES } from '../constants';
import { useAuth } from './AuthContext';
import WhistleIcon from './WhistleIcon';

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    constituency: '',
    password: '',
    avatar: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.constituency || !formData.password || !formData.email) return;

    setLoading(true);
    try {
      await db.registerMember(formData);
      const authSuccess = await login(formData.email, formData.password); 
      if (authSuccess) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 3000);
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-xl w-full text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Enrollment Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-bold mb-8">
            Comrade <span className="text-red-600">{formData.name}</span>, your membership is active.
          </p>
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 py-3 rounded-xl">
            Initializing Secure Session...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 py-20">
      <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
        
        <div className="md:w-2/5 bg-red-700 p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div>
            <WhistleIcon className="w-16 h-16 text-yellow-400 mb-8" />
            <h2 className="text-4xl font-black mb-6 leading-tight uppercase tracking-tighter">Join the<br /><span className="text-yellow-400 italic">Movement</span></h2>
            <p className="text-red-100 text-lg font-medium">Create your official credentials to access the Comrade Portal and Resource Hub.</p>
          </div>

          <div className="mt-12">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-3xl bg-white/10 border-4 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all overflow-hidden group"
            >
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-white/50 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                  <span className="text-[10px] font-black uppercase">Photo</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="md:w-3/5 p-12 md:p-16 overflow-y-auto">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Official Enrollment</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold text-xs uppercase tracking-widest">PostgreSQL Compliant • Secure Credentialing</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-1">Full Legal Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Thiru..." className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-red-600 dark:focus:border-red-600 transition-colors font-bold text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@domain.com" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-red-600 dark:focus:border-red-600 transition-colors font-bold text-gray-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-1">Primary Mobile</label>
                <input required type="tel" pattern="[0-9]{10}" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} placeholder="98765..." className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-red-600 dark:focus:border-red-600 transition-colors font-bold text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-1">Choose Constituency</label>
                <select required value={formData.constituency} onChange={(e) => setFormData({...formData, constituency: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-red-600 dark:focus:border-red-600 font-bold text-gray-900 dark:text-white appearance-none">
                  <option value="">Choose Assembly</option>
                  {TAMIL_NADU_CONSTITUENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block px-1">Secure Password</label>
              <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:border-red-600 dark:focus:border-red-600 transition-colors font-bold text-gray-900 dark:text-white" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-gray-900 dark:hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 transform active:scale-95">
              {loading ? 'Processing Data...' : 'Verify & Enroll Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
