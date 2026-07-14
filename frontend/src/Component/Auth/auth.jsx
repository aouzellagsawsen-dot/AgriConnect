import React, { useState } from 'react';
import { Leaf, Sprout, ShoppingBasket, Truck, ArrowLeft, Globe, MapPin, Eye, EyeOff, Phone } from 'lucide-react'; // Ajout de l'icône Phone
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState('farmer');
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); 
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const maghrebRegions = {
    algeria: ["Algiers", "Oran", "Constantine", "Béjaïa", "Sétif", "Batna"],
    morocco: ["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier"],
    tunisia: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte"],
    mauritania: ["Nouakchott", "Nouadhibou", "Rosso"],
    libya: ["Tripoli", "Benghazi", "Misrata"]
  };

  // --- GESTION DU CHAMP TÉLÉPHONE ---
  const handlePhoneChange = (e) => {
    // Supprime tout ce qui n'est pas un chiffre
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    // Limite à 10 chiffres max
    if (onlyNumbers.length <= 10) {
      setPhone(onlyNumbers);
    }
  };

  // --- FONCTION DE CONNEXION / INSCRIPTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const API_URL = "http://localhost:3000/api/auth"; 

    try {
      if (isSignUp) {
        // Validation : Vérifie qu'il y a exactement 10 chiffres
        if (phone.length !== 10) {
          setErrorMessage("Phone number must contain exactly 10 digits.");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/signup`, {
          name,
          email,
          password,
          phone, 
          address,
          role,
          country: selectedCountry,
          region
        }, { withCredentials: true });

        if (response.data.success) {
          navigate('/verify-email'); 
        }
      } else {
        const response = await axios.post(`${API_URL}/login`, { email, password }, {
        withCredentials: true });
        if (response.data.success) {
          const userRole = response.data.user.role;

          // Redirection conditionnelle basée sur le rôle
          if (userRole === 'farmer') {
            navigate('/dash');
          } else if (userRole === 'buyer') {
            navigate('/Bdash');
          } else if (userRole === 'transporter') {
            navigate('/transporter-dashboard');
          } else {
            navigate('/');
          }
      }}
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0E1A0B] bg-gradient-to-br from-[#0E1A0B] via-[#162A12] to-[#1F3319] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* === DÉCORATIONS D'ARRIÈRE-PLAN === */}
      <div className="absolute top-[-20%] left-[-10%] w-[45rem] h-[45rem] bg-[#557A46]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-[#D96B40]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* BOUTON RETOUR VOLANT */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl"
      >
        <ArrowLeft size={14} />
        Back home
      </Link>

      {/* === CARTE PRINCIPALE === */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl bg-[#FCFBF7] rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] border border-white/60 p-6 sm:p-10 relative z-10 overflow-hidden"
      >
        <Leaf className="absolute -right-12 -top-12 text-[#557A46]/5 w-48 h-48 -rotate-45 pointer-events-none" strokeWidth={1} />
        
        {/* EN-TÊTE DU FORMULAIRE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A3619] text-[#FAF9F4]">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#557A46] block">AgriConnect</span>
              <h2 className="text-xl font-serif font-bold text-gray-900">
                {isSignUp ? 'Create your space' : 'Welcome back'}
              </h2>
            </div>
          </div>

          <div className="flex bg-gray-100/80 p-1 rounded-xl sm:w-56">
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                isSignUp ? 'bg-white text-[#D96B40] shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                !isSignUp ? 'bg-white text-[#D96B40] shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* FORMULAIRE COMPACT */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* SÉLECTEUR DE RÔLE */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                I want to register as a
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'farmer', label: 'Farmer', icon: Sprout },
                  { id: 'buyer', label: 'Buyer', icon: ShoppingBasket },
                  { id: 'transporter', label: 'Transporter', icon: Truck }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-200 ${
                        role === item.id 
                          ? 'bg-white border-[#1A3619] text-[#1A3619] font-bold shadow-sm' 
                          : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={14} className={role === item.id ? 'text-[#557A46]' : 'text-gray-400'} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GRILLE DES CHAMPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* NOM COMPLET */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Amine Benali" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                />
              </div>
            )}

            {/* NUMÉRO DE TÉLÉPHONE (Uniquement à l'inscription) */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  Phone Number
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={handlePhoneChange}
                    required={isSignUp}
                    placeholder="0550123456" 
                    className="w-full px-4 pl-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                  />
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className={`space-y-1 ${!isSignUp ? 'sm:col-span-2' : ''}`}>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@domain.com" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
              />
            </div>

            {/* MOT DE PASSE */}
            <div className={`space-y-1 ${!isSignUp ? 'sm:col-span-2' : ''}`}>
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  Password
                </label>
                {!isSignUp && (
                  <Link to="/forgot-password" className="text-[10px] font-bold text-[#D96B40] hover:text-[#c85a30] transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full px-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* PAYS ET RÉGION */}
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Country
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      required
                      className="w-full px-4 pl-9 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all appearance-none text-sm cursor-pointer"
                    >
                      <option value="" disabled>Select country</option>
                      <option value="algeria">Algeria</option>
                      <option value="morocco">Morocco</option>
                      <option value="tunisia">Tunisia</option>
                      <option value="mauritania">Mauritania</option>
                      <option value="libya">Libya</option>
                    </select>
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Region / City
                  </label>
                  <div className="relative">
                    <select 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      disabled={!selectedCountry}
                      className="w-full px-4 pl-9 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all appearance-none text-sm cursor-pointer disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        {selectedCountry ? "Select region" : "Select country"}
                      </option>
                      {selectedCountry && maghrebRegions[selectedCountry].map((city) => (
                        <option key={city} value={city.toLowerCase()}>{city}</option>
                      ))}
                    </select>
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}
            {/* ADRESSE EXACTE (Uniquement à l'inscription) */}
            {isSignUp && (
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  Full Delivery Address
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={isSignUp}
                    placeholder="123 Rue de la Liberté, Bâtiment A, Étage 2..." 
                    className="w-full px-4 pl-9 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 focus:border-[#1A3619] transition-all text-sm placeholder:text-gray-300"
                  />
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* AFFICHAGE DE L'ERREUR */}
          {errorMessage && (
            <div className="text-red-500 text-xs font-semibold text-center bg-red-50 py-2 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* BOUTON DE SOUMISSION */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#D96B40] hover:bg-[#c85a30] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#D96B40]/20 transition-all active:scale-[0.99] text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Get Started Now' : 'Sign In to Account')}
          </button>

        </form>
      </motion.div>
    </div>
  );
}