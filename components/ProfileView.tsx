
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/db';

type VerificationStep = 'IDLE' | 'SENDING' | 'WAITING';

const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState<'email' | 'phone' | null>(null);
  const [step, setStep] = useState<VerificationStep>('IDLE');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [userOtp, setUserOtp] = useState('');
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Revert if canceling
      if (user) {
        setEditForm({
          name: user.name || '',
          email: user.email || '',
          mobile: user.mobile || ''
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const emailChanged = editForm.email !== user.email;
    const mobileChanged = editForm.mobile !== user.mobile;

    const updates: any = {
      name: editForm.name,
      email: editForm.email,
      mobile: editForm.mobile
    };

    // Reset verification if contact info changed
    if (emailChanged) updates.isEmailVerified = false;
    if (mobileChanged) updates.isPhoneVerified = false;

    try {
      await db.updateUser(user.id, updates);
      updateUser(updates);
      setIsEditing(false);
      // Optional: Show success toast
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const startVerification = (type: 'email' | 'phone') => {
    setIsVerifying(type);
    setStep('SENDING');
    setError('');
    
    // Simulate generation and dispatch
    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep('WAITING');
      setShowNotification(true);
      
      // Hide notification after 8 seconds
      setTimeout(() => setShowNotification(false), 8000);
    }, 2000);
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (userOtp !== generatedOtp) {
      setError('Invalid verification code. Please check your inbox.');
      return;
    }

    setStep('SENDING'); // Re-use for "Verifying..." state
    
    setTimeout(async () => {
      const updates = isVerifying === 'email' 
        ? { isEmailVerified: true } 
        : { isPhoneVerified: true };
      
      await db.updateUser(user.id, updates);
      updateUser(updates);
      resetState();
    }, 1500);
  };

  const resetState = () => {
    setIsVerifying(null);
    setStep('IDLE');
    setGeneratedOtp('');
    setUserOtp('');
    setError('');
    setShowNotification(false);
  };

  if (!user) return null;

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen relative">
      {/* Simulated Email/SMS Notification */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] w-full max-w-sm px-4 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">New Message from TVK Gateway</p>
              <p className="text-white text-sm font-medium">Your 4-digit verification security code is: <span className="text-yellow-400 font-black text-lg ml-1">{generatedOtp}</span></p>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-gray-500 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="bg-red-700 p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl relative group">
                <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} className="w-full h-full object-cover" alt={user.name} />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{user.name}</h1>
                <p className="text-red-100 font-bold uppercase tracking-widest text-sm mb-4">TVK Membership ID: <span className="text-yellow-400">{user.membershipId}</span></p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Member since {new Date(user.joinedAt).getFullYear()}</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{user.role} Access</span>
                </div>
              </div>
              <button 
                onClick={handleEditToggle}
                className="px-6 py-3 bg-white text-red-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 hover:text-black transition-all shadow-xl"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Update Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors font-bold dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Identity</label>
                    <input 
                      required 
                      type="email" 
                      value={editForm.email} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors font-bold dark:text-white" 
                    />
                    <p className="text-[9px] font-bold text-red-500 uppercase px-1">Changing email will reset verification status.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
                    <input 
                      required 
                      type="tel" 
                      value={editForm.mobile} 
                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-colors font-bold dark:text-white" 
                    />
                    <p className="text-[9px] font-bold text-red-500 uppercase px-1">Changing phone will reset verification status.</p>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-5 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/30 transform hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Synchronizing Data...' : 'Save Member Records'}
                </button>
              </form>
            ) : (
              <>
                <section className="space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-400">Security & Verification</h2>
                    <span className="text-[9px] font-black text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase">Level 1 Identity</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Email Verification Card */}
                    <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${user.isEmailVerified ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800' : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800'}`}>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                          <svg className={`w-5 h-5 ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        {user.isEmailVerified ? (
                          <span className="text-[10px] font-black text-green-600 bg-green-100 dark:bg-green-800/40 px-3 py-1 rounded-full uppercase">Authenticated</span>
                        ) : (
                          <span className="text-[10px] font-black text-red-600 bg-red-100 dark:bg-red-800/40 px-3 py-1 rounded-full uppercase">Action Required</span>
                        )}
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Registered Email</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative z-10 truncate">{user.email}</p>
                      {!user.isEmailVerified && (
                        <button onClick={() => startVerification('email')} className="w-full py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-red-600/20 relative z-10">Generate Security Link</button>
                      )}
                      {user.isEmailVerified && (
                        <div className="text-[10px] font-black text-green-700 uppercase flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          Secure Communication Active
                        </div>
                      )}
                    </div>

                    {/* Phone Verification Card */}
                    <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group ${user.isPhoneVerified ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800' : 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800'}`}>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                          <svg className={`w-5 h-5 ${user.isPhoneVerified ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        {user.isPhoneVerified ? (
                          <span className="text-[10px] font-black text-green-600 bg-green-100 dark:bg-green-800/40 px-3 py-1 rounded-full uppercase">Authenticated</span>
                        ) : (
                          <span className="text-[10px] font-black text-red-600 bg-red-100 dark:bg-red-800/40 px-3 py-1 rounded-full uppercase">Action Required</span>
                        )}
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Verified Mobile</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative z-10">{user.mobile || 'Not Linked'}</p>
                      {!user.isPhoneVerified && user.mobile && (
                        <button onClick={() => startVerification('phone')} className="w-full py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all shadow-lg shadow-red-600/20 relative z-10">Request SMS PIN</button>
                      )}
                      {user.isPhoneVerified && (
                        <div className="text-[10px] font-black text-green-700 uppercase flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          SMS Alert System Ready
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-4">Territorial Mapping</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assembly Constituency</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{user.constituency}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Primary Authentication</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{user.ssoProvider || 'TVK Core Cloud'}</p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modern Verification Gateway Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden">
            
            {step === 'SENDING' ? (
              <div className="py-20 text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto mb-8 relative">
                   <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
                   <div className="relative w-full h-full bg-red-700 rounded-[2rem] flex items-center justify-center shadow-2xl">
                     <svg className="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                   </div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Dispatching Token</h3>
                <p className="text-gray-500 text-sm mt-3 font-medium">Communicating with {isVerifying} gateway...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Verify Identity</h3>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">A 4-digit code was sent to <span className="font-bold text-gray-900 dark:text-white">{isVerifying === 'email' ? user.email : user.mobile}</span>. Enter it to finalize authentication.</p>
                </div>
                
                <form onSubmit={submitOtp} className="space-y-8">
                  <div>
                    <input 
                      autoFocus
                      required
                      maxLength={4}
                      value={userOtp}
                      onChange={(e) => {
                        setError('');
                        setUserOtp(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="••••"
                      className="w-full text-center text-5xl font-black tracking-[0.6em] py-6 bg-gray-50 dark:bg-gray-800 border-3 border-gray-100 dark:border-gray-700 rounded-[2rem] focus:border-red-600 outline-none dark:text-white transition-all shadow-inner"
                    />
                    {error && <p className="text-red-600 text-[10px] font-black uppercase text-center mt-4 bg-red-50 dark:bg-red-900/20 py-2 rounded-xl animate-shake">{error}</p>}
                  </div>

                  <div className="flex flex-col gap-4">
                    <button type="submit" className="w-full py-5 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">Finalize Verification</button>
                    <button type="button" onClick={resetState} className="w-full py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Abort Mission</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default ProfileView;
