import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  AlertCircle, Package, Clock, Truck, 
  MapPin, Search, ArrowLeft, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer toutes les commandes du fermier
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/farmer-orders', {
          withCredentials: true
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Erreur de récupération des commandes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Changer le statut d'une commande
  const handleOrderStatus = async (orderId, newStatus) => {
    // Si on accepte la commande, on prévient l'utilisateur que le stock va baisser
    if (newStatus === 'Preparing') {
      const confirm = window.confirm("En acceptant cette commande, la quantité commandée sera automatiquement déduite de votre stock. Continuer ?");
      if (!confirm) return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'New': return <span className="flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D96B40]/10 text-[#D96B40]"><AlertCircle className="w-3.5 h-3.5"/> {status}</span>;
      case 'Preparing': return <span className="flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5"/> {status}</span>;
      case 'In Transit': return <span className="flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><Truck className="w-3.5 h-3.5"/> {status}</span>;
      case 'Delivered': return <span className="flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A3619]/10 text-[#1A3619]"><Package className="w-3.5 h-3.5"/> {status}</span>;
      default: return <span className="flex w-fit items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
        <p className="text-[#1A3619]/60 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">
              Order Management
            </h1>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by buyer or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-[#1A3619]/20 bg-white text-sm focus:outline-none focus:border-[#D96B40] transition-colors w-full md:w-64"
            />
            <Search className="w-4 h-4 text-[#1A3619]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* LISTE DES COMMANDES */}
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#1A3619]/10">
              <Package className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-4" />
              <p className="text-[#1A3619]/60">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[1.5rem] border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row gap-6 justify-between"
              >
                {/* Infos principales */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#1A3619]/50 font-medium">{order.date}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-[#1A3619]">{order.productName}</h3>
                    <p className="text-[#D96B40] font-semibold text-sm">
                      {order.quantity} Kg • {order.formattedTotal}
                    </p>
                  </div>
                </div>

                {/* Infos Acheteur & Adresse */}
                <div className="flex-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm font-bold text-[#1A3619] mb-1">Buyer: {order.buyerName}</p>
                  <div className="flex items-start gap-1.5 text-xs text-[#1A3619]/70">
                    <MapPin className="w-4 h-4 shrink-0 text-[#D96B40] mt-0.5" />
                    <p className="leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Statut & Action */}
                <div className="flex flex-col items-end justify-between gap-4 md:w-48">
                  {getStatusBadge(order.status)}
                  
                  <div className="w-full">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">
                      Update Status
                    </label>
                    <select 
                      value={order.status}
                      onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      className="w-full text-sm font-bold bg-white border border-[#1A3619]/20 text-[#1A3619] rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-[#D96B40] focus:ring-2 focus:ring-[#D96B40]/20 transition-all"
                    >
                      <option value="New">New</option>
                      <option value="Preparing">Preparing (Accept)</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled (Refuse)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}