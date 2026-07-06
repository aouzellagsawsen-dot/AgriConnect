import React, { useState } from 'react';
import { Leaf, ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' ou 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setStep('success');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0E1A0B] bg-gradient-to-br from-[#0E1A0B] via-[#162A12] to-[#1F3319] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* === DÉCORATIONS D'ARRIÈRE-PLAN === */}
      <div className="absolute top-[-20%] left-[-10%] w-[45rem] h-[45rem] bg-[#557A46]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-[#D96B40]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* BOUTON RETOUR VOLANT */}
      <Link 
        to="/auth" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl"
      >
        <ArrowLeft size={14} />
        Back to Sign In
      </Link>

      {/* === CARTE PRINCIPALE (PAS DE SCROLL) === */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#FCFBF7] rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] border border-white/60 p-6 sm:p-10 relative z-10 overflow-hidden"
      >
        <Leaf className="absolute -right-12 -top-12 text-[#557A46]/5 w-48 h-48 -rotate-45 pointer-events-none" strokeWidth={1} />
        
        <AnimatePresence mode="wait">
          {step === 'email' ? (
            /* === ÉTAPE 1 : ENTRER L'EMAIL === */
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* EN-TÊTE */}
              <div className="text-center mb-6">
                <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A3619] text-[#FAF9F4]">
                              <Leaf size={16} strokeWidth={2.5} />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold tracking-widest text-[#557A46] block">AgriConnect</span>
                            </div>
                          </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  No worries! Enter your email address below and we'll send you a link to reset your password.
                </p>
              </div>

              {/* FORMULAIRE */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com" 
                      className="w-full px-4 pl-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                    />
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* BOUTON D'ACTION TERRACOTTA */}
                <button 
                  type="submit"
                  className="w-full mt-2 bg-[#D96B40] hover:bg-[#c85a30] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#D96B40]/20 transition-all active:scale-[0.99] text-sm tracking-wide"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center mt-6">
                <Link to="/auth" className="text-xs font-bold text-[#1A3619] hover:underline">
                  Go Back to Home
                </Link>
              </div>
            </motion.div>
          ) : (
            /* === ÉTAPE 2 : SUCCÈS / VÉRIFIER L'EMAIL === */
            <motion.div
              key="success-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block mb-1">Link Sent</span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Check your inbox
              </h2>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
                We have sent a password reset link to <strong className="text-gray-800 font-medium">{email}</strong>. Please follow the instructions inside.
              </p>

              {/* ACTION ACCESSOIRE */}
              <div className="space-y-3">
                <button 
                  onClick={() => setStep('email')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-all text-xs"
                >
                  Resend Email
                </button>
                
                <Link 
                  to="/auth"
                  className="block w-full text-center text-xs font-bold text-[#D96B40] hover:text-[#c85a30] pt-2"
                >
                  Return to login page
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}