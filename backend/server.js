import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productsRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';
import buyerRoutes from './routes/buyer.route.js';
import buyerDashRoutes from './routes/buyerDashboard.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://agri-connect-rz3n.vercel.app',
    'https://agri-connect-rz3n-aw7skivcn-s-aouzellag-8385s-projects.vercel.app',
    'https://agri-connect-rz3n-s-aouzellag-8385s-projects.vercel.app'
  ],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================================
// LA BONNE MÉTHODE DE CONNEXION
// ==========================================
let isConnected = false; 

const connectDB = async () => {
  if (isConnected) {
    return; // Connexion instantanée si elle existe déjà
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Sécurité : pas plus de 5s d'attente
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('Connexion à MongoDB réussie et prête !');
  } catch (error) {
    console.error('Erreur de connexion MongoDB :', error);
  }
};

app.use(async (req, res, next) => {
  await connectDB(); // Force la vérification avant chaque route
  next();
});
// ==========================================

app.get('/', (req, res) => {
  res.status(200).send("L'API AgriConnect est en ligne et fonctionne parfaitement ! 🚀");
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/buyers/dashboard', buyerDashRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur le port ${PORT}`);
    });
}
export default app;