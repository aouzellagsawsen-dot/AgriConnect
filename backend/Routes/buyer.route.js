import express from 'express';
import User from '../models/user.model.js';
import { verifyToken } from '../middlewares/verifyToken.js'; 

const router = express.Router();

// ==========================================
// 1. AJOUTER / RETIRER UN FERMIER DES FAVORIS (Toggle)
// POST /api/buyers/favorites/toggle
// ==========================================
router.post('/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const buyerId = req.userId; // Injecté par verifyToken
    const { farmerId } = req.body;

    if (!farmerId) {
      return res.status(400).json({ success: false, message: "L'ID du fermier est requis." });
    }

    // Sécurité : On vérifie que ce fermier existe et qu'il est bien un "farmer"
    const farmer = await User.findOne({ _id: farmerId, role: 'farmer' });
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Fermier introuvable." });
    }

    const buyer = await User.findById(buyerId);
    
    // Vérifie si déjà présent dans les favoris
    const isFavorited = buyer.favoriteFarmers.includes(farmerId);

    if (isFavorited) {
      // S'il y est, on l'enlève
      buyer.favoriteFarmers.pull(farmerId);
      await buyer.save();
      return res.status(200).json({ 
        success: true, 
        isFavorited: false, 
        message: "Fermier retiré des favoris." 
      });
    } else {
      // S'il n'y est pas, on l'ajoute
      buyer.favoriteFarmers.addToSet(farmerId);
      await buyer.save();
      return res.status(200).json({ 
        success: true, 
        isFavorited: true, 
        message: "Fermier ajouté aux favoris !" 
      });
    }
  } catch (error) {
    console.error("Erreur Toggle favoris:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour des favoris." });
  }
});

// ==========================================
// 2. RÉCUPÉRER LA LISTE DES FERMIERS FAVORIS
// GET /api/buyers/favorites
// ==========================================
router.get('/favorites', verifyToken, async (req, res) => {
  try {
    // Récupérer l'acheteur et charger (populate) les données de ses fermiers favoris
    const buyer = await User.findById(req.userId).populate({
      path: 'favoriteFarmers',
      select: 'name region email phone' // On ne récupère que le strict nécessaire
    });

    res.status(200).json({ 
      success: true, 
      favorites: buyer.favoriteFarmers 
    });
  } catch (error) {
    console.error("Erreur Get favoris:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des favoris." });
  }
});

export default router;