import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Settings, 
  Headphones, 
  LogOut, 
  Menu, 
  X, 
  Sprout 
} from 'lucide-react';
import axios from 'axios';

// 1. BUYER MENU GROUPS AND PATHS
const menuGroups = [
  {
    title: "Market & Shopping",
    items: [
      { id: 'home', label: 'Dashboard', icon: LayoutDashboard, path: '/Bdash' },
      { id: 'market', label: 'Local Market', icon: Store, path: '/buyer/market' },
      { id: 'orders', label: 'My Orders', icon: ShoppingBag, path: '/buyer/orders' },
      { id: 'favorites', label: 'Favorite Farmers', icon: Heart, path: '/buyer/favorites' },
    ]
  },
  {
    title: "Account & Tools",
    items: [
      { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '2', path: '/buyer/messages' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/buyer/settings' },
      { id: 'support', label: 'Support / Help', icon: Headphones, path: '/buyer/support' },
    ]
  }
];

export default function BuyerSidebar() {
  const [activeItem, setActiveItem] = useState('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Router navigation hook
  const navigate = useNavigate();

  // Navigation content (reused for both Desktop and Mobile)
  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#FAF9F4] border-r border-[#1A3619]/10">
      
      {/* --- LOGO AREA --- */}
      <div className="p-6 md:p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3619] to-[#3d5a2a] flex items-center justify-center shadow-lg shadow-[#1A3619]/20">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <span className="font-serif text-2xl font-bold text-[#1A3619] tracking-tight">
          Agri<span className="text-[#D96B40] italic">Connect</span>
        </span>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-8 scrollbar-hide">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-[#D96B40] mb-3 ml-2">
              {group.title}
            </span>
            <nav className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = activeItem === item.id;
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveItem(item.id);     
                      setIsMobileOpen(false);     
                      navigate(item.path);        
                    }}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#1A3619] text-white shadow-lg shadow-[#1A3619]/20' 
                        : 'text-[#1A3619]/70 hover:bg-[#1A3619]/5 hover:text-[#1A3619]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#D96B40]' : 'text-current'}`} />
                      <span className="font-medium text-sm md:text-base">{item.label}</span>
                    </div>
                    
                    {/* Notification Badge */}
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive ? 'bg-[#D96B40] text-white' : 'bg-[#D96B40]/10 text-[#D96B40]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* --- USER PROFILE & LOGOUT --- */}
      <div className="p-4 md:p-6 border-t border-[#1A3619]/10">
  <button onClick={handleLogout} 
    className="w-full flex items-center gap-3 p-3 rounded-2xl text-[#1A3619]/70 hover:bg-red-50 hover:text-red-600 transition-colors duration-300 group">
    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
    <span className="font-medium">Log Out</span>
  </button>
</div>
    </div>
  );

  const handleLogout = async () => {
  try {
    // Appelle la route backend de déconnexion (ajuste l'URL si besoin)
    const response = await axios.post('http://localhost:3000/api/auth/logout', {}, { 
      withCredentials: true // Important pour que le navigateur supprime le cookie
    });

    if (response.data.success) {
        
      window.location.href = '/';
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    // Tu peux quand même rediriger l'utilisateur en cas d'erreur de serveur
    navigate('/');
  }
};

  return (
    <>
      {/* === MOBILE TOGGLE BUTTON === */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#FAF9F4] border-b border-[#1A3619]/10 z-40 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A3619] flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-[#1A3619]">
            Agri<span className="text-[#D96B40] italic">Connect</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-[#1A3619]/5 text-[#1A3619]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* === DESKTOP SIDEBAR === */}
      <div className="hidden lg:block w-[300px] h-screen fixed top-0 left-0 z-30">
        <NavContent />
      </div>

      {/* === MOBILE DRAWER SIDEBAR === */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-[#1A3619]/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 w-[85%] max-w-[320px] h-screen z-50 lg:hidden shadow-2xl shadow-black/30"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-4 p-2 rounded-full bg-white/50 backdrop-blur border border-[#1A3619]/10 text-[#1A3619] hover:bg-white z-50 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
     </>
  );
}