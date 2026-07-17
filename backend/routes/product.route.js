import express from 'express';
import Product from '../models/products.js'; 
import { verifyToken } from '../middlewares/verifyToken.js';
import uploadCloud from '../config/cloudinary.js';

const router = express.Router();

// Créer un produit
router.post('/', verifyToken, uploadCloud.single('image'), async (req, res) => {
  try {
    const { name, category, qty, price, date } = req.body;

    let imageUrl = "default-image-url.jpg";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const newProduct = new Product({
      farmerId: req.userId, 
      name,
      category,
      qty,
      price,
      date,
      image: imageUrl
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la sauvegarde." });
  }
});

// Modifier un produit
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, category, qty, price, date } = req.body;
    const productId = req.params.id;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, farmerId: req.userId }, 
      { 
        $set: { 
          name, 
          category, 
          qty: String(qty),    
          price: String(price), 
          date 
        } 
      },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit introuvable ou vous n'avez pas l'autorisation de le modifier." 
      });
    }

   res.status(200).json({ success: true, product: updatedProduct });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la modification." });
  }
});

// Tout afficher
router.get('/all', verifyToken, async (req, res) => {
  try {
    const products = await Product.find().populate('farmerId', 'name region country');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des produits." });
  }
});

// Supprimer un produit
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Produit introuvable" });
    res.json({ success: true, message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
