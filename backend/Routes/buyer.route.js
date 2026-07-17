import express from 'express';
import User from '../models/user.model.js';
import { verifyToken } from '../middlewares/verifyToken.js'; 

const router = express.Router();

// AJOUTER / RETIRER UN FERMIER DES FAVORIS
router.post('/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const buyerId = req.userId; 

    const { farmerId } = req.body;

    if (!farmerId) {
      return res.status(400).json({ success: false, message: "L'ID du fermier est requis." });
    }

    const farmer = await User.findOne({ _id: farmerId, role: 'farmer' });
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Fermier introuvable." });
    }

    const buyer = await User.findById(buyerId);
    
    const isFavorited = buyer.favoriteFarmers.includes(farmerId);

    if (isFavorited) {
      buyer.favoriteFarmers.pull(farmerId);
      await buyer.save();
      return res.status(200).json({ 
        success: true, 
        isFavorited: false, 
        message: "Fermier retiré des favoris." 
      });
    } else {
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

// RÉCUPÉRER LA LISTE COMPLETE DES FERMIERS FAVORIS
router.get('/favorites', verifyToken, async (req, res) => {
  try {
    const buyer = await User.findById(req.userId).populate({
      path: 'favoriteFarmers',
      select: 'name region email phone' 
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