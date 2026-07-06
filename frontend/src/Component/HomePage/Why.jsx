import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wallet, PackageSearch, Route, ArrowUpRight } from 'lucide-react';

const cards = [
  {
    icon: Wallet,
    role: 'For Farmers',
    headline: 'Keep 100% of Your Profits',
    body: 'Bypass expensive middlemen and connect directly with verified commercial buyers.',
    features: ['Direct connection', 'No middlemen', 'Verified buyers'],
    accent: '#1A3619',
    accentLight: 'rgba(26,54,25,0.06)',
    shadow: 'rgba(26,54,25,0.25)',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=300&fit=crop&auto=format',
    span: 'lg:col-span-1',
  },
  {
    icon: PackageSearch,
    role: 'For Buyers',
    headline: 'Direct-from-Farm Sourcing',
    body: 'Secure fresh produce, manage traceability, and negotiate competitive wholesale pricing.',
    features: ['Fresh produce', 'Traceability', 'Wholesale pricing'],
    accent: '#D96B40',
    accentLight: 'rgba(217,107,64,0.06)',
    shadow: 'rgba(217,107,64,0.25)',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=200&fit=crop&auto=format',
    span: 'lg:col-span-1',
  },
  {
    icon: Route,
    role: 'For Transporters',
    headline: 'Optimize Your Routes',
    body: 'Find consistent cargo, eliminate empty return trips, and scale your logistics fleet.',
    features: ['Consistent cargo', 'Route optimization', 'Fleet scaling'],
    accent: '#2a5227',
    accentLight: 'rgba(42,82,39,0.06)',
    shadow: 'rgba(42,82,39,0.20)',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&h=200&fit=crop&auto=format',
    span: 'lg:col-span-1',
  },
];

export const Why = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-28 lg:py-36 bg-[#FAF9F4] overflow-hidden" id="why-us">
      {/* Texture de fond subtile */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, #1A3619 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={ref}>
        {/* En-tête */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <motion.span
            className="inline-block text-xs font-bold tracking-widest uppercase text-[#D96B40] mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Why AgriConnect?
          </motion.span>
          <motion.h2
            className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1A3619] leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Built for every link{' '}
            <em className="text-[#D96B40] not-italic">in the chain.</em>
          </motion.h2>
          <motion.p
            className="mt-5 text-[#1A3619]/55 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you grow it, buy it, or move it. AgriConnect gives you the tools to do it better, faster, and more profitably.
          </motion.p>
        </div>

        {/* Grille Bento */}
        <div className="grid lg:grid-cols-3 gap-5 ">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.role}
                className={`${card.span} group relative rounded-3xl overflow-hidden border border-[#1A3619]/8 bg-white cursor-pointer`}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -8,
                  boxShadow: `0 32px 80px ${card.shadow}`,
                  transition: { duration: 0.35, ease: 'easeOut' },
                }}
              >
                {/* Image de la carte */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.role}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to bottom, ${card.accent}60, ${card.accent}d0)` }}
                  />
                  {/* Badge de rôle */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white/90 border border-white/25 backdrop-blur-sm bg-white/10">
                      {card.role}
                    </span>
                  </div>
                  {/* Icône */}
                  <div
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: card.accent }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Contenu textuel */}
                <div className="p-6 lg:p-7">
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-[#1A3619] mb-3 leading-tight">
                    {card.headline}
                  </h3>
                  <p className="text-[#1A3619]/55 text-sm leading-relaxed mb-5">
                    {card.body}
                  </p>

                  {/* Badges de fonctionnalités */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.features.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: card.accentLight, color: card.accent }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};