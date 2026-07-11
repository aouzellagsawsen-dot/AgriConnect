import React from 'react';
import { Outlet } from 'react-router-dom';
import BSidebar from './BuyerSidebar';

export default function DashboardLayout() {
  return (
    <div>
      <BSidebar />
      
      <div>
        <Outlet />
      </div>
    </div>
  );
}