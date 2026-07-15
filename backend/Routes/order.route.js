import express from 'express';
import Order from '../Models/order.js';
import User from '../Models/user.model.js';
import Product from '../Models/products.js';
import { calculateLogistics } from '../Utils/logistics.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

/* ==========================================================================
   1. ROUTES POUR L'ACHETEUR (BUYER)
   ========================================================================== */

// Passer une commande (Acheteur) - VERSION UNIQUE ET SÉCURISÉE
router.post('/place-order', verifyToken, async (req, res) => {
  try {
    const { farmerId, productId, quantity, productName, category, totalAmount, formattedTotal, deliveryAddress } = req.body;
    
    // Récupérer les informations de l'acheteur connecté
    const buyer = await User.findById(req.userId);
    if (!buyer) {
      return res.status(404).json({ success: false, message: "Acheteur introuvable" });
    }

    const newOrder = new Order({
      farmerId,
      buyerId: req.userId,
      productId,
      quantity: quantity || 1,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: buyer.name, 
      deliveryAddress: deliveryAddress || buyer.region || "Not specified",
      productName,
      category: category || 'Other',
      totalAmount,
      formattedTotal,
      status: 'New', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Erreur lors de la création de commande :", error);
    res.status(500).json({ success: false, message: "Erreur lors de la commande" });
  }
});

// Récupérer toutes les commandes de l'acheteur connecté (avec infos du fermier)
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.userId })
      .populate('farmerId', 'name email phone region')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes acheteur :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// L'acheteur annule sa propre commande (uniquement si le statut est encore 'New')
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, buyerId: req.userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }

    if (order.status !== 'New') {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible d'annuler une commande déjà prise en charge par l'agriculteur." 
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: "Commande annulée avec succès", order });
  } catch (error) {
    console.error("Erreur annulation commande :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});


/* ==========================================================================
   2. ROUTES POUR LE FERMIER (FARMER)
   ========================================================================== */

// Récupérer toutes les commandes destinées au fermier connecté
router.get('/farmer-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Mise à jour du statut (Acceptation par le fermier OU livraison finale par le transporteur)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body; 
    
    // MODIFICATION ICI : On autorise le Fermier OU le Transporteur affecté à modifier le statut
    const order = await Order.findOne({ 
      _id: req.params.id, 
      $or: [
        { farmerId: req.userId },
        { transporterId: req.userId }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable ou non autorisée" });
    }

    // 👉 GESTION DU PASSAGE AU STATUT "PREPARING" (uniquement déclenché par le fermier au début)
    if (status === 'Preparing' && order.status === 'New') {

      // A. CALCUL DE LA LOGISTIQUE (Distance et frais de livraison)
      try {
        const farmer = await User.findById(order.farmerId);
        const buyer = await User.findById(order.buyerId);

        if (farmer && buyer) {
          const { distanceKm, deliveryFee } = calculateLogistics(farmer.region, buyer.region);
          order.distanceKm = distanceKm;
          order.deliveryFee = deliveryFee;
        }
      } catch (logisticsError) {
        console.error("⚠️ Erreur lors du calcul de la logistique :", logisticsError);
      }

      // B. SÉCURISATION ET DÉDUCTION DES STOCKS 
      if (order.productId && order.quantity) {
        const product = await Product.findById(order.productId);
        
        if (product) {
          const currentStock = parseFloat(product.qty) || 0;
          const orderQty = parseFloat(order.quantity) || 0;
          const newStock = currentStock - orderQty;
          
          // Sauvegarde sécurisée sans descendre en dessous de 0
          product.qty = newStock >= 0 ? newStock.toString() : "0"; 
          await product.save();
        }
      } else {
        console.log("⚠️ Attention: Commande sans productId. Le stock n'a pas été déduit.");
      }
    } 

    // Application du nouveau statut et sauvegarde
    order.status = status;
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error("Erreur de mise à jour du statut :", error);
    res.status(500).json({ success: false, message: "Erreur de mise à jour" });
  }
});


/* ==========================================================================
   3. ROUTES POUR LE TRANSPORTEUR (TRANSPORTER)
   ========================================================================== */

// AJOUT ICI : Récupérer toutes les livraisons (actives & terminées) affectées au transporteur connecté[cite: 33]
router.get('/my-deliveries', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ transporterId: req.userId })
      .populate('farmerId', 'name region phone')
      .populate('buyerId', 'name region phone')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Erreur lors de la récupération des livraisons :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Contrôleur générique pour récupérer les offres de livraison disponibles
const getAvailableJobs = async (req, res) => {
  try {
    const jobs = await Order.find({ 
      status: 'Preparing', 
      transporterId: null 
    })
    .populate('farmerId', 'name region')
    .populate('buyerId', 'name region');

    // On renvoie un format compatible avec toutes les variantes du frontend
    res.status(200).json({ success: true, jobs, offers: jobs });
  } catch (error) {
    console.error("Erreur de récupération des livraisons disponibles :", error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des offres." });
  }
};

// Double déclaration de route pour gérer à la fois '/available-offers' et '/available-jobs'
router.get('/available-offers', verifyToken, getAvailableJobs);
router.get('/available-jobs', verifyToken, getAvailableJobs);

// Contrôleur générique pour accepter une course
const acceptJob = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }
    if (order.transporterId) {
      return res.status(400).json({ success: false, message: "Déjà prise en charge par un autre transporteur" });
    }

    order.transporterId = req.userId; // ID du transporteur connecté issu du JWT token
    order.status = 'In Transit'; 
    await order.save();

    res.status(200).json({ success: true, message: "Livraison acceptée avec succès !", order });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la course :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Double déclaration de route pour gérer les deux endpoints du frontend
router.put('/:id/accept-delivery', verifyToken, acceptJob);
router.put('/:id/accept-job', verifyToken, acceptJob);

export default router;