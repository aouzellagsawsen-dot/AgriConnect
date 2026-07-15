import React from 'react';
import { Outlet } from 'react-router-dom';
import TSidebar from './TransporterSidebar';

export default function DashboardLayout() {
  return (
    <div>
      <TSidebar />
      
      <div>
        <Outlet />
      </div>
    </div>
  );
}