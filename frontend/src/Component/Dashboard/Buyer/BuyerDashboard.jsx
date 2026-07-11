import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, Search, Store, Loader2, Filter } from 'lucide-react';

export default function BuyerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [marketProducts, setMarketProducts] = useState([]);
  
  // Nouveaux états pour la recherche et le tri
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest"); // "newest", "oldest", "price_asc", "price_desc"

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/products/all', { withCredentials: true });
        if (res.data.success) {
          setMarketProducts(res.data.products);
        }
      } catch (error) {
        console.error("Erreur de récupération des produits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarket();
  }, []);

  const handleOrder = async (product) => {
    const orderQty = 10; 
    const totalAmount = parseInt(product.price) * orderQty;

    try {
      const response = await axios.post('http://localhost:3000/api/orders/place-order', {
        farmerId: product.farmerId?._id,
        productName: `${product.name} (${orderQty}kg)`,
        totalAmount: totalAmount,
        formattedTotal: `${totalAmount} DZD` // À adapter avec ta logique de devise si besoin
      }, { withCredentials: true });

      if (response.data.success) {
        alert("Commande passée avec succès !");
      }
    } catch (error) {
      alert("Erreur lors de la commande.");
      console.error(error);
    }
  };

  // 🔍 LOGIQUE DE FILTRAGE ET DE TRI
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filtrer par recherche (nom ou catégorie)
    let result = marketProducts.filter(prod => 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.category && prod.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 2. Trier selon l'option sélectionnée
    result.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      // Utilisation de 'createdAt' (généré par MongoDB) ou 'date'
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);

      switch (sortOption) {
        case 'price_asc':
          return priceA - priceB; // Prix : Croissant
        case 'price_desc':
          return priceB - priceA; // Prix : Décroissant
        case 'newest':
          return dateB - dateA; // Plus récent
        case 'oldest':
          return dateA - dateB; // Plus ancien
        default:
          return 0;
      }
    });

    return result;
  }, [marketProducts, searchQuery, sortOption]);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (isLoading) return <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center"><Loader2 className="w-12 h-12 text-[#1A3619] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
          
          <motion.div variants={item} className="flex flex-col lg:flex-row justify-between gap-6 items-start lg:items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">Marketplace</h1>
              <p className="mt-2 text-[#1A3619]/60 font-medium">Discover fresh products directly from local farmers.</p>
            </div>
            
            {/* 🎛️ MENU DE RECHERCHE ET TRI */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              {/* Barre de recherche */}
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." 
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm" 
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Menu de tri */}
              <div className="relative w-full sm:w-48">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-[#1A3619]/10 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1A3619]/20 transition-all text-sm text-gray-700 font-medium cursor-pointer"
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

          {/* 📦 Grille des produits filtrés et triés */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-[2rem] p-10 text-center border border-[#1A3619]/10">
                <p className="text-[#1A3619]/60 font-medium text-lg">No products found for your search.</p>
              </div>
            ) : (
              filteredAndSortedProducts.map((prod) => (
                <motion.div variants={item} key={prod._id} className="bg-white rounded-[2rem] border border-[#1A3619]/10 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
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
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl font-bold text-[#1A3619]">{prod.name}</h3>
                      <span className="text-[#D96B40] font-bold bg-[#D96B40]/10 px-3 py-1 rounded-full text-sm">
                        {prod.price} DZD/kg
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#1A3619]/60 mb-6 flex items-center gap-1.5 flex-grow">
                      <Store className="w-4 h-4 text-[#D96B40]"/> 
                      Farmer: <span className="font-medium text-[#1A3619]">{prod.farmerId?.name || "Unknown"}</span>
                    </p>
                    
                    <button 
                      onClick={() => handleOrder(prod)}
                      className="w-full py-3 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 mt-auto">
                      <ShoppingBag className="w-4 h-4" /> Order Now
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}