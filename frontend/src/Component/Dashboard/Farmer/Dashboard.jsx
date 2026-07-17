import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, AlertCircle, Calendar, ArrowRight,
  MoreVertical, Clock, Loader2, X, Edit3, Trash2,
  Wallet, Truck, Sprout, Package, DollarSign
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [farmerName, setFarmerName] = useState(""); 
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState([]);
  const [currency, setCurrency] = useState("DZD");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const updateKpiStats = (currentInventory, backendRevenue, pendingCount, currentCurrency = "DZD") => {
    const totalProductsCount = currentInventory.length;

    setStats([
      { 
        title: "Total Revenue (Delivered)", 
        value: `${backendRevenue} ${currentCurrency}`, 
        rawRevenue: backendRevenue,
        icon: Wallet, 
        bgColor: "bg-[#345E37]", 
        textColor: "text-white",
        labelColor: "text-white/80"
      },
      { 
        title: "Pending Orders", 
        value: pendingCount.toString(), 
        rawValue: pendingCount,
        icon: Truck, 
        bgColor: "bg-[#D96B40]", 
        textColor: "text-white",
        labelColor: "text-white/80" 
      },
      { 
        title: "Products in Stock", 
        value: totalProductsCount.toString(),
        icon: Sprout, 
        bgColor: "bg-[#ECC861]", 
        textColor: "text-[#1A3619]",
        labelColor: "text-[#1A3619]/80" 
      },
    ]);
  };

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

  const handleOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, 
        { status: newStatus }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        setRecentOrders(recentOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      alert("Erreur lors de la mise à jour du statut de la commande.");
    }
  };

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

  const handleDeleteProduct = async (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product from the database?");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:3000/api/products/${productId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        const updatedInventory = inventory.filter(prod => prod._id !== productId);
        setInventory(updatedInventory);
        
        updateKpiStats(updatedInventory, stats[0]?.rawRevenue || 0, stats[1]?.rawValue || 0, currency);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du produit.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async (isInitialLoad = false) => {
      if (isInitialLoad) setIsLoading(true); 
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard', {
          withCredentials: true 
        });
        
        if (response.data.success) {
          const { farmerName, country, orders, inventory: dbInventory, stats: dbStats } = response.data.data;
          setFarmerName(farmerName);
          setRecentOrders(orders); 
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

    fetchDashboardData(true);
    const intervalId = setInterval(() => { fetchDashboardData(false); }, 10000);
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
          
         
<motion.div 
  variants={item} 
  className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1A3619]/10 pb-8"
>
  <div>
    <h1 className="text-3xl md:text-4xl font-serif text-[#1A3619] tracking-tight leading-snug">
      <span className="block font-medium text-[#1A3619]/80">Welcome back,</span>
      <span className="block font-bold text-[#D96B40]">{farmerName || "Farmer"}! </span>
    </h1>
    <p className="mt-3 text-[#1A3619]/60 font-medium text-sm">
      Thank you for feeding our community. Here is a snapshot of your hard work today.
    </p>
  </div>
  
  <button 
    onClick={() => setIsModalOpen(true)} 
    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A3619] hover:bg-[#2a5227] text-white font-semibold rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 duration-300 shrink-0"
  >
    <Plus className="w-5 h-5" /> Add New Harvest
  </button>
</motion.div>

          
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
  {stats.map((stat, idx) => {
    const Icon = stat.icon;
    return (
      <div 
        key={idx} 
        className={`p-7 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[170px] transition-all hover:scale-[1.02] duration-300 ${stat.bgColor} ${stat.textColor}`}
      >
        <div className="flex items-center">
          <Icon className="w-7 h-7 stroke-[1.5]" />
        </div>
        
       <div className="mt-6">
  <p className="text-lg lg:text-2xl font-serif font-bold mb-1 tracking-tight">
    {stat.value}
  </p>
  <h3 className={`text-xs font-semibold tracking-wide ${stat.labelColor}`}>
    {stat.title}
  </h3>
</div>
      </div>
    );
  })}
</motion.div>

         <div className="w-full">
            <motion.div variants={item} className="w-full bg-[#F6F1E7] rounded-[2rem] border border-[#1A3619]/10 shadow-sm p-6 lg:p-8">
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-sm italic font-medium text-[#D96B40] mb-1 font-sans">Logbook</p>
      <h2 className="text-xl font-serif font-bold text-[#1A3619]">Recent Orders</h2>
    </div>
    <button 
      onClick={() => navigate('/farOrd')}
      className="text-sm font-semibold text-[#D96B40] hover:text-[#b55834] flex items-center gap-1 transition-colors"
    >
      View All <ArrowRight className="w-4 h-4" />
    </button>
  </div>

  <div className="flex flex-col gap-4">
    {recentOrders.length === 0 ? (
      <div className="bg-white/50 rounded-3xl p-8 text-center border border-[#1A3619]/5">
        <p className="text-[#1A3619]/50 font-medium">No recent orders found.</p>
      </div>
    ) : (
      recentOrders.slice(0, 3).map((order, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-3xl p-5 md:p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300 border border-[#1A3619]/5"
        >
          
          <div className="flex-1 w-full xl:w-auto">
            <h4 className="text-[#1A3619] text-base lg:text-lg font-bold">{order.product}</h4>
            <p className="text-[#1A3619]/50 text-xs font-medium mt-0.5">
              Ordered on {order.date}
            </p>
          </div>
          
         
          <div className="flex-1 w-full bg-[#FAF9F4] p-4 rounded-2xl border border-[#1A3619]/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A3619]/40 mb-0.5">
                Buyer
              </p>
              <p className="text-sm font-bold text-[#1A3619]">{order.buyer}</p>
            </div>
            <div className="text-right pl-4 border-l border-[#1A3619]/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A3619]/40 mb-0.5">
                Total
              </p>
              <p className="text-sm font-bold text-[#D96B40]">{order.total}</p>
            </div>
          </div>
          
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
                        : "bg-gray-50 text-[#1A3619]/50 hover:bg-[#1A3619]/5 hover:text-[#1A3619] border border-[#1A3619]/10 shadow-sm"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ))
    )}
  </div>
</motion.div>
          </div>

        
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-[#1A3619]">Quick Inventory</h2>
              <button 
                onClick={() => navigate('/my-inventory')} 
                className="text-sm font-semibold text-[#1A3619] hover:text-[#D96B40] transition-colors"
              >
                Manage All Stocks
              </button>
            </div>
            
            {inventory.length === 0 ? (
              <div className="bg-[#F6F1E7] border border-[#1A3619]/10 rounded-[2rem] p-10 text-center">\
              <Package className="w-12 h-12 text-[#1A3619]/20 mx-auto mb-4" /><p className="text-[#1A3619]/60">Your inventory is empty.</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.slice(0, 3).map((prod) => (
                  <div key={prod._id} className="group bg-[#F6F1E7] border border-[#1A3619]/10 rounded-[2rem] overflow-hidden hover:border-[#D96B40]/40 transition-all duration-300">
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
                        
                        <button onClick={() => handleDeleteProduct(prod._id)} className="flex-none px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1 border border-red-100">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
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