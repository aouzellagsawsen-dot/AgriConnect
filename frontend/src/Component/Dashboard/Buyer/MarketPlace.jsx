import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ShoppingBag, Search, Store, Loader2, 
  Filter, X, Calculator, MapPin, Heart, Tag 
} from 'lucide-react'; 

export default function MarketPlace() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketProducts, setMarketProducts] = useState([]);
  const [favoriteFarmerIds, setFavoriteFarmerIds] = useState([]); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest"); 
  const [selectedWilaya, setSelectedWilaya] = useState("All"); 
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMarketAndFavorites = async () => {
      try {
        const productsRes = await axios.get('https://agri-connect-01-delta.vercel.app/api/products/all', { withCredentials: true });
        if (productsRes.data.success) {
          setMarketProducts(productsRes.data.products);
        }

        const favoritesRes = await axios.get('https://agri-connect-01-delta.vercel.app/api/buyers/favorites', { withCredentials: true });
        if (favoritesRes.data.success) {
          setFavoriteFarmerIds(favoritesRes.data.favorites.map(f => f._id));
        }

      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketAndFavorites();
  }, []);

  const toggleFavorite = async (farmerId) => {
    if (!farmerId) return;
    try {
      const res = await axios.post('https://agri-connect-01-delta.vercel.app/api/buyers/favorites/toggle', { farmerId }, { withCredentials: true });
      if (res.data.success) {
        if (res.data.isFavorited) {
          setFavoriteFarmerIds(prev => [...prev, farmerId]); 
        } else {
          setFavoriteFarmerIds(prev => prev.filter(id => id !== farmerId)); 
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  const wilayasList = useMemo(() => {
    const regions = marketProducts
      .map(prod => prod.farmerId?.region)
      .filter(Boolean);
    
    return ["All", ...new Set(regions)];
  }, [marketProducts]);

  const categoriesList = useMemo(() => {
    const categories = marketProducts
      .map(prod => prod.category)
      .filter(Boolean);
    
    return ["All", ...new Set(categories)];
  }, [marketProducts]);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQty(1); 
    setIsOrderModalOpen(true);
  };

  const confirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || orderQty <= 0) return;
    
    setIsSubmitting(true);
    const totalAmount = parseFloat(selectedProduct.price) * orderQty;

    try {
      const response = await axios.post('https://agri-connect-01-delta.vercel.app/api/orders/place-order', {
        farmerId: selectedProduct.farmerId?._id,
        productId: selectedProduct._id,
        quantity: Number(orderQty),
        productName: `${selectedProduct.name} (${orderQty}kg)`,
        category: selectedProduct.category || 'Other',
        totalAmount: totalAmount,
        formattedTotal: `${totalAmount} DZD` ,
        deliveryAddress: "waiting for confirmation"
      }, { withCredentials: true });

      if (response.data.success) {
        alert("Commande passée avec succès ! Le fermier a été notifié.");
        setIsOrderModalOpen(false);
      }
    } catch (error) {
      alert("Erreur lors de la commande.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = marketProducts;

    if (searchQuery) {
      result = result.filter(prod => 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(prod => prod.category === selectedCategory);
    }

    if (selectedWilaya !== "All") {
      result = result.filter(prod => prod.farmerId?.region === selectedWilaya);
    }

    result.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);

      switch (sortOption) {
        case 'price_asc': return priceA - priceB;
        case 'price_desc': return priceB - priceA;
        case 'newest': return dateB - dateA;
        case 'oldest': return dateA - dateB;
        default: return 0;
      }
    });

    return result;
  }, [marketProducts, searchQuery, sortOption, selectedWilaya, selectedCategory]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) return <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center"><Loader2 className="w-12 h-12 text-[#1A3619] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
          <motion.div 
  variants={item} 
  className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-end border-b border-[#1A3619]/10 pb-6"
>
  <div>
    <h1 className="text-3xl md:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
      <span className="block font-medium text-[#1A3619]/80">Seasonal selections,</span>
      <span className="block font-bold text-[#D96B40]">the fresh market! </span>
    </h1>
    <p className="mt-3 text-[#1A3619]/60 font-medium text-sm">
      Brimming with seasonal picks, harvested with care by local hands straight for your kitchen.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-3">
    <div className="relative w-full">
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..." 
        className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm" 
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>

    <div className="relative w-full">
      <select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full pl-11 pr-8 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm text-gray-700 font-medium cursor-pointer"
      >
        {categoriesList.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All Categories" : cat}
          </option>
        ))}
      </select>
      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B40]" />
    </div>

    <div className="relative w-full">
      <select 
        value={selectedWilaya}
        onChange={(e) => setSelectedWilaya(e.target.value)}
        className="w-full pl-11 pr-8 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm text-gray-700 font-medium cursor-pointer"
      >
        {wilayasList.map((wilaya) => (
          <option key={wilaya} value={wilaya}>
            {wilaya === "All" ? "All Regions" : wilaya}
          </option>
        ))}
      </select>
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B40]" />
    </div>

    <div className="relative w-full">
      <select 
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full pl-11 pr-8 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm text-gray-700 font-medium cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B40]" />
    </div>
  </div>
</motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-[2rem] p-10 text-center border border-[#1A3619]/10">
                <p className="text-[#1A3619]/60 font-medium text-lg">No products found matching your selection.</p>
              </div>
            ) : (
              filteredAndSortedProducts.map((prod) => {
                const isFavorited = favoriteFarmerIds.includes(prod.farmerId?._id);

                return (
                  <motion.div variants={item} key={prod._id} className="bg-[#F6F1E7]  rounded-[2rem] border border-[#1A3619]/10 overflow-hidden hover:shadow-lg transition-all group flex flex-col relative">
                    
                    <button 
                      onClick={() => toggleFavorite(prod.farmerId?._id)}
                      className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-md hover:bg-white transition-all text-[#D96B40] group/heart"
                      title={isFavorited ? "Remove farmer from favorites" : "Add farmer to favorites"}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'fill-[#D96B40] scale-110' : 'group-hover/heart:scale-110'}`} 
                      />
                    </button>

                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={prod.image && prod.image !== "default-image-url.jpg" ? prod.image : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea"} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {prod.category && (
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-sm">
                          {prod.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-xl font-bold text-[#1A3619]">{prod.name}</h3>
                        <span className="text-[#D96B40] font-bold bg-[#D96B40]/10 px-3 py-1 rounded-full text-sm shrink-0">
                          {prod.price} DZD/kg
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-6 flex-grow border-t border-[#1A3619]/5 pt-4">
                        <p className="text-sm text-[#1A3619]/60 flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-[#D96B40] shrink-0"/> 
                          <span>Farmer:</span> 
                          <span className="font-semibold text-[#1A3619]">{prod.farmerId?.name || "Unknown"}</span>
                        </p>
                        <p className="text-sm text-[#1A3619]/60 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#D96B40] shrink-0"/> 
                          <span>Region:</span> 
                          <span className="font-semibold text-[#1A3619]">{prod.farmerId?.region || "Not Specified"}</span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => openOrderModal(prod)}
                        className="w-full py-3 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 mt-auto">
                        <ShoppingBag className="w-4 h-4" /> Order Now
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isOrderModalOpen && selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsOrderModalOpen(false)} 
              className="fixed inset-0 bg-[#1A3619]/40 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden border border-[#1A3619]/10"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#1A3619]">Complete Order</h2>
                    <p className="text-[#1A3619]/60 text-sm mt-1">Specify your quantity.</p>
                  </div>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={confirmOrder} className="space-y-6">
                  <div className="bg-[#FAF9F4] p-4 rounded-xl border border-[#1A3619]/5 space-y-1">
                    <p className="font-bold text-[#1A3619] text-lg">{selectedProduct.name}</p>
                    <p className="text-sm text-[#1A3619]/60 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-[#D96B40]" /> {selectedProduct.farmerId?.name || "Unknown Farmer"}
                    </p>
                    <p className="text-sm text-[#1A3619]/60 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D96B40]" /> {selectedProduct.farmerId?.region || "Not Specified"}
                    </p>
                    <p className="text-[#D96B40] font-bold mt-2 pt-1 border-t border-[#1A3619]/5">{selectedProduct.price} DZD / kg</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      Quantity Required (kg)
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      required 
                      value={orderQty} 
                      onChange={(e) => setOrderQty(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-lg font-bold text-[#1A3619] outline-none focus:border-[#D96B40] transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#1A3619] rounded-xl text-white">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#D96B40]" />
                      <span className="font-medium">Total Price:</span>
                    </div>
                    <span className="text-xl font-bold">
                      {parseFloat(selectedProduct.price || 0) * (orderQty || 0)} DZD
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || orderQty <= 0} className="flex-1 py-3 bg-[#D96B40] hover:bg-[#c25a32] text-white font-semibold rounded-xl text-sm transition-colors shadow-md disabled:opacity-70">
                      {isSubmitting ? 'Sending Request...' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}