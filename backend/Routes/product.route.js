import express from 'express';
import Product from '../Models/products.js'; 
import { verifyToken } from '../middlewares/verifyToken.js';
import uploadCloud from '../config/cloudinary.js';

const router = express.Router();

router.post('/', verifyToken, uploadCloud.single('image'), async (req, res) => {
  try {
    const { name, category, qty, price, date } = req.body;

    let imageUrl = "default-image-url.jpg";
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    // On utilise directement req.userId grâce à votre middleware !
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
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, category, qty, price, date } = req.body;
    const productId = req.params.id;

    // 🔒 Sécurité : On met à jour uniquement si le produit appartient au fermier connecté (req.userId)
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, farmerId: req.userId }, 
      { 
        $set: { 
          name, 
          category, 
          qty: String(qty),    // On s'assure de stocker en String conformément au schéma
          price: String(price), // On s'assure de stocker en String conformément au schéma
          date 
        } 
      },
      { new: true } // Requis pour renvoyer le produit mis à jour à ton React
    );

    // Si le produit n'existe pas ou n'appartient pas au fermier
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit introuvable ou vous n'avez pas l'autorisation de le modifier." 
      });
    }

    // On renvoie une réponse positive structurée exactement comme le frontend l'attend
    res.status(200).json({ success: true, product: updatedProduct });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la modification." });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  try {
    // On récupère tous les produits et on "populate" pour avoir le nom et la région de l'agriculteur
    const products = await Product.find().populate('farmerId', 'name region country');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des produits." });
  }
});

export default router;