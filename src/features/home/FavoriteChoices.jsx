import React from 'react';
import { MapPin, Heart, Star, ArrowRight } from 'lucide-react';

export default function FavoriteChoices() {
  const choices = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop', // Tokyo Skytree
      location: 'Tokyo, Japan',
      title: 'Tokyo Skytree Ticket with Tembo Deck & Galleria',
      rating: 4.7,
      reviews: '25k+',
      originalPrice: 'US$ 25.00',
      price: 'US$ 18.50',
      badge: 'BESTSELLER',
      badgeColor: 'bg-primary'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop', // Eiffel Tower
      location: 'Paris, France',
      title: 'Eiffel Tower Direct Access Tour with Summit',
      rating: 4.5,
      reviews: '12k+',
      price: 'US$ 45.00'
    },
    {
      id: 3,
      image: '/homepage/singapore.jpg', // Singapore
      location: 'Singapore',
      title: 'Universal Studios Singapore One-Day Ticket',
      rating: 4.8,
      reviews: '30k+',
      originalPrice: 'US$ 70.00',
      price: 'US$ 62.00',
      badge: 'INSTANT CONFIRMATION',
      badgeColor: 'bg-green-500'
    },
    {
      id: 4,
      image: '/homepage/Taj Maha.jpg', // Taj Mahal
      location: 'Agra, India',
      title: 'Taj Mahal Skip-the-Line Ticket with Guide',
      rating: 4.6,
      reviews: '8k+',
      price: 'US$ 15.00'
    }
  ];

  return (
    <section className="bg-[#EAEAEA] dark:bg-surface-dark rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Travelers' favorite choices</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
          See more <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {choices.map((choice) => (
          <div key={choice.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48">
              <img src={choice.image} alt={choice.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {choice.badge && (
                <div className={`absolute top-3 left-3 ${choice.badgeColor} text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider`}>
                  {choice.badge}
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-2">
                <MapPin className="w-3 h-3" />
                <span>{choice.location}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 flex-grow">{choice.title}</h3>
              
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{choice.rating}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({choice.reviews} reviews)</span>
              </div>
              
              <div className="flex items-end justify-between mt-auto">
                <div>
                  {choice.originalPrice && (
                    <div className="text-xs text-gray-400 line-through mb-0.5">{choice.originalPrice}</div>
                  )}
                  <div className="font-bold text-lg text-gray-900 dark:text-white">{choice.price}</div>
                </div>
                <button className="text-primary hover:bg-orange-50 p-1.5 rounded-full transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
