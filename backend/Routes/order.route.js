import express from 'express';
import Order from '../Models/order.js';
import User from '../Models/user.model.js';
import Product from '../Models/products.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// Récupérer toutes les commandes pour le fermier
router.get('/farmer-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// MISE À JOUR : Création de la commande
router.post('/place-order', verifyToken, async (req, res) => {
  try {
    // AJOUT DE productId et quantity ICI
    const { farmerId, productId, quantity, productName, category, totalAmount, formattedTotal, deliveryAddress } = req.body;
    
    const buyer = await User.findById(req.userId);

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
    res.status(500).json({ success: false, message: "Erreur lors de la commande" });
  }
});

// Acceptation de la commande et diminution du stock
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body; 
    
    const order = await Order.findOne({ _id: req.params.id, farmerId: req.userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }

    // IL MANQUAIT CETTE LIGNE : On vérifie si on accepte bien la commande
    if (status === 'Preparing' && order.status === 'New') {
      
      if (order.productId && order.quantity) {
        const product = await Product.findById(order.productId);
        
        if (product) {
          // On convertit proprement en nombres pour le calcul
          const currentStock = parseFloat(product.qty) || 0;
          const orderQty = parseFloat(order.quantity) || 0;
          const newStock = currentStock - orderQty;
          
          // On s'assure que le stock ne devienne pas négatif
          product.qty = newStock >= 0 ? newStock.toString() : "0"; 
          await product.save();
        }
      } else {
        console.log("⚠️ Attention: C'est une ancienne commande sans productId. Le stock n'a pas été déduit.");
      }
    } 

    // Mise à jour du statut
    order.status = status;
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    console.error("Erreur de mise à jour :", error); // Toujours bien pour débugger !
    res.status(500).json({ success: false, message: "Erreur de mise à jour" });
  }
});

// RÉCUPÉRER TOUTES LES COMMANDES DE L'ACHETEUR CONNECTÉ
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    // On trouve les commandes de l'acheteur, et on récupère les détails du fermier (nom, région, tel...)
    const orders = await Order.find({ buyerId: req.userId })
      .populate('farmerId', 'name email phone region')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes acheteur :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// L'acheteur passe une commande
router.post('/place-order', verifyToken, async (req, res) => {
  try {
    const { farmerId, productId, quantity, productName, category, totalAmount, formattedTotal, deliveryAddress } = req.body;
    
    // Récupérer les infos de l'acheteur (celui qui est connecté)
    const buyer = await User.findById(req.userId);

    const newOrder = new Order({
      farmerId,
      buyerId: req.userId,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: buyer.name, 
      quantity,
      productId,
      deliveryAddress,
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
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la commande" });
  }
});

// L'ACHETEUR ANNULE SA COMMANDE (Seulement si le statut est encore 'New')
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

// Le fermier accepte ou refuse la commande
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body; // 'Preparing' (Accepter) ou 'Cancelled' (Refuser)
    
    // Met à jour uniquement si la commande appartient bien à ce fermier
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.userId },
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ success: false, message: "Commande introuvable" });
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur de mise à jour" });
  }
});

export default router;