import React, { useState, useRef, useEffect } from 'react';
import { Leaf, ArrowLeft, MailCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Focus automatique sur le premier champ au chargement
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Gestion de la saisie (passe à la case suivante automatiquement)
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Gestion de la touche "Effacer"
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Gestion du collage
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setErrorMessage("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/verify-email', 
        { code: verificationCode }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage("Email verified successfully! Redirecting...");
        
        // 1. Récupération du rôle de l'utilisateur (on utilise "?" pour éviter les crashs si non défini)
        const userRole = response.data.user?.role;

        // 2. Redirection conditionnelle après 2 secondes selon le rôle
        setTimeout(() => {
          if (userRole === 'farmer') {
            navigate('/dash');
          } else if (userRole === 'buyer') {
            navigate('/Bdash');
          } else if (userRole === 'transporter') {
            navigate('/transporter-dashboard');
          } else {
            navigate('/'); // Redirection par défaut vers l'accueil
          }
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0E1A0B] bg-gradient-to-br from-[#0E1A0B] via-[#162A12] to-[#1F3319] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* === DÉCORATIONS D'ARRIÈRE-PLAN === */}
      <div className="absolute top-[-20%] left-[-10%] w-[45rem] h-[45rem] bg-[#557A46]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-[#D96B40]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* BOUTON RETOUR */}
      <Link 
        to="/auth" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl"
      >
        <ArrowLeft size={14} />
        Back to Login
      </Link>

      {/* === CARTE PRINCIPALE === */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#FCFBF7] rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] border border-white/60 p-6 sm:p-10 relative z-10 overflow-hidden"
      >
        <Leaf className="absolute -right-12 -top-12 text-[#557A46]/5 w-48 h-48 -rotate-45 pointer-events-none" strokeWidth={1} />
        
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1A3619] text-[#FAF9F4] mb-4">
            <MailCheck size={24} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-[#557A46] block uppercase mb-2">AgriConnect</span>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Verify your email
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            We've sent a 6-digit verification code to your email. Enter it below to confirm your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
          
          <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-[#1A3619] bg-white border-2 border-gray-200 rounded-xl focus:border-[#D96B40] focus:ring-2 focus:ring-[#D96B40]/20 focus:outline-none transition-all"
              />
            ))}
          </div>

          {errorMessage && (
            <div className="text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="text-emerald-600 text-xs font-semibold text-center bg-emerald-50 py-2 rounded-lg">
              {successMessage}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || code.some((digit) => digit === '')}
            className="w-full bg-[#D96B40] hover:bg-[#c85a30] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#D96B40]/20 transition-all active:scale-[0.99] text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-500">
          Didn't receive the code?{' '}
          <button className="text-[#1A3619] font-bold hover:underline focus:outline-none">
            Resend it
          </button>
        </p>

      </motion.div>
    </div>
  );
}