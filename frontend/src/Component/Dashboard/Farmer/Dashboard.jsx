import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Plus, AlertCircle, ShoppingBag, 
  DollarSign, Package, Calendar, ArrowRight,
  MoreVertical, Clock, Truck, Loader2, X, Edit3
} from 'lucide-react';

export default function Dashboard() {
  // États pour stocker les données dynamiques
  const [farmerName, setFarmerName] = useState(""); 
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState([]);
  const [currency, setCurrency] = useState("DZD");

  // États pour le cycle de vie
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le modal d'ajout de produit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    qty: '',
    price: '',
    date: '',
    image: null
  });

  // États pour la modification de produit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    _id: '',
    name: '',
    category: '',
    qty: '',
    price: '',
    date: ''
  });

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const openEditModal = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      category: product.category,
      qty: product.qty.toString().toLowerCase().replace(/kg/g, '').trim(),
      price: product.price.toString().toLowerCase().replace(new RegExp(currency.toLowerCase(), 'g'), '').trim(),
      date: product.date
    });
    setIsEditModalOpen(true);
  };

  // Fonction pour mettre à jour les cartes KPI avec la bonne devise passée en paramètre
  const updateKpiStats = (currentInventory, backendRevenue, pendingCount, currentCurrency = "DZD") => {
    const totalProductsCount = currentInventory.length;

    setStats([
      { 
        title: "Total Revenue (Delivered)", 
        value: `${backendRevenue} ${currentCurrency}`, 
        rawRevenue: backendRevenue,
        trend: "Updated now", 
        isPositive: true, 
        icon: DollarSign, 
        color: "text-[#1A3619]" 
      },
      { 
        title: "Pending Orders", 
        value: pendingCount.toString(), 
        rawValue: pendingCount,
        trend: "Action required", 
        isPositive: false, 
        icon: ShoppingBag, 
        color: "text-[#D96B40]" 
      },
      { 
        title: "Products in Stock", 
        value: totalProductsCount.toString(),
        trend: "Total Items", 
        isPositive: true, 
        icon: Package, 
        color: "text-[#1A3619]" 
      },
    ]);
  };

  // Envoi de l'ajout
  const handleAddHarvest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('qty', newProduct.qty);
    formData.append('price', newProduct.price);
    formData.append('date', newProduct.date);
    if (newProduct.image) formData.append('image', newProduct.image);

    try {
      const response = await axios.post('http://localhost:3000/api/products', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setIsModalOpen(false);
        setNewProduct({ name: '', category: '', qty: '', price: '', date: '', image: null });
        
        const updatedInventory = [...inventory, response.data.product];
        setInventory(updatedInventory);
        updateKpiStats(updatedInventory, stats[0]?.rawRevenue || 0, stats[1]?.rawValue || 0, currency);
        alert("Produit ajouté avec succès !"); 
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 Mise à jour du statut d'une commande
  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        // Mettre à jour l'état local pour que l'affichage change immédiatement
        setRecentOrders(recentOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors de la mise à jour du statut de la commande.");
    }
  };

  // Envoi des modifications
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(`http://localhost:3000/api/products/${editingProduct._id}`, editingProduct, {
        withCredentials: true
      });

      if (response.data.success) {
        setIsEditModalOpen(false);
        const updatedInventory = inventory.map(prod => prod._id === editingProduct._id ? response.data.product : prod);
        setInventory(updatedInventory);
        updateKpiStats(updatedInventory, stats[0]?.rawRevenue || 0, stats[1]?.rawValue || 0, currency);
        alert("Produit mis à jour avec succès !");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 RÉCUPÉRATION ET DÉTECTION DE LA RÉGION DEPUIS LA BDD (AVEC AUTO-REFRESH)
  useEffect(() => {
    const fetchDashboardData = async (isInitialLoad = false) => {
      if (isInitialLoad) setIsLoading(true); // Écran de chargement seulement au début
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard', {
          withCredentials: true 
        });
        
        if (response.data.success) {
          const { farmerName, country, orders, inventory: dbInventory, stats: dbStats } = response.data.data;
          setFarmerName(farmerName);
          setRecentOrders(orders); // Les nouvelles commandes s'ajouteront ici !
          setInventory(dbInventory);

          let detectedCurrency = "Autre"; 
          const locationToTest = country || "";
          if (locationToTest) {
            const cleanLocation = locationToTest.toLowerCase().trim();
            if (cleanLocation.includes("algeria")) detectedCurrency = "DZD"; 
            else if (cleanLocation.includes("morocco")) detectedCurrency = "MAD"; 
            else if (cleanLocation.includes("tunisia")) detectedCurrency = "TND"; 
            else if (cleanLocation.includes("mauritania")) detectedCurrency = "MRU"; 
            else if (cleanLocation.includes("libya")) detectedCurrency = "LYD"; 
          }
          
          setCurrency(detectedCurrency);
          updateKpiStats(dbInventory, dbStats.revenue, dbStats.pending, detectedCurrency);
        }
      } catch (err) {
        console.error(err);
        if (isInitialLoad) setError("Impossible de charger les données.");
      } finally {
        if (isInitialLoad) setIsLoading(false);
      }
    };

    // 1. Charger immédiatement au montage
    fetchDashboardData(true);

    // 2. Vérifier les nouvelles commandes toutes les 10 secondes (10000 ms)
    const intervalId = setInterval(() => {
      fetchDashboardData(false);
    }, 10000);

    // 3. Nettoyer l'intervalle si l'utilisateur quitte la page
    return () => clearInterval(intervalId);
  }, []);
   
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'New': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D96B40]/10 text-[#D96B40]"><AlertCircle className="w-3.5 h-3.5"/> {status}</span>;
      case 'Preparing': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5"/> {status}</span>;
      case 'In Transit': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><Truck className="w-3.5 h-3.5"/> {status}</span>;
      case 'Delivered': return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A3619]/10 text-[#1A3619]"><Package className="w-3.5 h-3.5"/> {status}</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex flex-col items-center justify-center"><Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" /><p className="text-[#1A3619]/60 font-medium">Loading data...</p></div>;
  if (error) return <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px] flex items-center justify-center p-6"><div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center max-w-md shadow-sm"><AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" /><h2 className="font-bold text-lg mb-2">Error</h2><p className="text-sm">{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
          
          {/* HEADER */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">
                Welcome, <em className="text-[#D96B40] not-italic">{farmerName || "Farmer"}.</em>
              </h1>
              <p className="mt-2 text-[#1A3619]/60 font-medium">Here is what's happening on your farm today.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 duration-300">
             <Plus className="w-5 h-5" /> Add New Harvest
            </button>
          </motion.div>

          {/* KPI CARDS */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-[#1A3619]/10 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 ${stat.color}`}><Icon className="w-6 h-6" /></div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{stat.trend}</span>
                  </div>
                  <h3 className="text-[#1A3619]/60 text-sm font-semibold mb-1">{stat.title}</h3>
                  <p className="text-2xl lg:text-3xl font-serif font-bold text-[#1A3619]">{stat.value}</p>
                </div>
              );
            })}
          </motion.div>

          {/* RECENT ORDERS TABLE */}
          <div className="w-full">
            <motion.div variants={item} className="w-full bg-white rounded-[2rem] border border-[#1A3619]/10 shadow-sm p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-[#1A3619]">Recent Orders</h2>
                <button className="text-sm font-semibold text-[#D96B40] hover:text-[#b55834] flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></button>
              </div>
              <div className="overflow-x-auto">
                {recentOrders.length === 0 ? (
                  <p className="text-[#1A3619]/50 text-center py-6">No recent orders found.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1A3619]/10 text-[#1A3619]/50 text-xs uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Order / Date</th>
                        <th className="pb-3 font-semibold">Buyer</th>
                        <th className="pb-3 font-semibold">Product</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, idx) => (
                        <tr key={idx} className="border-b border-[#1A3619]/5 last:border-0 hover:bg-[#FAF9F4]/50 transition-colors">
                          <td className="py-4"><p className="font-bold text-[#1A3619] text-sm">{order.id}</p><p className="text-xs text-[#1A3619]/50 mt-0.5">{order.date}</p></td>
                          <td className="py-4 text-sm font-medium text-[#1A3619]">{order.buyer}</td>
                          <td className="py-4"><p className="text-sm text-[#1A3619] font-medium">{order.product}</p><p className="text-xs text-[#1A3619]/60">{order.total}</p></td>
                          <td className="py-4">{getStatusBadge(order.status)}</td>
                          <td className="py-4 text-right">
  <select 
    value={order.status}
    onChange={(e) => handleOrderStatus(order._id, e.target.value)}
    className="text-xs font-bold bg-white border border-[#1A3619]/20 text-[#1A3619] rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-[#D96B40] transition-colors"
  >
    <option value="New">New</option>
    <option value="Preparing">Preparing</option>
    <option value="In Transit">In Transit</option>
    <option value="Delivered">Delivered</option>
  </select>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </div>

          {/* INVENTORY GRID */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-[#1A3619]">Quick Inventory</h2>
              <button className="text-sm font-semibold text-[#1A3619] hover:text-[#D96B40]">Manage All Stocks</button>
            </div>
            
            {inventory.length === 0 ? (
              <div className="bg-white border border-[#1A3619]/10 rounded-[2rem] p-10 text-center"><Package className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-4" /><p className="text-[#1A3619]/60">Your inventory is empty.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((prod) => (
                  <div key={prod._id} className="group bg-white border border-[#1A3619]/10 rounded-[2rem] overflow-hidden hover:border-[#D96B40]/40 transition-all duration-300">
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <img src={prod.image === "default-image-url.jpg" ? "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop" : prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white">{prod.category}</span>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-[#1A3619] mb-4">{prod.name}</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#1A3619]/60 flex items-center gap-1.5"><Package className="w-4 h-4"/> Remaining</span>
                          <span className="font-bold text-[#1A3619]">{prod.qty.toString().toLowerCase().replace(/kg/g, '').trim()} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#1A3619]/60 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Price</span>
                          {/* 🪙 Monnaie dynamique appliquée ici */}
                          <span className="font-bold text-[#D96B40]">{prod.price.toString().toLowerCase().replace(new RegExp(currency.toLowerCase(), 'g'), '').trim()} {currency}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#1A3619]/60 flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Harvested</span>
                          <span className="font-bold text-[#1A3619]">{prod.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(prod)} className="flex-1 py-2.5 bg-[#1A3619]/5 hover:bg-[#1A3619]/10 text-[#1A3619] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => openEditModal(prod)} className="flex-none px-4 py-2.5 bg-[#D96B40] hover:bg-[#c25a32] text-white rounded-xl text-sm font-semibold shadow-md transition-colors">
                          + Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* === MODAL 1 : ADD NEW HARVEST === */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-[#1A3619]/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl z-50 border border-[#1A3619]/10">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div><h2 className="text-2xl font-serif font-bold text-[#1A3619]">New Harvest</h2><p className="text-[#1A3619]/60 text-sm mt-1">Add a new product to your inventory.</p></div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddHarvest} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Product Name</label>
                    <input type="text" name="name" required value={newProduct.name} onChange={handleInputChange} placeholder="e.g. Organic Tomatoes" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Category</label>
                      <select name="category" required value={newProduct.category} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
                        <option value="" disabled>Select...</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Dairy">Dairy</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Harvest Date</label>
                      <input type="date" name="date" required value={newProduct.date} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Quantity (in Kg)</label>
                      <input type="text" name="qty" required value={newProduct.qty} onChange={handleInputChange} placeholder="500" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Price (per Kg in {currency})</label>
                      <input type="text" name="price" required value={newProduct.price} onChange={handleInputChange} placeholder="150" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"/>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Product Image</label>
                    <input type="file" name="image" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#1A3619]/10 file:text-[#1A3619]"/>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#D96B40] text-white font-semibold rounded-xl text-sm">{isSubmitting ? 'Saving...' : 'Save Product'}</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === MODAL 2 : EDIT / UPDATE EXISTING PRODUCT === */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-[#1A3619]/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden border border-[#1A3619]/10">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#1A3619]">Update Harvest</h2>
                    <p className="text-[#1A3619]/60 text-sm mt-1">Modify pricing or stock volume for this product.</p>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Product Name</label>
                    <input type="text" name="name" required value={editingProduct.name} onChange={handleEditInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Category</label>
                      <select name="category" required value={editingProduct.category} onChange={handleEditInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none">
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Dairy">Dairy</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Harvest Date</label>
                      <input type="date" name="date" required value={editingProduct.date} onChange={handleEditInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Quantity (in kg)</label>
                      <input type="text" name="qty" required value={editingProduct.qty} onChange={handleEditInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1A3619] font-bold outline-none"/>
                    </div>
                    <div className="space-y-1">
                      {/* 🪙 Label dynamique avec la devise détectée */}
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Price (per kg in {currency})</label>
                      <input type="text" name="price" required value={editingProduct.price} onChange={handleEditInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#D96B40] font-bold outline-none"/>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#1A3619] text-white font-semibold rounded-xl text-sm">
                      {isSubmitting ? 'Updating...' : 'Apply Changes'}
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