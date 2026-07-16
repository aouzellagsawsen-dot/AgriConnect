import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, Navigation, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MyDeliveries() {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/api/orders/my-deliveries', {
        withCredentials: true
      });
      if (response.data.success) {
        setDeliveries(response.data.orders || []);
      }
    } catch (err) {
      console.error("Error loading deliveries", err); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Do you confirm the delivery of the goods?")) return; 
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${id}/status`, 
        { status: 'Delivered' },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Delivery closed successfully!"); 
        fetchDeliveries();
      }
    } catch (err) {
      alert("An error occurred during validation."); 
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const activeDeliveries = deliveries.filter(d => d.status === 'In Transit');
  const pastDeliveries = deliveries.filter(d => d.status === 'Delivered');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE HUMANISÉ AVEC LIGNE DE SÉPARATION */}
        <div className="border-b border-[#1A3619]/10 pb-6 mb-8">
  <h1 className="text-3xl lg:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
    <span className="block font-medium text-[#1A3619]/80">Your delivery journey,</span>
    <span className="block font-bold text-[#D96B40]">tracked step by step! </span>
  </h1>
  <p className="text-[#1A3619]/60 mt-3 font-medium text-sm">
    Manage your ongoing runs, validate your trips, and review your driving history.
  </p> 
</div>

        {/* TABS BUTTONS */}
        <div className="flex gap-2 bg-[#1A3619]/5 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'active' ? 'bg-[#1A3619] text-white shadow' : 'text-[#1A3619]/60 hover:text-[#1A3619]'
            }`}
          >
            Ongoing ({activeDeliveries.length}) 
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'history' ? 'bg-[#1A3619] text-white shadow' : 'text-[#1A3619]/60 hover:text-[#1A3619]'
            }`}
          >
            History ({pastDeliveries.length}) 
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          {(activeTab === 'active' ? activeDeliveries : pastDeliveries).length === 0 ? (
            <div className="text-center py-12 bg-[#FAF9F4] rounded-3xl border border-[#1A3619]/10">
              <Truck className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-3" />
              <p className="text-[#1A3619]/60 font-medium">No trips to display in this category.</p> 
            </div>
          ) : (
            (activeTab === 'active' ? activeDeliveries : pastDeliveries).map((delivery) => (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#F6F1E7]  p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#1A3619]/5 px-2.5 py-1 rounded-md text-gray-600">
                      {delivery.orderNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      delivery.status === 'In Transit' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A3619]">{delivery.productName} ({delivery.quantity})</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#1A3619]/5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#1A3619] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-[#1A3619]/50 uppercase">PICKUP</p> 
                        <p className="text-xs text-[#1A3619] font-medium">{delivery.farmerId?.region || "Farm"}</p> 
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D96B40] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-[#1A3619]/50 uppercase">DESTINATION</p> 
                        <p className="text-xs text-[#1A3619] font-medium">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end md:w-56 md:border-l border-[#1A3619]/5 md:pl-6">
                  <div className="text-right w-full">
                    <p className="text-[10px] font-bold text-[#1A3619]/50 uppercase">Earnings</p> 
                    <p className="text-xl font-bold text-[#1A3619]">{(delivery.deliveryFee || 0).toLocaleString()} DZD</p>
                  </div>

                  {delivery.status === 'In Transit' && (
                    <button
                      onClick={() => handleComplete(delivery._id)}
                      className="w-full mt-4 py-2.5 bg-[#1A3619] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3d5a2a]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Validate delivery 
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}