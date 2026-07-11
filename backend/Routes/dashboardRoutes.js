import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.js';   
import Product from '../Models/products.js'; 
import User from '../models/user.model.js'; 
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    // 3. L'ID ne vient plus de req.params, mais de req.userId (injecté par verifyToken)
    const farmerId = req.userId;

    // Vérification de l'ID pour éviter les erreurs MongoDB
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ success: false, message: "ID Agriculteur invalide" });
    }

    // 4. On récupère les infos du fermier (pour avoir son nom)
    const farmer = await User.findById(farmerId).select('name country'); 
    
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Agriculteur introuvable" });
    }

    // 1. Récupérer les dernières commandes (limitées à 5 pour le tableau de bord)
    const recentOrders = await Order.find({ farmerId })
      .sort({ createdAt: -1 }) // Trier par date décroissante
      .limit(5);

    // Formater les commandes pour correspondre au frontend React
    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      id: order.orderNumber,
      buyer: order.buyerName,
      product: order.productName,
      total: order.formattedTotal,
      status: order.status,
      date: order.date
    }));

    // 2. Récupérer l'inventaire complet ou les produits phares
    const inventory = await Product.find({ farmerId }).limit(6);

    // 3. Calculer les statistiques avec l'Aggrégation MongoDB
    // Calcul du revenu total des commandes livrées
    const revenueResult = await Order.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(farmerId), status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Compter les commandes en attente ("New" ou "Preparing")
    const pendingOrdersCount = await Order.countDocuments({ 
      farmerId, 
      status: { $in: ['New', 'Preparing'] } 
    });

    // 4. Structurer la réponse finale
    res.json({
      success: true,
      data: {
        farmerName: farmer.name,
        country: farmer.country,
        orders: formattedOrders,
        inventory: inventory,
        stats: {
          revenue: totalRevenue.toLocaleString(), // Formate avec des virgules (ex: 324,500)
          pending: pendingOrdersCount
        }
      }
    });

  } catch (error) {
    console.error("Erreur Dashboard API:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des données" });
  }
});

export default router;