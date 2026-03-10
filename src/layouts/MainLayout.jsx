import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="bg-white dark:bg-black text-text-primary-light dark:text-text-primary-dark transition-colors duration-300 p-4 min-h-screen flex flex-col gap-4 font-body">
      <Header />
      <main className="flex-grow flex flex-col gap-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
