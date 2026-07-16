import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, ShoppingBag, Heart, Package, Loader2, ArrowRight, Store, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ['#1A3619', '#D96B40', '#4A783A', '#F4A261', '#8B4513'];

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // 1. Ajout de l'état d'erreur
  const [buyerName, setBuyerName] = useState(""); // 2. Initialisation à vide

  const [kpiStats, setKpiStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    favoriteFarmers: 0
  });
  
  const [spendingHistory, setSpendingHistory] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async (isInitialLoad = true) => {
      if (isInitialLoad) setIsLoading(true);

      try {
        const timestamp = new Date().getTime();

        // Récupération des favoris
        const favRes = await axios.get(`http://localhost:3000/api/buyers/favorites?t=${timestamp}`, { 
          withCredentials: true 
        });
        const favCount = favRes.data.success ? favRes.data.favorites.length : 0;

        // Récupération des données globales
        const dashRes = await axios.get(`http://localhost:3000/api/buyers/dashboard?t=${timestamp}`, { 
          withCredentials: true 
        });
        
        if (dashRes.data.success) {
          // 3. Déstructuration directe des données (identique au Farmer Dashboard)
          const { 
            buyerName: backendBuyerName, 
            totalSpent, 
            activeOrders, 
            spendingHistory: dbSpendingHistory, 
            categorySpending: dbCategorySpending, 
            recentOrders: dbRecentOrders 
          } = dashRes.data.data;
          
          setBuyerName(backendBuyerName); 
          setKpiStats({
            totalSpent: totalSpent || 0,
            activeOrders: activeOrders || 0,
            favoriteFarmers: favCount
          });
          setSpendingHistory(dbSpendingHistory || []);
          setCategorySpending(dbCategorySpending || []);
          setRecentOrders(dbRecentOrders || []);
        }
      } catch (err) {
        console.error("Dashboard API Error:", err.response ? err.response.data : err.message);
        // 4. Stockage du message d'erreur si le chargement initial échoue
        if (isInitialLoad) setError("Impossible de charger les données.");
      } finally {
        if (isInitialLoad) setIsLoading(false);
      }
    };

    fetchDashboardData(true);
    
    const intervalId = setInterval(() => { fetchDashboardData(false); }, 10000);
    return () => clearInterval(intervalId);
  }, []);
  
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Preparing': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{status}</span>;
      case 'In Transit': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{status}</span>;
      case 'Delivered': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A3619]/10 text-[#1A3619]">{status}</span>;
      case 'Cancelled': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{status}</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  // 5. Loader harmonisé avec celui du Farmer
  if (isLoading) return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
      <p className="text-[#1A3619]/60 font-medium">Loading data...</p>
    </div>
  );

  // 6. Écran d'erreur harmonisé avec celui du Farmer
  if (error) return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center p-6">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center max-w-md shadow-sm">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          
         <motion.div variants={item} className="flex flex-col md:flex-row justify-between gap-4 md:items-end border-b border-[#1A3619]/10 pb-6">
  <div>
    {/* En-tête humanisé et chaleureux */}
    <h1 className="text-3xl md:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
      <span className="block font-medium text-[#1A3619]/80">Good to see you,</span>
      <span className="block font-bold text-[#D96B40]">{buyerName || "friend"}! </span>
    </h1>
    <p className="mt-3 text-[#1A3619]/60 font-medium text-sm">
      Here's a quick look at your fresh choices and your support for local farmers.
    </p>
  </div>
  
  {/* Bouton d'action également adouci */}
  <button 
    onClick={() => navigate('/Mplace')} 
    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-2xl shadow-lg transition-all shrink-0"
  >
    <Store className="w-5 h-5" /> Explore the Market
  </button>
