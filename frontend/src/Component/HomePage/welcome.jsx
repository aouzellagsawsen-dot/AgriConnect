import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroHarvest from './hero-harvest.jpg';

export const Welcome = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gray-900 text-white overflow-hidden w-full">
      
      {/* 1. L'image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url(${heroHarvest})`
          }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1D3A11]/85 via-[#345126]/70 to-black/40 mix-blend-multiply" />

      {/* 2. Le contenu de la section */}
      <div className="relative z-10 max-w-5xl px-8 md:px-16 py-20 flex flex-col justify-center h-full">

        <h1 className="text-4xl md:text-6xl font-serif text-white font-normal leading-[1.15] tracking-tight max-w-3xl mb-6">
          The North African <br />
          <span className="italic font-light text-[#E0E7D8]">Marketplace:</span> <br />
          From Farms Directly to Warehouses.
        </h1>

        <p className="text-base md:text-lg text-[#C2D1B6] max-w-xl font-sans font-light leading-relaxed mb-10">
          AgriConnect seamlessly bridges the gap between local farmers, bulk buyers, and reliable transporters across North Africa.
        </p>

        {/* Boutons d'action (CTA) */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A6B31] hover:bg-[#4B5929] text-white font-semibold rounded-full shadow-md transition-all transform hover:-translate-y-0.5 duration-200"
          >
            Create Your Free Account
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          
        </div>

        {/* 3. Section Statistiques */}
        <div className="border-t border-white/20 pt-6 max-w-md">
          <div className="grid grid-cols-3 gap-8">
            
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-semibold font-sans tracking-tight text-white">
                2,400+
              </span>
              <span className="text-[10px] tracking-wider text-[#C2D1B6] uppercase font-bold mt-1">
                Farmers
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-semibold font-sans tracking-tight text-white">
                52
              </span>
              <span className="text-[10px] tracking-wider text-[#C2D1B6] uppercase font-bold mt-1">
                Regions
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-semibold font-sans tracking-tight text-white">
                98%
              </span>
              <span className="text-[10px] tracking-wider text-[#C2D1B6] uppercase font-bold mt-1">
                On-Time
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};