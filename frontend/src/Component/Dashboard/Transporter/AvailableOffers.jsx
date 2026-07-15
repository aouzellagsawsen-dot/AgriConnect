import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Truck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function AvailableOffers() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/orders/available-offers', {
        withCredentials: true
      });
      if (response.data.success) {
        setOffers(response.data.offers || response.data.jobs || []);
      }
    } catch (err) {
      console.error("Error fetching offers:", err); 
      setError("Unable to load available delivery offers."); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptJob = async (id) => {
    if (!window.confirm("Do you want to accept this delivery?")) return; 

    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${id}/accept-delivery`, {}, {
        withCredentials: true
      });

      if (response.data.success) {
        alert("Congratulations! Delivery accepted. Find it in your 'Active Deliveries' tab."); 
        fetchOffers();
      }
    } catch (err) {
      console.error("Error during acceptance:", err);
      alert("An error occurred or the delivery has already been taken by another driver."); 
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" />
        <p className="text-[#1A3619]/60 font-medium">Searching for real-time freight offers...</p> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[340px] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A3619]">Available Shipments</h1>
          <p className="text-[#1A3619]/60 mt-1">Find ready-to-ship cargo and earn money.</p> 
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {offers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#1A3619]/10">
            <Search className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-3" />
            <p className="text-[#1A3619]/60 font-semibold text-lg">No deliveries currently available</p> 
            <p className="text-[#1A3619]/40 text-sm mt-1">Come back a little later or refresh the page!</p> 
            <button onClick={fetchOffers} className="mt-4 px-5 py-2 bg-[#1A3619] text-white rounded-xl text-sm font-bold">
              Refresh 
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {offers.map((offer) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-md text-gray-600">
                      {offer.orderNumber}
                    </span>
                    <span className="text-xs text-[#D96B40] font-bold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> {offer.distanceKm ? `${offer.distanceKm} km` : "Calculated at departure"} 
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1A3619]">{offer.productName} ({offer.quantity})</h3>
                    <p className="text-xs text-[#1A3619]/60">Farmer: {offer.farmerId?.name || "Anonymous Farmer"}</p> 
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#1A3619] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p> 
                        <p className="text-xs font-medium text-[#1A3619]">{offer.farmerId?.region || "Farm"}</p> 
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D96B40] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Location</p> 
                        <p className="text-xs font-medium text-[#1A3619]">{offer.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end md:w-56 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                  <div className="text-right w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Delivery Fee</span> 
                    <p className="text-2xl font-serif font-bold text-[#1A3619]">
                      {offer.deliveryFee ? `${offer.deliveryFee.toLocaleString()} DZD` : "Calculated at departure"} 
                    </p>
                  </div>

                  <button
                    onClick={() => handleAcceptJob(offer._id)}
                    className="w-full mt-4 md:mt-0 py-3 px-4 bg-[#D96B40] hover:bg-[#c55d33] text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <Truck className="w-4 h-4" /> Accept Freight 
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}