</motion.div>
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1 : Total Spent */}
  <div className="bg-[#4A783A] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-white">
    <div className="flex justify-between items-start">
      <Wallet className="w-6 h-6" />
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-serif font-medium mb-1">
        {kpiStats.totalSpent.toLocaleString()} DZD
      </h3>
      <p className="text-white/90 text-sm">Spent this month</p>
    </div>
  </div>

  {/* Card 2 : Active Orders */}
  <div className="bg-[#D96B40] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-white">
    <div className="flex justify-between items-start">
      <Package className="w-6 h-6" />
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-serif font-medium mb-1">
        {kpiStats.activeOrders}
      </h3>
      <p className="text-white/90 text-sm">Active orders</p>
    </div>
  </div>

  {/* Card 3 : Saved Farmers */}
  <div className="bg-[#F4A261] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-[#1A3619]">
    <div className="flex justify-between items-start">
      <Heart className="w-6 h-6 text-[#1A3619]" />
    </div>
    <div className="mt-4">
      <h3 className="text-2xl font-serif font-medium mb-1">
        {kpiStats.favoriteFarmers}
      </h3>
      <p className="text-[#1A3619]/90 text-sm">Saved farmers</p>
    </div>
  </div>
</motion.div>

          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Graphique principal : Spending Overview */}
  <div className="lg:col-span-2 bg-[#F6F1E7]  p-6 md:p-8 rounded-[2rem] border border-[#1A3619]/15 shadow-sm">
    <div className="mb-6">
      <p className="text-sm italic font-medium text-[#D96B40] mb-1">Expenses during the days</p>
      <h2 className="text-2xl font-serif font-bold text-[#1A3619]">Spending Overview</h2>
    </div>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={spendingHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e4dc" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value) => [`${value} DZD`, 'Spent']}
          />
          <Line type="monotone" dataKey="amount" stroke="#1A3619" strokeWidth={4} dot={{ fill: '#D96B40', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Graphique secondaire : By Category */}
  <div className="bg-[#F6F1E7]  p-6 md:p-8 rounded-[2rem] border border-[#1A3619]/15 shadow-sm flex flex-col">
    <div className="mb-4">
      <p className="text-sm italic font-medium text-[#D96B40] mb-1">Product shares</p>
      <h2 className="text-2xl font-serif font-bold text-[#1A3619]">By Category</h2>
    </div>
    <div className="h-[250px] w-full flex-grow">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categorySpending}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {categorySpending.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
            formatter={(value) => [`${value} DZD`, 'Amount']}
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
</motion.div>
          <motion.div variants={item} className="bg-[#F6F1E7] rounded-[2rem] border border-[#1A3619]/15 shadow-sm p-6 lg:p-8">
  <div className="flex items-center justify-between mb-6">
    <div>
      {/* Petite description en anglais style carnet de bord */}
      <p className="text-sm italic font-medium text-[#D96B40] mb-1">Logbook</p>
      <h2 className="text-2xl font-serif font-bold text-[#1A3619]">Recent Orders</h2>
    </div>
    <button 
      onClick={() => navigate('/Order')} 
      className="text-sm font-semibold text-[#D96B40] hover:text-[#b55834] flex items-center gap-1"
    >
      View All <ArrowRight className="w-4 h-4" />
    </button>
  </div>
  
  <div className="space-y-3">
    {recentOrders.length === 0 ? (
      <p className="text-[#1A3619]/50 text-center py-6">No recent orders found.</p>
    ) : (
      recentOrders.map((order, idx) => (
        <div 
          key={idx} 
          className="bg-[#1A3619]/5 p-4 rounded-2xl flex justify-between items-center hover:bg-[#1A3619]/10 transition-colors"
        >
          {/* Infos à gauche : Producteur, date et ID */}
          <div>
            <p className="font-medium text-[#1A3619] text-base">{order.farmer}</p>
            <p className="text-xs text-[#1A3619]/60 mt-0.5">{order.date} • {order.id}</p>
          </div>
          
          {/* Infos à droite : Prix et Badge de statut */}
          <div className="text-right flex flex-col items-end gap-1.5">
            <p className="font-serif font-bold text-lg text-[#1A3619]">{order.amount}</p>
            {getStatusBadge(order.status)}
          </div>
        </div>
      ))
    )}
  </div>
</motion.div>
        </motion.div>
      </main>
    </div>
  );
}