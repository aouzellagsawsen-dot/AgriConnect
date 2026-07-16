import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  AlertCircle, Package, Clock, Truck, 
  MapPin, Search, Loader2
} from 'lucide-react';

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
      const confirm = window.confirm("By accepting this order, the requested quantity will be automatically deducted from your inventory. Continue?");
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
      alert("Error updating order status.");
    }
  };

  const filteredOrders = orders.filter(order => 
    order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
        <p className="text-[#1A3619]/60 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1A3619]/10 pb-6">
  <div>
    <h1 className="text-3xl md:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
      <span className="block font-medium text-[#1A3619]/80">From soil to table,</span>
      <span className="block font-bold text-[#D96B40]">your order journal! </span>
    </h1>
    <p className="mt-3 text-[#1A3619]/60 font-medium text-sm">
      Follow every fresh basket’s journey from your soil to your neighbors' tables.
    </p>
  </div>
  
  {/* Search Bar */}
  <div className="relative w-full md:w-auto">
    <input 
      type="text" 
      placeholder="Search by buyer or ID..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2.5 rounded-xl border border-[#1A3619]/20 bg-white text-[#1A3619] text-sm focus:outline-none focus:border-[#D96B40] transition-colors w-full md:w-64"
    />
    <Search className="w-4 h-4 text-[#1A3619]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
  </div>
</div>

        {/* ORDERS LIST */}
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-[#F6F1E7]/40 rounded-2xl border border-[#1A3619]/10">
              <Package className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-4" />
              <p className="text-[#1A3619]/60 font-medium">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#F6F1E7]/50 p-6 rounded-[2rem] border border-[#1A3619]/10 shadow-sm flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center"
              >
                {/* Left Column: Order Number, Date & Product */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#1A3619]/5 px-2.5 py-1 rounded-md text-[#1A3619]/70">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#1A3619]/50 font-medium">{order.date}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-[#1A3619]">{order.productName}</h3>
                    <p className="text-[#D96B40] font-semibold text-sm">
                      {order.quantity} Kg · {order.formattedTotal}
                    </p>
                  </div>
                </div>

                {/* Middle Column: Buyer & Address Card with high contrast */}
                <div className="flex-1 w-full bg-white/80 p-4 rounded-2xl border border-[#1A3619]/5">
                  <p className="text-sm font-bold text-[#1A3619] mb-1">Buyer: {order.buyerName}</p>
                  <div className="flex items-start gap-1.5 text-xs text-[#1A3619]/70">
                    <MapPin className="w-4 h-4 shrink-0 text-[#D96B40] mt-0.5" />
                    <p className="leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>

                {/* Right Column: Clickable Horizontal Buttons */}
                <div className="flex flex-col xl:items-end gap-2 w-full xl:w-auto shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A3619]/40 block">
                    Update Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['New', 'Preparing', 'In Transit', 'Delivered'].map(status => {
                      const isActive = order.status === status;
                      
                      let activeStyle = "";
                      if (status === 'New') activeStyle = "bg-[#D96B40] text-white shadow-sm ring-1 ring-[#D96B40]/25";
                      if (status === 'Preparing') activeStyle = "bg-amber-500 text-white shadow-sm ring-1 ring-amber-500/25";
                      if (status === 'In Transit') activeStyle = "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/25";
                      if (status === 'Delivered') activeStyle = "bg-[#345E37] text-white shadow-sm ring-1 ring-[#345E37]/25";

                      return (
                        <button
                          key={status}
                          onClick={() => handleOrderStatus(order._id, status)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-full transition-all duration-200 ${
                            isActive 
                              ? activeStyle 
                              : "bg-white text-[#1A3619]/50 hover:bg-[#1A3619]/5 hover:text-[#1A3619] border border-[#1A3619]/10 shadow-sm"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
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