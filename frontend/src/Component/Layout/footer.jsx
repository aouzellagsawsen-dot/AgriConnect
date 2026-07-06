import React, { useRef } from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <footer className="relative bg-[#1A3619] text-[#FAF9F4] font-sans overflow-hidden">
      
      {/* Tache de lumière en fond */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-[#D96B40]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />

      <motion.div 
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        /* Padding vertical drastiquement réduit (py-8) */
        className="max-w-7xl mx-auto px-6 py-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          
          {/* Bloc de gauche : Logo et court texte */}
          <motion.div variants={itemVariants} className="max-w-sm text-center md:text-left flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 group select-none w-fit mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D1F0C] border border-white/5 text-white group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <Leaf size={20} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-serif text-white tracking-tight">
                AgriConnect
              </span>
            </Link>
            <p className="text-xs md:text-sm text-[#FAF9F4]/70 leading-relaxed">
              The seamless marketplace bringing farmers, buyers, and transporters together.
            </p>
          </motion.div>

          {/* Bloc de droite : Liens en Grille (2x2) */}
          <motion.div variants={itemVariants} className="mt-4 md:mt-0 flex items-center">
            {/* Grille 2 colonnes */}
            <ul className="grid grid-cols-2 gap-x-12 gap-y-4 text-center md:text-left">
              <li>
                <Link to="/help" className="text-sm text-[#FAF9F4]/70 hover:text-white transition-colors block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[#FAF9F4]/70 hover:text-white transition-colors block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-[#FAF9F4]/70 hover:text-white transition-colors block">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-[#FAF9F4]/70 hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Ligne du bas : Copyright (marge MT drastiquement réduite à mt-8) */}
        <motion.div 
          variants={itemVariants} 
          className="mt-8 pt-5 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#FAF9F4]/50">
            <p>
              &copy; {currentYear} AgriConnect. All rights reserved.
            </p>
            <p>
              Registered in North Africa.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;