import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EAEAEA] dark:bg-black rounded-3xl pt-12 pb-8 px-8 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">About</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a className="hover:text-primary" href="#">About Us</a></li>
            <li><a className="hover:text-primary" href="#">Newsroom</a></li>
            <li><a className="hover:text-primary" href="#">Careers</a></li>
            <li><a className="hover:text-primary" href="#">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Partnerships</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a className="hover:text-primary" href="#">Merchant Sign Up</a></li>
            <li><a className="hover:text-primary" href="#">Affiliate Partnership</a></li>
            <li><a className="hover:text-primary" href="#">Influencer Program</a></li>
            <li><a className="hover:text-primary" href="#">Agent Marketplace</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Terms of Use</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li><a className="hover:text-primary" href="#">General Terms</a></li>
            <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary" href="#">Cookie Policy</a></li>
            <li><a className="hover:text-primary" href="#">Animal Welfare Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Payment Channels</h4>
          <div className="flex gap-2 flex-wrap">
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 Logo Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
            <span className="sr-only">Facebook</span>
            <Facebook className="w-5 h-5" />
          </a>
          <a className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
            <span className="sr-only">Instagram</span>
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
