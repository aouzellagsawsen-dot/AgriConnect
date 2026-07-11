import express from 'express';
import Order from '../models/order.js';
import User from '../models/user.model.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

// L'acheteur passe une commande
router.post('/place-order', verifyToken, async (req, res) => {
  try {
    const { farmerId, productName, totalAmount, formattedTotal } = req.body;
    
    // Récupérer les infos de l'acheteur (celui qui est connecté)
    const buyer = await User.findById(req.userId);

    const newOrder = new Order({
      farmerId,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: buyer.name, // Récupéré depuis la DB
      productName,
      totalAmount,
      formattedTotal,
      status: 'New', // Statut par défaut
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la commande" });
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