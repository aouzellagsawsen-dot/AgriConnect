import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, AlertCircle, CheckCircle, 
  MapPin, User, Phone, ArrowRight, Package, Truck, CheckCircle2, ChevronUpCircle 
} from 'lucide-react';
import axios from 'axios';

export default function TransOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); 

  const fetchFarmerOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('https://agri-connect-01-delta.vercel.app/api/orders/farmer-orders', {
        withCredentials: true
      });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching farmer orders:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axios.put(`https://agri-connect-01-delta.vercel.app/api/orders/${orderId}/status`, 
        { status: 'Preparing' },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Order accepted! It is now available for transporters.");
        fetchFarmerOrders();
      }
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("An error occurred while preparing the order.");
    }
  };

  useEffect(() => {
    fetchFarmerOrders();
    const interval = setInterval(fetchFarmerOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'New' || order.status === 'Preparing';
    if (activeTab === 'transit') return order.status === 'In Transit';
    if (activeTab === 'delivered') return order.status === 'Delivered';
    return true; 
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">New Order</span>;
      case 'Preparing':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Searching Transporter...</span>;
      case 'In Transit':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">In Transit </span>;
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Delivered and Closed </span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
        <p className="text-[#1A3619]/60 font-medium">Loading your orders database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-[#1A3619]/10 pb-6 mb-6">
  <h1 className="text-3xl font-serif text-[#1A3619] tracking-tight leading-snug">
    <span className="block font-medium text-[#1A3619]/80">Sown with love,</span>
    <span className="block font-bold text-[#D96B40]">your harvest journal! </span>
  </h1>
  <p className="text-[#1A3619]/60 mt-3 text-sm font-medium">
    Follow your fresh produce from the soil directly to your neighbors' tables.
  </p>
</div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 bg-[#1A3619]/5 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'pending', label: `To Prepare/Pending (${orders.filter(o => o.status === 'New' || o.status === 'Preparing').length})` },
            { id: 'transit', label: `In Transit (${orders.filter(o => o.status === 'In Transit').length})` },
            { id: 'delivered', label: `Delivered (${orders.filter(o => o.status === 'Delivered').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeTab === tab.id ? 'bg-[#1A3619] text-white shadow' : 'text-[#1A3619]/60 hover:text-[#1A3619]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#1A3619]/10">
              <Package className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-3" />
              <p className="text-[#1A3619]/60 font-semibold text-lg">No orders in this category</p>
              <p className="text-[#1A3619]/40 text-sm mt-1">When buyers order your crops, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className={`bg-[#F6F1E7] p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm relative overflow-hidden transition-all ${
                      order.status === 'Delivered' ? 'border-emerald-500/30 bg-emerald-50/10' : ''
                    }`}
                  >
                    {order.status === 'Delivered' && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> TRANSACTION CLOSED
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-md text-gray-600">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-gray-400">{order.date}</span>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-[#1A3619]">{order.productName}</h3>
                          <p className="text-sm text-[#1A3619]/60">Quantity: <span className="font-semibold text-[#1A3619]">{order.quantity}</span></p>
                          <p className="text-sm font-bold text-[#D96B40] mt-1">Total Payout: {order.formattedTotal || `${order.totalAmount} DZD`}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#1A3619] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Your Farm (Origin)</p>
                              <p className="text-xs font-medium text-[#1A3619]">Your default regional storage</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#D96B40] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Buyer & Delivery Address (Destination)</p>
                              <p className="text-xs font-bold text-[#1A3619]">{order.buyerName}</p>
                              <p className="text-xs text-[#1A3619]/70">{order.deliveryAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between lg:w-72 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                        
                        <div className="bg-[#FAF9F4] p-4 rounded-2xl border border-[#1A3619]/5 space-y-2">
                          <h4 className="text-xs font-bold text-[#1A3619]/70 uppercase tracking-wider flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#D96B40]" /> Logistic Partner
                          </h4>
                          
                          {order.transporterId && typeof order.transporterId === 'object' && (order.transporterId.name || order.transporterId.firstName) ? (
                            <div className="space-y-1.5">
                              <p className="text-sm font-bold text-[#1A3619] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-gray-400" /> 
                                {order.transporterId.name || `${order.transporterId.firstName || ''} ${order.transporterId.lastName || ''}`.trim()}
                              </p>
                              <p className="text-xs text-[#1A3619]/70 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gray-400" /> 
                                {order.transporterId.phone || "No phone provided"}
                              </p>
                              <div className="text-[10px] bg-[#1A3619]/10 text-[#1A3619] py-0.5 px-2 rounded-md w-fit font-semibold">
                                Transporter is handling
                              </div>
                            </div>
                          ) : order.transporterId ? (
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-[#D96B40]">Carrier assigned (Loading details...)</p>
                              <p className="text-[10px] text-gray-400 font-mono overflow-hidden text-ellipsis">ID: {order.transporterId._id || order.transporterId}</p>
                            </div>
                          ) : (
                            <div className="py-2 text-center">
                              {order.status === 'New' ? (
                                <p className="text-xs italic text-gray-400">Accept order to find a carrier.</p>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-[#D96B40]">Waiting for carrier acceptance...</p>
                                  <p className="text-[10px] text-gray-400">Listed on "Available Offers"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          {order.status === 'New' && (
                            <button
                              onClick={() => handleAcceptOrder(order._id)}
                              className="w-full py-3 px-4 bg-[#D96B40] hover:bg-[#c55d33] text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
                            >
                              Accept & Prepare Shipment <ArrowRight className="w-4 h-4" />
                            </button>
                          )}

                          {order.status === 'In Transit' && (
                            <div className="flex items-center justify-center gap-2 text-[#D96B40] bg-[#D96B40]/10 py-2.5 px-4 rounded-xl font-bold text-sm">
                              <ChevronUpCircle className="w-4 h-4" /> Package is en route
                            </div>
                          )}

                          {order.status === 'Delivered' && (
                            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs font-bold">
                              <CheckCircle className="w-4 h-4" /> Delivered to Client !
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}