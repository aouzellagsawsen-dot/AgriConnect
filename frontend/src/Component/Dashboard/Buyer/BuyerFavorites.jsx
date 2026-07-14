import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Store, MapPin, Phone, Mail, Heart, Loader2, 
  Smile, ShoppingBag, X, Calendar, Tag 
} from 'lucide-react';

export default function BuyerFavorites() {
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Stores all products for filtering[cite: 31]
  
  // States for the farmer's products modal[cite: 31]
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);

  // States to place an order from the modal[cite: 31]
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch favorites and all products on load[cite: 31]
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch favorite farmers[cite: 31]
        const favRes = await axios.get('http://localhost:3000/api/buyers/favorites', { withCredentials: true });
        if (favRes.data.success) {
          setFavorites(favRes.data.favorites);
        }

        // 2. Fetch all products to filter by farmer[cite: 31]
        const prodRes = await axios.get('http://localhost:3000/api/products/all', { withCredentials: true });
        if (prodRes.data.success) {
          setAllProducts(prodRes.data.products);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Remove from favorites[cite: 31]
  const removeFavorite = async (farmerId) => {
    try {
      const res = await axios.post('http://localhost:3000/api/buyers/favorites/toggle', { farmerId }, { withCredentials: true });
      if (res.data.success && !res.data.isFavorited) {
        setFavorites(prev => prev.filter(farmer => farmer._id !== farmerId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Filter products belonging only to the selected farmer[cite: 31]
  const farmerProducts = selectedFarmer 
    ? allProducts.filter(prod => prod.farmerId?._id === selectedFarmer._id)
    : [];

  // Open products modal[cite: 31]
  const handleViewProducts = (farmer) => {
    setSelectedFarmer(farmer);
    setIsProductsModalOpen(true);
  };

  // Open order modal for a specific product[cite: 31]
  const handleOpenOrder = (product) => {
    setSelectedProduct(product);
    setOrderQty(1);
    setIsOrderModalOpen(true);
  };

  // Submit order[cite: 31]
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || orderQty <= 0) return;

    setIsSubmitting(true);
    const totalAmount = parseFloat(selectedProduct.price) * orderQty;

    try {
      const response = await axios.post('http://localhost:3000/api/orders/place-order', {
        farmerId: selectedFarmer._id,
        productName: `${selectedProduct.name} (${orderQty}kg)`,
        totalAmount: totalAmount,
        formattedTotal: `${totalAmount} DZD`
      }, { withCredentials: true });

      if (response.data.success) {
        alert("Order placed successfully!");
        setIsOrderModalOpen(false);
      }
    } catch (error) {
      alert("Error placing order.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#1A3619] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">Favorite Farmers</h1>
            <p className="mt-2 text-[#1A3619]/60 font-medium">Your curated list of trusted local suppliers.</p>
          </div>

          {favorites.length === 0 ? (
            <motion.div variants={item} className="bg-white rounded-[2rem] p-12 text-center border border-[#1A3619]/10 max-w-lg mx-auto mt-10">
              <Smile className="w-16 h-16 text-[#D96B40] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A3619] font-serif">No favorites yet</h3>
              <p className="text-[#1A3619]/60 mt-2">
                Explore the marketplace and click the heart icon on any product card to save your favorite farmers here!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {favorites.map((farmer) => (
                  <motion.div 
                    layout
                    variants={item} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={farmer._id} 
                    className="bg-white rounded-[2rem] border border-[#1A3619]/10 p-6 hover:shadow-lg transition-all group relative flex flex-col justify-between"
                  >
                    {/* Remove from favorites */}
                    <button 
                      onClick={() => removeFavorite(farmer._id)}
                      className="absolute top-6 right-6 p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-[#D96B40] transition-colors"
                      title="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-[#D96B40]" />
                    </button>

                    <div>
                      {/* Logo / Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-[#1A3619]/5 flex items-center justify-center mb-5">
                        <Store className="w-7 h-7 text-[#D96B40]" />
                      </div>

                      {/* Info */}
                      <h3 className="font-serif text-2xl font-bold text-[#1A3619] mb-1">{farmer.name}</h3>
                      <p className="text-sm font-semibold text-[#D96B40] flex items-center gap-1.5 mb-6">
                        <MapPin className="w-4 h-4" /> {farmer.region || "No Region Specified"}
                      </p>

                      {/* Contact Details */}
                      <div className="space-y-3 pt-4 border-t border-[#1A3619]/5">
                        <div className="flex items-center gap-3 text-[#1A3619]/70 text-sm">
                          <Phone className="w-4 h-4 text-[#1A3619]/40" />
                          <span className="font-medium">{farmer.phone || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#1A3619]/70 text-sm break-all">
                          <Mail className="w-4 h-4 text-[#1A3619]/40" />
                          <span>{farmer.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Full width Button */}
                    <div className="mt-8">
                      <button 
                        onClick={() => handleViewProducts(farmer)}
                        className="w-full py-3 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-xl text-sm transition-all flex justify-center items-center gap-2"
                      >
                        View Products
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      {/* ========================================== */}
      {/* MODAL 1: FARMER'S PRODUCTS LIST */}
      {/* ========================================== */}
      <AnimatePresence>
        {isProductsModalOpen && selectedFarmer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsProductsModalOpen(false)} 
              className="fixed inset-0 bg-[#1A3619]/40 backdrop-blur-sm z-40" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:max-w-3xl bg-white rounded-t-[2rem] lg:rounded-[2rem] shadow-2xl z-50 overflow-hidden border border-[#1A3619]/10 max-h-[85vh] flex flex-col"
            >
              <div className="p-6 border-b border-[#1A3619]/10 flex justify-between items-center bg-[#FAF9F4]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D96B40]">Favorite Farmer</span>
                  <h2 className="text-2xl font-serif font-bold text-[#1A3619]">{selectedFarmer.name}</h2>
                </div>
                <button onClick={() => setIsProductsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {farmerProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-[#1A3619]/60 font-medium">This farmer has no products for sale at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {farmerProducts.map((product) => (
                      <div key={product._id} className="border border-[#1A3619]/10 rounded-2xl overflow-hidden flex flex-col bg-[#FAF9F4]/50">
                        <div className="h-32 bg-gray-100 relative">
                          <img 
                            src={product.image && product.image !== "default-image-url.jpg" ? product.image : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea"} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">{product.category}</span>
                            <h4 className="font-bold text-[#1A3619] mt-1 text-lg">{product.name}</h4>
                            <p className="text-[#D96B40] font-bold text-md mt-1">{product.price} DZD/kg</p>
                          </div>
                          <button 
                            onClick={() => handleOpenOrder(product)}
                            className="mt-4 w-full py-2 bg-[#1A3619] hover:bg-[#2a5227] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" /> Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 2: ORDER CONFIRMATION */}
      {/* ========================================== */}
      <AnimatePresence>
        {isOrderModalOpen && selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsOrderModalOpen(false)} 
              className="fixed inset-0 bg-[#1A3619]/50 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden border border-[#1A3619]/10"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold font-serif text-[#1A3619]">Place Order</h3>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  <div className="bg-[#FAF9F4] p-4 rounded-xl border border-[#1A3619]/5">
                    <p className="font-bold text-[#1A3619] text-base">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-500">{selectedProduct.price} DZD / kg</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Quantity (kg)</label>
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      value={orderQty} 
                      onChange={(e) => setOrderQty(e.target.value)} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-base font-bold text-[#1A3619]" 
                    />
                  </div>

                  <div className="p-4 bg-[#1A3619] rounded-xl text-white flex justify-between items-center">
                    <span className="text-sm font-medium">Total Price:</span>
                    <span className="text-lg font-bold">{parseFloat(selectedProduct.price) * orderQty} DZD</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-[#D96B40] text-white font-semibold rounded-xl text-sm">
                      {isSubmitting ? 'Sending...' : 'Confirm'}
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