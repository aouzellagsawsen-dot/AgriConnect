import React, { useState, useEffect } from 'react';
import { Map, MapPin, Navigation, Truck, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function RoutingMap() {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/my-deliveries', {
          withCredentials: true
        });
        if (response.data.success) {
          const inTransit = (response.data.orders || []).filter(o => o.status === 'In Transit');
          setActiveDeliveries(inTransit);
          if (inTransit.length > 0) setSelectedRoute(inTransit[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

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
    <span className="block font-medium text-[#1A3619]/80">Your navigation center,</span>
    <span className="block font-bold text-[#D96B40]">find the best route! </span>
  </h1>
  <p className="text-[#1A3619]/60 mt-3 font-medium text-sm">
    Calculate your routes, view your pickup points, and optimize your travel times.
  </p> 
</div>
        {activeDeliveries.length === 0 ? (
          <div className="text-center py-16 bg-[#F6F1E7]  rounded-3xl border border-[#1A3619]/10">
            <Map className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-3" />
            <p className="text-[#1A3619]/60 font-semibold">No active deliveries in progress</p>
            <p className="text-sm text-[#1A3619]/40 mt-1">Take charge of an order to see the delivery route here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ROUTE SELECTOR */}
            <div className="space-y-4">
              <h3 className="font-bold text-[#1A3619] text-sm uppercase tracking-wider">Shipments in Transit</h3>
              {activeDeliveries.map((delivery) => (
                <button
                  key={delivery._id}
                  onClick={() => setSelectedRoute(delivery)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedRoute?._id === delivery._id 
                      ? 'bg-[#F6F1E7]  border-[#1A3619] shadow' 
                      : 'bg-[#F6F1E7] border-[#1A3619]/10 hover:border-[#1A3619]/30'
                  }`}
                >
                  <p className="font-bold text-sm text-[#1A3619]">{delivery.productName}</p>
                  <div className="flex items-center justify-between text-xs text-[#1A3619]/60 mt-2">
                    <span>{delivery.orderNumber}</span>
                    <span className="font-bold text-[#D96B40]">{delivery.distanceKm || "N/A"} km</span>
                  </div>
                </button>
              ))}
            </div>

            {/* MAPPING SYSTEM */}
            <div className="lg:col-span-2 space-y-6">
              {selectedRoute && (
                <>
                  <div className="bg-[#F6F1E7] p-6 rounded-3xl border border-[#1A3619]/10 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-[#1A3619]/10 pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-[#1A3619]">Detailed Route Sheet</h2>
                        <span className="text-xs text-emerald-600 font-semibold">Active GPS tracking</span>
                      </div>
                      <div className="bg-[#1A3619]/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#1A3619]" />
                        <span className="text-xs font-bold text-[#1A3619]">{selectedRoute.distanceKm || "N/A"} km</span>
                      </div>
                    </div>

                    {/* DELIVERY STEPS */}
                    <div className="relative space-y-8 pl-6 border-l-2 border-dashed border-emerald-600/30">
                      
                      {/* Step 1 : Pickup */}
                      <div className="relative">
                        <div className="absolute -left-9 top-0.5 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-700">Pickup Point (Farm)</h4>
                          <p className="text-xs font-semibold text-[#1A3619] mt-1">Farmer: {selectedRoute.farmerId?.name}</p>
                          <p className="text-xs text-[#1A3619]/60">Location: {selectedRoute.farmerId?.region}</p>
                        </div>
                      </div>

                      {/* Intermediate step : Transit */}
                      <div className="relative py-2">
                        <div className="absolute -left-9 top-2.5 bg-amber-500 text-white rounded-full p-1 shadow-md">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-700">In transit</h4>
                          <p className="text-xs text-[#1A3619]/60">Goods secured in the vehicle.</p>
                        </div>
                      </div>

                      {/* Step 2 : Delivery */}
                      <div className="relative">
                        <div className="absolute -left-9 top-0.5 bg-red-500 text-white rounded-full p-1 shadow-md">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-red-700">Delivery Point (Client)</h4>
                          <p className="text-xs font-semibold text-[#1A3619] mt-1">Exact address: {selectedRoute.deliveryAddress}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  
                </>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}