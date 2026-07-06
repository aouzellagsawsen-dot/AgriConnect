import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Handshake, Truck } from 'lucide-react';

const stepsData = [
  {
    id: 1,
    target: "Step 01",
    title: "Create and List",
    description: "Set up your profile as a farmer, buyer, or transporter and publish your inventory or logistical capacity.",
    icon: UserPlus,
    bgGradient: "bg-gradient-to-br from-[#1A3619] to-[#2c582a]",
    shadow: "hover:shadow-[0_20px_50px_-15px_rgba(26,54,25,0.6)]",
  },
  {
    id: 2,
    target: "Step 02",
    title: "Connect and Match",
    description: "Negotiate terms directly through our transparent communication channels with zero hidden fees.",
    icon: Handshake,
    bgGradient: "bg-gradient-to-br from-[#D96B40] to-[#f0855b]",
    shadow: "hover:shadow-[0_20px_50px_-15px_rgba(217,107,64,0.6)]",
  },
  {
    id: 3,
    target: "Step 03",
    title: "Transport & Deliver",
    description: "Hire a certified transporter on the platform, track your delivery, and complete your secure transaction.",
    icon: Truck,
    bgGradient: "bg-gradient-to-br from-[#3d5a2a] to-[#5a853e]",
    shadow: "hover:shadow-[0_20px_50px_-15px_rgba(61,90,42,0.6)]",
  }
];

export default function How() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="How"
    className="relative py-24 lg:py-32 bg-[#FAF9F4] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10" ref={ref}>
        
        {/* === HEADER === */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <motion.span
            className="inline-block text-xs font-bold tracking-widest uppercase text-[#D96B40] mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            How it Works
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] tracking-tight text-[#1A3619] mb-6">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Three simple steps
            </motion.span>
            <motion.span
              className="block italic text-[#D96B40]"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              from field to table.
            </motion.span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-[#1A3619]/70 text-lg leading-relaxed max-w-xl"
          >
            A seamless chain that respects every link, the people who grow, the people who buy, and the people who move it.
          </motion.p>
        </div>

        {/* === GRILLE DES ÉTAPES === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr relative">
          
          {/* Ligne de connexion pointillée pour lier les étapes (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#1A3619]/20 -translate-y-1/2 z-0" />

          {stepsData.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} inView={inView} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* === COMPOSANT CARTE ÉTAPE === */
function StepCard({ step, index, inView }) {
  const [hover, setHover] = useState(false);
  const Icon = step.icon;

  return (
    <motion.article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative z-10 flex flex-col p-8 sm:p-10 overflow-hidden rounded-[2rem] transition-all duration-500 transform hover:-translate-y-3 ${step.bgGradient} ${step.shadow} h-full`}
    >
      {/* Texture de brillance au survol (Light sweep) */}
      <motion.div
        initial={false}
        animate={{ x: hover ? '100%' : '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0"
      />

      {/* Grand chiffre en filigrane derrière le texte */}
      <div className="absolute -right-2 -bottom-2 text-[12rem] font-serif font-black text-white/[0.07] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700 z-0 leading-none">
        {index + 1}
      </div>

      {/* En-tête : Badge et Icône en effet "Verre dépoli" (Glassmorphism) */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <span 
          className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-sm"
        >
          {step.target}
        </span>
        
        <motion.div 
          animate={{ rotate: hover ? 10 : 0, scale: hover ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
      </div>

      {/* Contenu Textuel en blanc pur */}
      <div className="relative z-10 mt-auto">
        <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-4">
          {step.title}
        </h3>
        <p className="text-white/80 text-base leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.article>
  );
}