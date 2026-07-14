import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';
import axios from 'axios';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Appel à la route backend pour récupérer les commandes de l'acheteur
      const res = await axios.get('http://localhost:3000/api/orders/my-orders', { 
        withCredentials: true 
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Impossible de charger vos commandes pour le moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) return;

    try {
      // Appel à la route d'annulation du backend
      const res = await axios.put(`http://localhost:3000/api/orders/${orderId}/cancel`, {}, { 
        withCredentials: true 
      });
      
      if (res.data.success) {
        // Mise à jour de l'état local pour refléter l'annulation immédiatement
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        ));
      }
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      alert(err.response?.data?.message || "Une erreur est survenue lors de l'annulation.");
    }
  };

  // Configuration des animations Framer Motion
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  // Fonction pour styliser dynamiquement le statut
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'New': 
        return { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-4 h-4 mr-1" />, text: 'New (Pending)' };
      case 'Preparing': 
        return { color: 'bg-amber-100 text-amber-700', icon: <Package className="w-4 h-4 mr-1" />, text: 'Preparing' };
      case 'In Transit': 
        return { color: 'bg-indigo-100 text-indigo-700', icon: <Truck className="w-4 h-4 mr-1" />, text: 'In Transit' };
      case 'Delivered': 
        return { color: 'bg-[#1A3619]/10 text-[#1A3619]', icon: <CheckCircle className="w-4 h-4 mr-1" />, text: 'Delivered' };
      case 'Cancelled': 
        return { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4 mr-1" />, text: 'Cancelled' };
      default: 
        return { color: 'bg-gray-100 text-gray-600', icon: <AlertCircle className="w-4 h-4 mr-1" />, text: status };
    }
  };

  // Affichage pendant le chargement
  if (isLoading) return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
      <p className="text-[#1A3619]/60 font-medium">Loading your orders...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      <main className="p-6 lg:p-10 max-w-5xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          
          {/* En-tête de la page */}
          <motion.div variants={item} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#1A3619]/10 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">
                  My Orders
                </h1>
              </div>
             </div>
          </motion.div>

          {/* Gestion des erreurs */}
          {error && (
            <motion.div variants={item} className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}

          {/* Liste des commandes */}
          {orders.length === 0 && !error ? (
            <motion.div variants={item} className="bg-white rounded-[2rem] border border-[#1A3619]/10 shadow-sm p-10 text-center">
              <Package className="w-16 h-16 text-[#1A3619]/20 mx-auto mb-4" />
              <h2 className="text-xl font-serif font-bold text-[#1A3619] mb-2">No orders yet</h2>
              <p className="text-[#1A3619]/60 mb-6">Looks like you haven't made any purchases yet.</p>
              <button 
                onClick={() => navigate('/Mplace')}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#D96B40] hover:bg-[#c25a32] text-white font-semibold rounded-xl shadow-md transition-all"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <motion.div variants={item} className="grid grid-cols-1 gap-4">
              {orders.map((order) => {
                const statusStyle = getStatusDisplay(order.status);
                
                return (
                  <div key={order._id} className="bg-white p-5 md:p-6 rounded-2xl border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md">
                    
                    {/* Détails de la commande */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1A3619]/50 uppercase tracking-wider">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-sm font-medium text-[#1A3619]/60">
                          {order.date}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-[#1A3619] mb-1">{order.productName}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-[#1A3619]/70 font-medium">Farmer:</span>
                          <span className="text-[#D96B40] font-semibold">{order.farmerId?.name || 'Unknown'}</span>
                          {order.farmerId?.region && (
                            <span className="text-[#1A3619]/50 text-xs">({order.farmerId.region})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Statut, Prix et Actions */}
                    <div className="flex flex-col justify-between items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-[#1A3619]/10 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                      
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyle.color}`}>
                        {statusStyle.icon}
                        {statusStyle.text}
                      </div>

                      <div className="text-right">
                        <p className="text-[#1A3619]/50 text-xs font-medium uppercase tracking-wider mb-1">Total</p>
                        <p className="text-2xl font-serif font-bold text-[#1A3619]">{order.formattedTotal}</p>
                      </div>

                      {/* Le bouton d'annulation n'est visible que si la commande est "New" */}
                      {order.status === 'New' && (
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          className="w-full md:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </motion.div>
          )}
          
        </motion.div>
      </main>
    </div>
  );
}