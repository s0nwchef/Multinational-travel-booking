import React from 'react';
import { Calendar, RotateCcw, CreditCard, User } from 'lucide-react';

const HelpCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'Booking & Cancellations',
      description: 'Manage your trips and dates',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      title: 'Refunds',
      description: 'Check status and policies',
      icon: RotateCcw,
      color: 'from-green-400 to-green-600',
    },
    {
      id: 3,
      title: 'Payment Issues',
      description: 'Invoices and methods',
      icon: CreditCard,
      color: 'from-orange-400 to-orange-600',
    },
    {
      id: 4,
      title: 'My Account',
      description: 'Profile and security',
      icon: User,
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Quick Help Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`bg-gradient-to-br ${category.color} p-4 rounded-full mb-4 text-white`}
                >
                  <Icon size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HelpCategories;
