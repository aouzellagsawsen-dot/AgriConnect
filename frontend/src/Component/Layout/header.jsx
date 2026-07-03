import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#F5F5F1]">
      <Link to="/" className="flex items-center gap-3 cursor-pointer select-none">
        <div className="flex items-center justify-center w-10 h-10 bg-[#5A6B31] rounded-full text-white">
          <Leaf size={20} strokeWidth={2} />
        </div>
        <span className="text-2xl font-serif text-gray-900 tracking-tight">
          AgriConnect
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/how" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
          How it Works
        </Link>
        
        <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
          About
        </Link>
        <Link to="/auth" 
          className="px-6 py-2.5 bg-[#5A6B31] hover:bg-[#4B5929] text-white font-semibold rounded-md shadow-sm transition-colors text-center">
          Sign In / Sign Up
        </Link>
      </div>
      
    </nav>
  );
};

export default Header;