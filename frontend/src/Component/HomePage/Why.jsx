import React from 'react';
import { Wallet, PackageSearch, Route } from 'lucide-react';

const featuresData = [
  {
    id: 1,
    target: "For Farmers",
    title: "Keep 100% of Your Profits",
    description: "Bypass expensive middlemen and connect directly with verified commercial buyers.",
    icon: Wallet
  },
  {
    id: 2,
    target: "For Buyers",
    title: "Direct-from-Farm Sourcing",
    description: "Secure fresh produce, manage traceability, and negotiate competitive wholesale pricing.",
    icon: PackageSearch
  },
  {
    id: 3,
    target: "For Transporters",
    title: "Optimize Your Routes",
    description: "Find consistent cargo, eliminate empty return trips, and scale your logistics fleet.",
    icon: Route
  }
];

export const Why = () => {
  return (
    <section className="bg-[#FAF9F4] py-24 w-full">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-widest text-[#D96B40] uppercase mb-4 block">
            Why AgriConnect?
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A3619]">
            Built for every link in the chain
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresData.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <div key={feature.id}
                 className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-default group">
                <div className="w-14 h-14 rounded-xl bg-[#F0F2EC] flex items-center justify-center mb-8 text-[#1A3619] group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <span className="text-[10px] font-bold tracking-widest text-[#D96B40] uppercase mb-3 block">
                  {feature.target}
                </span>
                
                <h3 className="text-2xl font-serif text-[#1A3619] mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};