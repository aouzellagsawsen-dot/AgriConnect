import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe2, Leaf, Recycle, XCircle, CheckCircle2, Users, ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#FAF9F4] min-h-screen overflow-hidden font-sans">
      
      {/* === 1. HERO SECTION (Image spectaculaire au début) === */}
      <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-32 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="relative z-20 mb-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#1A3619]/60 hover:text-[#D96B40] transition-colors duration-300 font-semibold"
          >
            <ArrowLeft size={20} />
            Back Home
          </Link>
        </div>
        
        {/* Taches de couleur intenses en arrière-plan */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-[#1A3619]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-[30rem] h-[30rem] bg-[#D96B40]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center relative z-10">
          
          {/* Colonne Gauche : Texte */}
          <div className="max-w-2xl">
           
            <motion.span
              className="inline-block text-xs font-bold tracking-widest uppercase text-[#D96B40] mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Story
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#1A3619] leading-[1.05] tracking-tight mb-6"
            >
              Rooted in Africa. <br />
              <span className="italic text-[#D96B40] font-light">Built for tomorrow.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-[#1A3619]/70 leading-relaxed mb-8 max-w-lg font-light"
            >
              We are on a mission to reshape the agricultural supply chain by making it fairer, faster, and radically transparent for everyone involved.
            </motion.p>
          </div>

          {/* Colonne Droite : Belle Image Colorée */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative lg:ml-auto w-full mx-auto"
          >
            {/* Décoration asymétrique de l'image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1A3619] to-[#D96B40] rounded-[3rem] opacity-30 blur-lg rotate-3" />
            
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80&fit=crop" 
              alt="Harvest in North Africa" 
              className="relative z-10 rounded-[2.5rem] w-full h-[450px] lg:h-[550px] object-cover shadow-2xl border-4 border-white"
            />

            {/* Badge flottant avec des couleurs vives */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-8 -left-8 z-20 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-[#1A3619]/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D96B40] to-[#f0855b] flex items-center justify-center text-white shadow-lg">
                <Users size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-[#1A3619] tracking-tight">10,000+</p>
                <p className="text-xs text-[#D96B40] font-bold uppercase tracking-wider">Farmers Joined</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* === 2. THE SHIFT (Maintenant avec des images de fond) === */}
      <ShiftSection />

      {/* === 3. OUR VALUES (Maintenant très coloré) === */}
      <ValuesSection />

      {/* === 4. CALL TO ACTION === */}
      <CTASection />

    </div>
  );
}


function ShiftSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-10 max-w-7xl mx-auto" ref={ref}>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A3619] mb-4">
          Bridging the Gap
        </h2>
        <p className="text-[#1A3619]/70 text-lg">
          For too long, agriculture has been slowed down by unnecessary middlemen. We built AgriConnect to change the system.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {/* L'ancienne méthode avec image de fond sombre/grise */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative p-10 lg:p-12 rounded-[3rem] overflow-hidden group border border-gray-200"
        >
          {/* Image de fond désaturée */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-20 transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=800&q=80&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gray-50/90 backdrop-blur-[2px]" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 mb-8 shadow-sm">
              <XCircle size={28} />
            </div>
            <h3 className="text-2xl lg:text-3xl font-serif font-bold text-gray-600 mb-6">The Old Way</h3>
            <ul className="space-y-5">
              {['Multiple expensive middlemen', 'Shrinking profit margins for farmers', 'Untraceable produce origin', 'Empty return trips for trucks'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-600 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* La méthode AgriConnect avec image de fond lumineuse */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative p-10 lg:p-12 rounded-[3rem] overflow-hidden group shadow-2xl"
        >
          {/* Image de fond vibrante */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A3619]/95 to-[#2c582a]/90 backdrop-blur-sm" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#D96B40] flex items-center justify-center text-white mb-8 shadow-lg shadow-[#D96B40]/40">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-6">The AgriConnect Way</h3>
            <ul className="space-y-5">
              {['Direct farm-to-warehouse trade', '100% profit retention for farmers', 'Complete transparency & traceability', 'Optimized logistics & fleet scaling'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-white/90 font-medium text-lg">
                  <span className="w-2 h-2 rounded-full bg-[#D96B40] shrink-0 shadow-[0_0_10px_#D96B40]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  // Chaque valeur a maintenant une couleur de fond vibrante !
  const values = [
    {
      icon: ShieldCheck,
      title: "Fair Trade",
      description: "We believe the people doing the hard work should reap the rewards. Zero hidden fees.",
      gradient: "from-[#D96B40] to-[#e68a65]", // Terracotta Vibrant
      shadow: "shadow-[#D96B40]/20"
    },
    {
      icon: Globe2,
      title: "Transparency",
      description: "Direct communication between all parties. You always know exactly who you deal with.",
      gradient: "from-[#0284c7] to-[#38bdf8]", // Bleu Océan
      shadow: "shadow-[#0284c7]/20"
    },
    {
      icon: Leaf,
      title: "Empowerment",
      description: "Proudly built in North Africa, for local markets, understanding regional challenges.",
      gradient: "from-[#4d7c0f] to-[#84cc16]", // Vert Nature
      shadow: "shadow-[#4d7c0f]/20"
    },
    {
      icon: Recycle,
      title: "Sustainability",
      description: "By optimizing transport routes, we reduce carbon footprints and minimize food waste.",
      gradient: "from-[#d97706] to-[#fbbf24]", // Jaune Soleil
      shadow: "shadow-[#d97706]/20"
    }
  ];

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-10 max-w-7xl mx-auto relative" ref={ref}>
      <h2 className="text-4xl font-serif font-bold text-[#1A3619] mb-12 text-center">
        Our Core Values
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, i) => {
          const Icon = val.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-gradient-to-br ${val.gradient} p-8 rounded-[2.5rem] shadow-xl ${val.shadow} hover:-translate-y-3 transition-transform duration-300 text-white flex flex-col items-start`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/30 shadow-inner">
                <Icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">{val.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed font-medium">
                {val.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-16 lg:py-32 px-6 lg:px-10 max-w-5xl mx-auto" ref={ref}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-[#1A3619] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#D96B40] rounded-full mix-blend-screen filter blur-[80px] opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#84cc16] rounded-full mix-blend-screen filter blur-[80px] opacity-30" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#FAF9F4] mb-6 leading-tight">
            Ready to transform <br className="hidden md:block" /> the way you trade?
          </h2>
          <p className="text-[#FAF9F4]/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light">
            Join the fastest-growing agricultural network in North Africa today. Whether you grow, buy, or transport.
          </p>
          
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#D96B40] hover:bg-[#c05a33] text-white text-lg font-bold rounded-full shadow-[0_10px_40px_rgba(217,107,64,0.4)] transition-all transform hover:-translate-y-1 duration-300"
          >
            Create Your Account
            <ArrowRight size={24} strokeWidth={2.5} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}