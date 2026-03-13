import React, { useState } from 'react';
import { Star, MapPin, Calendar, Users, Clock } from 'lucide-react';

const OrderSummary = ({ tour }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const basePrice = tour?.price || 2400;
  const serviceFee = 45;
  const tax = 0;
  const discountAmount = discount;
  const totalAmount = basePrice + serviceFee + tax - discountAmount;

  const handleApplyPromo = () => {
    // Simulated promo code validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(basePrice * 0.1);
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(basePrice * 0.2);
    } else {
      setDiscount(0);
      alert('Invalid promo code');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-6">
      {/* Tour Card */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Tour Image */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 overflow-hidden">
          <img
            src={tour?.image || 'https://images.unsplash.com/photo-1540959375944-7049f642d455?w=400&h=300&fit=crop'}
            alt={tour?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tour Info */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {tour?.name || 'Essential Japan: Tokyo, Kyoto & Osaka'}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{tour?.location || 'Tokyo, Japan'}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span className="text-gray-900 dark:text-white font-medium">
                {tour?.rating || 4.9}
              </span>
              <span>({tour?.reviews || 1204} reviews)</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{tour?.dates || 'Oct 12 - Oct 21, 2024'}</span>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{tour?.guests || '2 Adults'}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{tour?.duration || '10 Days'}</span>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Ad Price(s)</span>
          <span className="text-gray-900 dark:text-white font-medium">${basePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
          <span className="text-gray-900 dark:text-white font-medium">${serviceFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Taxes (included)</span>
          <span className="text-green-600 font-medium">${tax}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Discount</span>
            <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Promo Code Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Try: SAVE10 or SAVE20
        </p>
      </div>

      {/* Total Amount */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-orange-600">
          ${totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Complete Booking Button */}
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-colors">
        Complete Booking
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Terms and Conditions */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
        By clicking you agree to our <a href="#" className="text-orange-600 hover:underline">Terms & Conditions</a>
      </p>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure Secured</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
