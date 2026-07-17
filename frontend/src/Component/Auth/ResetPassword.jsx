import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Leaf, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams(); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('form'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      
      const response = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { 
        password 
      }, { withCredentials: true });

      if (response.data.success) {
        setStep('success');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Link expired or invalid token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0E1A0B] bg-gradient-to-br from-[#0E1A0B] via-[#162A12] to-[#1F3319] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-10%] w-[45rem] h-[45rem] bg-[#557A46]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-[#D96B40]/15 rounded-full blur-[130px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#FCFBF7] rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] border border-white/60 p-6 sm:p-10 relative z-10 overflow-hidden"
      >
        <Leaf className="absolute -right-12 -top-12 text-[#557A46]/5 w-48 h-48 -rotate-45 pointer-events-none" strokeWidth={1} />
        
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="reset-form-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A3619] text-[#FAF9F4]">
                    <Leaf size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#557A46] block">AgriConnect</span>
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Enter your new password below to regain secure access to your account.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full px-4 pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                 <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full px-4 pl-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

               {errorMessage && (
                  <div className="text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#D96B40] hover:bg-[#c85a30] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#D96B40]/20 transition-all active:scale-[0.99] text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reset-success-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block mb-1">Success</span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Password Updated
              </h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
                Your password has been successfully reset. You can now securely log in with your new credentials.
              </p>

              <Link 
                to="/auth"
                className="block w-full text-center bg-[#1A3619] hover:bg-[#122612] text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Sign In Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}