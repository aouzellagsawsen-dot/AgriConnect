import React from 'react';
import { UserPlus, Handshake, Truck } from 'lucide-react';

const featuresData = [
  {
    id: 1,
    title: "Create and List",
    description: "Set up your profile as a farmer, buyer, or transporter and publish your inventory or logistical capacity.",
    icon: UserPlus
  },
  {
    id: 2,
    title: "Connect and Match",
    description: "Negotiate terms directly through our transparent communication channels with zero hidden fees.",
    icon: Handshake
  },
  {
    id: 3,
    title: "Transport and Deliver",
    description: "Hire a certified transporter on the platform, track your delivery, and complete your secure transaction.",
    icon: Truck
  }
];

export const How = () => {
  return (
    <section className="bg-[#FAF9F4] py-24 w-full">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-widest text-[#D96B40] uppercase mb-4 block">
            How it Works
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A3619]">
           Three steps from field to table
          </h2>
          <p className="text-lg md:text-xl font-sans text-[#1A3619] max-w-3xl mx-auto">
            A simple chain that respects every link — the people who grow, the people who buy, and the people who move it.
          </p>
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