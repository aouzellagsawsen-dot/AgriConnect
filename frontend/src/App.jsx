import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Component/Layout/header.jsx';
import Footer from './Component/Layout/footer.jsx';
import { Home } from './Component/HomePage/Home.jsx';
import About from './Component/about.jsx';
import Auth from './Component/Auth/auth.jsx';
import Forgot from './Component/Auth/ForgotPassword';

import './App.css'

function App() {
  
  return (
  <div className="bg-[#F5F5F1] text-gray-900 dark:text-[#EAEAEA] min-h-screen flex flex-col transition-colors duration-500">
    <main className="grow w-full">
        <Routes>
          <Route path="/*" element={
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
        </Routes>
      </main>
      

      
    </div>
  )
}

export default App
