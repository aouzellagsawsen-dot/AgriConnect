import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Truck, MapPin, Wallet, 
  CheckCircle2, Clock, Navigation, Loader2, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function TransporterDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({ totalEarnings: "0", completed: 0, pending: 0 });
  const [earningsChartData, setEarningsChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [transporterName, setTransporterName] = useState("");

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const fetchUserName = async () => {
    try {
      const response = await axios.get('https://agri-connect-01-delta.vercel.app/api/auth/check-auth', {
        withCredentials: true
      });
      if (response.data.success && response.data.user) {
        setTransporterName(response.data.user.name);
      }
    } catch (err) {
      console.error("Impossible de récupérer le nom du transporteur:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get('https://agri-connect-01-delta.vercel.app/api/orders/my-deliveries', {
        withCredentials: true
      });

      if (response.data.success) {
        const allOrders = response.data.orders || [];
        setDeliveries(allOrders);

        const active = allOrders.filter(order => order.status === 'In Transit');
        setActiveDeliveries(active);

        const completedOrders = allOrders.filter(order => order.status === 'Delivered');
        const totalSum = completedOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);

        setStats({
          totalEarnings: totalSum.toLocaleString(),
          completed: completedOrders.length,
          pending: active.length
        });

        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const chartDataMap = daysOfWeek.map(day => ({ name: day, amount: 0 }));

        completedOrders.forEach(order => {
          const orderDate = new Date(order.updatedAt || order.createdAt);
          const dayName = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
          const dayIndex = daysOfWeek.indexOf(dayName);
          
          if (dayIndex !== -1) {
            chartDataMap[dayIndex].amount += (order.deliveryFee || 0);
          }
        });

        setEarningsChartData(chartDataMap);
      }
    } catch (err) {
      console.error("Erreur dashboard transporteur :", err);
      setError("Impossible to load your delivery statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchDashboardData();
  }, []);

  const handleCompleteDelivery = async (deliveryId) => {
    if (!window.confirm("Confirmez-vous que la marchandise a bien été livrée à l'acheteur ?")) return;
    
    try {
      const response = await axios.put(`https://agri-connect-01-delta.vercel.app/api/orders/${deliveryId}/status`, 
        { status: 'Delivered' },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Félicitations ! Livraison validée et enregistrée.");
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Erreur lors de la complétion de livraison :", err);
      alert("Une erreur est survenue lors de la validation. Veuillez réessayer.");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
      <p className="text-[#1A3619]/60 font-medium">Loading data...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center p-6">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center max-w-md shadow-sm">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
        <h2 className="font-bold text-lg mb-2">Error</h2>
        <p className="text-sm mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          
          <motion.div variants={item} className="border-b border-[#1A3619]/10 pb-6 mb-8">
  <h1 className="text-3xl lg:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
    <span className="block font-medium text-[#1A3619]/80">Welcome to the road,</span>
    <span className="block font-bold text-[#D96B40]">{transporterName || "Driver"}! </span>
  </h1>
  <p className="text-[#1A3619]/60 mt-3 font-medium text-sm">
    Ready for your next trip? Track your active deliveries, explore optimal routes, and watch your earnings grow.
  </p>
</motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#4A783A] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-white">
              <div className="flex justify-between items-start">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-serif font-medium mb-1">
                  {stats.totalEarnings} DZD
                </h3>
                <p className="text-white/90 text-sm">Total Earnings</p>
              </div>
            </div>

            <div className="bg-[#D96B40] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-white">
              <div className="flex justify-between items-start">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-serif font-medium mb-1">
                  {stats.completed}
                </h3>
                <p className="text-white/90 text-sm">Completed Trips</p>
              </div>
            </div>

            <div className="bg-[#F4A261] p-6 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[150px] text-[#1A3619]">
              <div className="flex justify-between items-start">
                <Clock className="w-6 h-6 text-[#1A3619]" />
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-serif font-medium mb-1">
                  {stats.pending}
                </h3>
                <p className="text-[#1A3619]/90 text-sm">Active Deliveries</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#F6F1E7] p-6 md:p-8 rounded-[2rem] border border-[#1A3619]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm italic font-medium text-[#D96B40] mb-1">Logistics analytics</p>
                  <h2 className="text-2xl font-serif font-bold text-[#1A3619]">Weekly Income Analytics</h2>
                </div>
                <span className="text-xs font-bold text-[#D96B40] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Live
                </span>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A3619" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#1A3619" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#1A3619" opacity={0.4} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#1A3619" opacity={0.4} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      formatter={(value) => [`${value} DZD`, 'Earnings']} 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#1A3619" strokeWidth={4} fillOpacity={1} fill="url(#colorEarning)" activeDot={{ r: 6, fill: '#D96B40', strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#1A3619] mb-4">Active Shipments in Progress</h2>
            {activeDeliveries.length === 0 ? (
              <div className="bg-[#F6F1E7]  border border-[#1A3619]/10 rounded-[2rem] p-10 text-center">
                <Truck className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-4" />
                <p className="text-[#1A3619]/60 font-medium">No active deliveries. Go to "Available Shipments" to take new orders!</p>
              </div>
            ) : (
              activeDeliveries.map((delivery) => (
                <div 
                  key={delivery._id}
                  className="bg-[#F6F1E7]  p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-md text-gray-600">
                        {delivery.orderNumber}
                      </span>
                      <span className="text-xs text-[#D96B40] font-bold flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5" /> {delivery.distanceKm ? `${delivery.distanceKm} km` : "N/A"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#1A3619]">{delivery.productName} ({delivery.quantity})</h3>
                      <p className="text-xs text-[#1A3619]/60">Farmer: {delivery.farmerId?.name || "Unknown Farmer"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#1A3619] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
                          <p className="text-xs font-medium text-[#1A3619]">{delivery.farmerId?.region || "Farm location"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#D96B40] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Location</p>
                          <p className="text-xs font-medium text-[#1A3619]">{delivery.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end md:w-56 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                    <div className="text-right w-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Your Delivery Payout</span>
                      <p className="text-2xl font-serif font-bold text-[#1A3619]">
                        {delivery.deliveryFee ? `${delivery.deliveryFee.toLocaleString()} DZD` : "Free"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCompleteDelivery(delivery._id)}
                      className="w-full mt-4 md:mt-0 py-3 px-4 bg-[#1A3619] hover:bg-[#3d5a2a] text-white font-bold rounded-2xl shadow-lg shadow-[#1A3619]/10 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Validate Delivery
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}