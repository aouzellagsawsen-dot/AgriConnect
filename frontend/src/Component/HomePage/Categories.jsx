import React from 'react';

import im1 from './images.jpg';
import im2 from './images1.jpg';
import im3 from './images2.jpg';
import im4 from './images3.jpg';

const categoriesData = [
  {
    id: 1,
    title: "Crop Production",
    image: im1,
    items: [
      "Cereals and Grains (Wheat, corn, rice...)",
      "Seasonal Fruits & Vegetables",
      "Oilseeds and Protein Crops",
      "Industrial Crops (Cotton, sugarcane...)"
    ]
  },
  {
    id: 2,
    title: "Livestock and Animal Products",
    image: im2,
    items: [
      "Meat Livestock (Beef, sheep, goats...)",
      "Dairy Products (Raw milk, cheese...)",
      "Poultry and Fresh Eggs",
      "Apiculture and Aquaculture (Honey, fish...)"
    ]
  },
  {
    id: 3,
    title: "Specialty Crops",
    image: im3,
    items: [
      "Viticulture (Table grapes & wine production)",
      "Horticulture (Ornamental plants, cut flowers)",
      "Agroforestry and Timber Management"
    ]
  },
  {
    id: 4,
    title: "Inputs and Equipment",
    image: im4,
    items: [
      "Seeds, Seedlings and Bulbs",
      "Soil Nutrition and Fertilizers",
      "Crop Protection and Biocontrol",
      "Machinery, Irrigation and Bulk Packaging"
    ]
  }
];

export const Categories = () => {
  return (
    <section className="bg-[#FAF9F4] py-24 w-full border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-widest text-[#D96B40] uppercase mb-4 block">
            Our Marketplace
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A3619] mb-4">
            Explore our agricultural sectors
          </h2>
          <p className="text-lg font-sans text-gray-600 max-w-2xl mx-auto">
            A comprehensive wholesale directory tailored to the needs of modern North African supply chains.
          </p>
        </div>

        {/* Categories Grid (Image Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoriesData.map((category) => (
            <div 
              key={category.id}
              className="bg-[#FAF9F4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-gray-100 group"
            >
              {/* Image Container avec zoom au survol */}
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Léger filtre sombre sur l'image pour l'esthétique */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Contenu (Textes et Listes) */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-serif text-[#1A3619] mb-4">
                    {category.title}
                  </h3>
                  
                  <ul className="space-y-2.5">
                    {category.items.map((item, index) => (
                      <li key={index} className="text-gray-600 text-xs leading-relaxed flex items-start">
                        <span className="text-[#D96B40] mr-2 block select-none">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lien du bas (apparaît plus fort au survol) */}
                <div className="mt-8 pt-4 border-t border-gray-200/50 text-[11px] font-medium text-[#1A3619] opacity-60 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                  Browse category →
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};