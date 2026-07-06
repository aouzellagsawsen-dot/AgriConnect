import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wheat, PawPrint, Grape, Wrench } from 'lucide-react';

const sectorsData = [
  {
    id: 'crops',
    icon: Wheat,
    label: 'Crop Production',
    tagline: 'Cereals, legumes, vegetables & more',
    body: "Algeria's wheat belt, Tunisia's olive groves, Morocco's citrus orchards, list and discover seasonal crop production at scale, with transparent pricing and volume guarantees.",
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&auto=format',
    accent: '#1A3619',
    span: 'md:col-span-2', 
  },
  {
    id: 'livestock',
    icon: PawPrint,
    label: 'Livestock',
    tagline: 'Cattle, sheep, poultry & dairy',
    body: 'Connect with verified livestock producers across the Maghreb. Traceable origin, health certifications, and flexible transport options.',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=400&fit=crop&auto=format',
    accent: '#D96B40',
    span: 'md:col-span-1', 
  },
  {
    id: 'specialty',
    icon: Grape,
    label: 'Specialty Crops',
    tagline: 'Dates, argan, olives, saffron and spices',
    body: 'Premium and export-grade specialties. From Medjool dates to argan oil, reach international buyers and premium domestic clients.',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop',
    accent: '#7c4f1a',
    span: 'md:col-span-1', 
  },
  {
    id: 'inputs',
    icon: Wrench,
    label: 'Inputs and Equipment',
    tagline: 'Seeds, fertilizers, machinery and tools',
    body: 'Source certified seeds, fertilizers, and agricultural equipment from trusted suppliers. Competitive pricing, bulk discounts, and financing options available.',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop',
    accent: '#3d5a2a',
    span: 'md:col-span-2', 
  },
];

function RevealText({ text, inView }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Categories() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section id="sectors" className="bg-[#FAF9F4] py-24 w-full border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        
        {/* === HEADER DESIGN EXEMPLE 1 === */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end mb-16">
          <div className="max-w-2xl">
             <motion.span
            className="inline-block text-xs font-bold tracking-widest uppercase text-[#D96B40] mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Marketplace Sectors
          </motion.span>
            
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-semibold leading-[1.05] tracking-tight text-[#1A3619]">
              <RevealText text="Explore our agricultural sectors." inView={inView} />
            </h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-sm text-[#1A3619]/70 text-lg leading-relaxed"
          >
            From staple grains to premium specialty produce, every segment of North African agriculture is represented on AgriConnect.
          </motion.p>
        </div>

        {/* === GRILLE BENTO EQUILIBRÉE ET ALIGNÉE (HAUTEUR UNIFORME) === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {sectorsData.map((sector, index) => (
            <SectorCard key={sector.id} sector={sector} index={index} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* === COMPOSANT COMPLET CARTE RESTRUCTURÉ === */
function SectorCard({ sector, index, inView }) {
  const [hover, setHover] = useState(false);
  const Icon = sector.icon;

  return (
    <motion.article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-[#1A3619]/10 bg-white transition-all duration-500 hover:border-[#D96B40]/40 hover:shadow-[0_30px_60px_-30px_rgba(217,107,64,0.25)] ${sector.span}`}
    >
      {/* Lueur d'arrière-plan au survol */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ scale: hover ? 1 : 0.7, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 origin-bottom-right z-0"
        style={{
          background: "radial-gradient(circle at bottom right, rgba(217,107,64,0.08), transparent 70%)",
        }}
      />

      {/* Image avec hauteur fixe et uniforme (Exemple 1) */}
      <div className="relative w-full h-52 overflow-hidden shrink-0 z-10">
        <motion.img
          animate={{ scale: hover ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          src={sector.image}
          alt={sector.label}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge Icône sur l'image */}
        <div 
          className="absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-sm"
          style={{ backgroundColor: `${sector.accent}aa` }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

      </div>

      {/* Contenu textuel complet avec gestion propre de la hauteur */}
      <div className="relative flex flex-col flex-grow p-6 sm:p-7 z-10">
        <span className="text-xs font-bold tracking-widest uppercase mb-1.5 block" style={{ color: sector.accent }}>
          {sector.tagline}
        </span>
        
        <h3 className="font-serif font-semibold text-[#1A3619] text-xl sm:text-2xl mb-3">
          {sector.label}
        </h3>

        <p className="text-[#1A3619]/70 text-sm leading-relaxed mb-6">
          {sector.body}
        </p>
      </div>
    </motion.article>
  );
}