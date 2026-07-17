import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.js';   
import Product from '../models/products.js'; 
import User from '../models/user.model.js'; 
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const farmerId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ success: false, message: "ID Agriculteur invalide" });
    }

    const farmer = await User.findById(farmerId).select('name country'); 
    
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Agriculteur introuvable" });
    }

    const recentOrders = await Order.find({ farmerId })
      .sort({ createdAt: -1 }) 
      .limit(5);

    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      id: order.orderNumber,
      buyer: order.buyerName,
      product: order.productName,
      total: order.formattedTotal,
      status: order.status,
      date: order.date
    }));

    const inventory = await Product.find({ farmerId }).limit(6);

    const revenueResult = await Order.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(farmerId), status: 'Delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const pendingOrdersCount = await Order.countDocuments({ 
      farmerId, 
      status: { $in: ['New', 'Preparing'] } 
    });

    res.json({
      success: true,
      data: {
        farmerName: farmer.name,
        country: farmer.country,
        orders: formattedOrders,
        inventory: inventory,
        stats: {
          revenue: totalRevenue.toLocaleString(), 
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
