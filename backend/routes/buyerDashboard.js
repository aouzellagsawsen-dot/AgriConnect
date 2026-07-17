import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.js';
import User from '../models/user.model.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const buyerId = req.userId;
    const buyer = await User.findById(buyerId);

    // Calculer les dépenses totales
    const spentResult = await Order.aggregate([
      { $match: { buyerId: new mongoose.Types.ObjectId(buyerId), status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSpent: { $sum: "$totalAmount" } } }
    ]);
    const totalSpent = spentResult.length > 0 ? spentResult[0].totalSpent : 0;

    // Commandes actives 
    const activeOrders = await Order.countDocuments({ 
      buyerId, 
      status: { $in: ['New', 'Preparing', 'In Transit'] } 
    });

    // Dépenses par catégorie pour le diagramme circulaire
    const categoryResult = await Order.aggregate([
      { $match: { buyerId: new mongoose.Types.ObjectId(buyerId), status: { $ne: 'Cancelled' } } },
      { $group: { _id: "$category", value: { $sum: "$totalAmount" } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Commandes récentes
    const recentOrders = await Order.find({ buyerId })
      .populate('farmerId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedOrders = recentOrders.map(order => ({
      id: order.orderNumber,
      farmer: order.farmerId?.name || "Unknown Farmer",
      amount: order.formattedTotal,
      status: order.status,
      date: order.date
    }));

    // Simulation des dépenses par mois 
     const spendingHistory = await Order.aggregate([
      { $match: { buyerId: new mongoose.Types.ObjectId(buyerId), status: { $ne: 'Cancelled' } } },
      { 
        $group: { 
         _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          amount: { $sum: "$totalAmount" } 
        } 
      },
      { $sort: { _id: 1 } }, 
      { $limit: 7 },         
      { $project: { name: "$_id", amount: 1, _id: 0 } } 
    ]);

    res.json({
      success: true,
      data: {
        buyerName: buyer.name,
        totalSpent,
        activeOrders,
        categorySpending: categoryResult.length > 0 ? categoryResult : [{ name: "No Data", value: 1 }],
        recentOrders: formattedOrders,
        spendingHistory: spendingHistory.length > 0 ? spendingHistory : [{ name: 'Aujourd\'hui', amount: 0 }]
      }
    });

  } catch (error) {
    console.error("Erreur Acheteur Dashboard API:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
