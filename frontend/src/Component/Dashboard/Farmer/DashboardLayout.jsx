import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      
      <div>
        <Outlet />
      </div>
    </div>
  );
}