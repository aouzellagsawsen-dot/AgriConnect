import React from 'react';
import { Circle, Square, CircleUserRound, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1D3A11] text-[#E0E7D8] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Colonne 1 */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 select-none">
              <div className="flex items-center justify-center w-10 h-10 border border-[#E0E7D8] rounded-full text-[#E0E7D8]">
                <Leaf size={20} strokeWidth={1.5} />
              </div>
              <span className="text-3xl font-serif text-white tracking-tight">
                AgriConnect
              </span>
            </Link>

            <p className="text-base text-[#C2D1B6] max-w-sm">
              The North African marketplace bringing farmers, buyers, and transporters together.
            </p>
            
          </div>

          {/* Colonne 2 */}
          <div className="md:col-start-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              COMPANY
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-base hover:text-white transition-colors block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-base hover:text-white transition-colors block">
                  Our impact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-base hover:text-white transition-colors block">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-base hover:text-white transition-colors block">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              SUPPORT
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-base hover:text-white transition-colors block">
                  Help center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base hover:text-white transition-colors block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base hover:text-white transition-colors block">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base hover:text-white transition-colors block">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-[#345126]">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 text-sm text-[#C2D1B6]">
            <p>
              &copy; {currentYear} AgriConnect. All rights reserved.
            </p>
            <p>
              Registered in Algeria. 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;