import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from "./Sidebar.jsx";

export default function MainLayout() {
  return (
      <div className="bg-white dark:bg-black text-text-primary-light dark:text-text-primary-dark transition-colors duration-300 min-h-screen flex flex-col font-body">
          <Header />
          <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4">
                  <Outlet />
              </main>
          </div>
          <Footer />
      </div>
  );
}
