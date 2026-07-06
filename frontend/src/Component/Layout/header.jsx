import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Détecte le scroll pour appliquer l'effet Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile automatiquement si on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleScrollTo = (e, targetId) => {
    if (location.pathname === '/') {
      e.preventDefault(); // Empêche le saut brutal
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false); // Ferme le menu mobile au clic
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 inset-x-4 z-50 mx-auto max-w-7xl transition-all duration-500 ${
        mobileMenuOpen 
          ? 'rounded-[2rem] bg-white border border-[#1A3619]/10 shadow-lg' 
          : 'rounded-full'
      } ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border border-[#1A3619]/10 py-2.5 shadow-[0_10px_30px_rgba(26,54,25,0.05)]' 
          : 'bg-[#FAF9F4]/40 backdrop-blur-sm border border-[#1A3619]/5 py-4'
      }`}
    >
      {/* Remplacement de px-6 par px-8 pour s'adapter à la forme arrondie */}
      <div className="w-full px-6 md:px-8 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="flex items-center justify-center w-9 h-9 bg-[#1A3619] rounded-full text-[#FAF9F4] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <Leaf size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl md:text-2xl font-serif text-[#1A3619] tracking-tight font-semibold">
            AgriConnect
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/#How" 
            onClick={(e) => handleScrollTo(e, 'How')}
            className="text-[#1A3619]/80 hover:text-[#D96B40] text-sm font-medium transition-colors relative group"
          >
            How it Works
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#D96B40] rounded-full opacity-0 transform -translate-x-1/2 transition-all duration-300 group-hover:opacity-100 group-hover:-bottom-1.5"></span>
          </Link>
          
          <Link 
            to="/about" 
            className="text-[#1A3619]/80 hover:text-[#D96B40] text-sm font-medium transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#D96B40] rounded-full opacity-0 transform -translate-x-1/2 transition-all duration-300 group-hover:opacity-100 group-hover:-bottom-1.5"></span>
          </Link>

          {/* CTA BOUTON OVALE HAUT DE GAMME */}
          <Link 
            to="/auth" 
            className="relative overflow-hidden group px-6 py-2 bg-[#1A3619] text-[#FAF9F4] text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#1A3619]/15"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Sign In / Sign Up
            </span>
            <div className="absolute inset-0 bg-[#D96B40] transform scale-x-0 origin-left transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:scale-x-100 z-0"></div>
          </Link>
        </nav>

        {/* BOUTON MENU MOBILE */}
        <button 
          className="md:hidden text-[#1A3619] p-2 hover:bg-[#1A3619]/5 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MENU MOBILE DÉROULANT AJUSTÉ POUR LA FORME CAPSULE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col px-8 pb-6 pt-4 gap-4">
              <Link 
                to="/how" 
                className="text-[#1A3619]/90 font-medium text-base py-2 border-b border-[#1A3619]/5"
              >
                How it Works
              </Link>
              <Link 
                to="/about" 
                className="text-[#1A3619]/90 font-medium text-base py-2 border-b border-[#1A3619]/5"
              >
                About
              </Link>
              <Link 
                to="/auth" 
                className="mt-2 w-full text-center px-6 py-3 bg-[#1A3619] text-[#FAF9F4] font-semibold rounded-xl active:scale-95 transition-transform text-sm"
              >
                Sign In / Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;