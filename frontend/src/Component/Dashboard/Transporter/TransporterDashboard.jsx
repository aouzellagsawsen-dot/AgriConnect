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

  // Fonction centrale pour charger les données réelles
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 👉 MODIFICATION : On utilise 'withCredentials: true' pour transmettre automatiquement le Cookie de connexion
      const response = await axios.get('http://localhost:3000/api/orders/my-deliveries', {
        withCredentials: true
      });

      if (response.data.success) {
        const allOrders = response.data.orders || [];
        setDeliveries(allOrders);

        // 1. Filtrer les livraisons actives (statut "In Transit")
        const active = allOrders.filter(order => order.status === 'In Transit');
        setActiveDeliveries(active);

        // 2. Calculer les statistiques globales
        const completedOrders = allOrders.filter(order => order.status === 'Delivered');
        const totalSum = completedOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);

        setStats({
          totalEarnings: totalSum.toLocaleString(),
          completed: completedOrders.length,
          pending: active.length
        });

        // 3. Générer les données réelles pour le graphique
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
      setError("Impossible de charger vos statistiques de livraison.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Validation d'une livraison (passage au statut 'Delivered')
  const handleCompleteDelivery = async (deliveryId) => {
    if (!window.confirm("Confirmez-vous que la marchandise a bien été livrée à l'acheteur ?")) return;
    
    try {
      // 👉 CORRECTIONS : Port 3000 + transmission sécurisée des Cookies avec withCredentials
      const response = await axios.put(`http://localhost:3000/api/orders/${deliveryId}/status`, 
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
        <p className="text-[#1A3619]/60 font-medium">Loading your real-time data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-[#1A3619] font-bold text-lg mb-2">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-[#1A3619] text-white font-bold rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">
            Transporter Dashboard
          </h1>
          <p className="text-[#1A3619]/60 mt-1">Manage your routes, tracking, and logistics earnings.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1A3619]/50 uppercase tracking-wider">Total Earnings</span>
              <h3 className="text-2xl font-bold text-[#1A3619]">{stats.totalEarnings} DZD</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#1A3619]/5 text-[#1A3619] flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1A3619]/50 uppercase tracking-wider">Completed Trips</span>
              <h3 className="text-2xl font-bold text-[#1A3619]">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#1A3619]/50 uppercase tracking-wider">Active Deliveries</span>
              <h3 className="text-2xl font-bold text-[#1A3619]">{stats.pending}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* CHART & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A3619]">Weekly Income Analytics</h2>
              <span className="text-xs font-bold text-[#D96B40] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Real-time database tracking
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChartData}>
                  <defs>
                    <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3619" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A3619" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#1A3619" opacity={0.4} fontSize={12} tickLine={false} />
                  <YAxis stroke="#1A3619" opacity={0.4} fontSize={12} tickLine={false} />
                  <Tooltip formatter={(value) => [`${value} DZD`, 'Earnings']} />
                  <Area type="monotone" dataKey="amount" stroke="#1A3619" strokeWidth={2} fillOpacity={1} fill="url(#colorEarning)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ACTIVE DELIVERIES LIST */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-[#1A3619]">Active Shipments in Progress</h2>
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#1A3619]/10">
              <Truck className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-3" />
              <p className="text-[#1A3619]/60 font-medium">No active deliveries. Go to "Available Shipments" to take new orders!</p>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <motion.div 
                key={delivery._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Details */}
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

                  {/* Route Traveled */}
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

                {/* Pricing and Action Button */}
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
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}