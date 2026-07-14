import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, Calendar, 
  Edit3, Trash2, ArrowLeft, Filter, Loader2, X 
} from 'lucide-react';

export default function MyInventory() {
  const navigate = useNavigate();

  // États principaux
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [currency, setCurrency] = useState("DZD");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // États de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la modification (Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    _id: '',
    name: '',
    category: '',
    qty: '',
    price: '',
    date: ''
  });

  // Catégories disponibles pour le filtre
  const categories = ["All", "Vegetables", "Fruits", "Grains", "Dairy"];

  // 🔄 RÉCUPÉRATION DES DONNÉES
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard', {
          withCredentials: true 
        });
        
        if (response.data.success) {
          const { country, inventory: dbInventory } = response.data.data;
          
          // Détection de la devise
          let detectedCurrency = "Autre"; 
          if (country) {
            const cleanLocation = country.toLowerCase().trim();
            if (cleanLocation.includes("algeria")) detectedCurrency = "DZD"; 
            else if (cleanLocation.includes("morocco")) detectedCurrency = "MAD"; 
            else if (cleanLocation.includes("tunisia")) detectedCurrency = "TND"; 
            else if (cleanLocation.includes("mauritania")) detectedCurrency = "MRU"; 
            else if (cleanLocation.includes("libya")) detectedCurrency = "LYD"; 
          }
          setCurrency(detectedCurrency);

          // Tri du plus récent au plus ancien basé sur la date
          const sortedInventory = dbInventory.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setInventory(sortedInventory);
          setFilteredInventory(sortedInventory);
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'inventaire.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // 🔎 FILTRAGE PAR CATÉGORIE
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(prod => prod.category === selectedCategory));
    }
  }, [selectedCategory, inventory]);

  // 🗑️ SUPPRESSION
  const handleDeleteProduct = async (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:3000/api/products/${productId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        const updatedInventory = inventory.filter(prod => prod._id !== productId);
        setInventory(updatedInventory);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du produit.");
    }
  };

  // ✏️ GESTION DE L'ÉDITION
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

  const handleEditInputChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
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
        
        // Retrier après mise à jour au cas où la date change
        const sortedUpdated = updatedInventory.sort((a, b) => new Date(b.date) - new Date(a.date));
        setInventory(sortedUpdated);
        alert("Produit mis à jour avec succès !");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animations Framer Motion
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  if (isLoading) return <div className="min-h-screen bg-[#FAF9F4] flex flex-col items-center justify-center"><Loader2 className="w-12 h-12 text-[#1A3619] animate-spin mb-4" /><p className="text-[#1A3619]/60 font-medium">Loading inventory...</p></div>;
  if (error) return <div className="min-h-screen bg-[#FAF9F4] flex items-center justify-center p-6"><div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center max-w-md shadow-sm"><p>{error}</p></div></div>;

  return (
    <div className="min-h-screen bg-[#FAF9F4] lg:pl-[300px]">
      <div className="h-20 lg:h-0" />
      
      <main className="p-6 lg:p-10 max-w-7xl mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          
          {/* HEADER & RETOUR */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1A3619] tracking-tight">
                My Full Inventory
              </h1>
              <p className="mt-2 text-[#1A3619]/60 font-medium">Manage all your harvested products here.</p>
            </div>
          </motion.div>

          {/* BARRE DE FILTRES */}
          <motion.div variants={item} className="bg-white p-2 rounded-2xl border border-[#1A3619]/10 shadow-sm flex flex-wrap gap-2 items-center">
            <div className="pl-4 pr-2 text-[#1A3619]/40"><Filter className="w-5 h-5" /></div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                  ? "bg-[#1A3619] text-white shadow-md" 
                  : "bg-transparent text-[#1A3619]/60 hover:bg-[#FAF9F4]"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto pr-4 text-sm font-bold text-[#D96B40]">
              Total: {filteredInventory.length} items
            </div>
          </motion.div>

          {/* GRILLE D'INVENTAIRE */}
          <motion.div variants={item}>
            {filteredInventory.length === 0 ? (
              <div className="bg-white border border-[#1A3619]/10 rounded-[2rem] p-16 text-center">
                <Package className="w-16 h-16 text-[#1A3619]/20 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-[#1A3619] mb-2">No products found</h3>
                <p className="text-[#1A3619]/60">You don't have any products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventory.map((prod) => (
                  <div key={prod._id} className="group bg-white border border-[#1A3619]/10 rounded-[2rem] overflow-hidden hover:border-[#D96B40]/40 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
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
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(prod._id)} className="flex-none px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1 border border-red-100">
                          <Trash2 className="w-4 h-4" /> Delete
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

      {/* === MODAL : EDIT PRODUCT === */}
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