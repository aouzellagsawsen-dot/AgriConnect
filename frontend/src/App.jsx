import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Component/Layout/header.jsx';
import Footer from './Component/Layout/footer.jsx';
import { Home } from './Component/HomePage/Home.jsx';
import About from './Component/about.jsx';
import Auth from './Component/Auth/auth.jsx';
import Forgot from './Component/Auth/ForgotPassword';
import Verify from './Component/Auth/VerifyEmail.jsx';
import Reset from './Component/Auth/ResetPassword.jsx';

import Dash from './Component/Dashboard/Farmer/Dashboard.jsx';
import DashboardLayout from './Component/Dashboard/Farmer/DashboardLayout.jsx';
import Inv from './Component/Dashboard/Farmer/MyInventory.jsx';
import FarOrd from './Component/Dashboard/Farmer/FarmerOrders.jsx';

import BDashLayout from './Component/Dashboard/Buyer/BuyerDashLayout.jsx';
import BDash from './Component/Dashboard/Buyer/BuyerDashboard.jsx';
import BFav from './Component/Dashboard/Buyer/BuyerFavorites.jsx';
import MPlace from './Component/Dashboard/Buyer/MarketPlace.jsx';
import Order from './Component/Dashboard/Buyer/MyOrders.jsx';




import './App.css'

function App() {
  
  return (
  <div className="bg-[#F5F5F1] text-gray-900 dark:text-[#EAEAEA] min-h-screen flex flex-col transition-colors duration-500">
    <main className="grow w-full">
        <Routes>
          <Route path="/" element={
            <>
                <div className="sticky top-0 z-50 bg-[#F7F4EB]/90 dark:bg-[#0B0C10]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-colors duration-500">
                  <Header />
                </div>
                <Home />
                <div className="sticky top-0 z-50 bg-[#F7F4EB]/90 dark:bg-[#0B0C10]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-colors duration-500">
                  <Footer />
                </div>
              </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/verify-email" element={<Verify />} />
          <Route path="/reset-password" element={<Reset />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dash" element={<Dash />} />
            <Route path="/my-inventory" element={<Inv />} />
            <Route path="/farOrd" element={<FarOrd />} />
           
           </Route>
          <Route element={<BDashLayout />}>
             <Route path="/Bdash" element={<BDash />} />
             <Route path="/Bfav" element={<BFav />} />
             <Route path="/Mplace" element={<MPlace />} />
             <Route path="/Order" element={<Order />} />
          
            
            
          </Route>
          
        </Routes>
      </main>
      

      
    </div>
  )
}

export default App
