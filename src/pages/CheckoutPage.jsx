import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelerDetails from '../features/checkout/TravelerDetails';
import PaymentDetails from '../features/checkout/PaymentDetails';
import OrderSummary from '../features/checkout/OrderSummary';

const CheckoutPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [travelerData, setTravelerData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  // Mock tour data - in a real app, this would come from props or API
  const mockTour = {
    id: tourId || 'japan-essential',
    name: 'Essential Japan: Tokyo, Kyoto & Osaka',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642d455?w=500&h=400&fit=crop',
    rating: 4.9,
    reviews: 1204,
    dates: 'Oct 12 - Oct 21, 2024',
    guests: '2 Adults',
    duration: '10 Days',
    price: 2400
  };

  const handleTravelerDataChange = (data) => {
    setTravelerData(data);
  };

  const handlePaymentDataChange = (data) => {
    setPaymentData(data);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to tour details
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>Tours</span>
            <span>/</span>
            <span>Japan</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Confirm and Pay</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <TravelerDetails onFormChange={handleTravelerDataChange} />
            <PaymentDetails onPaymentChange={handlePaymentDataChange} />
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary tour={mockTour} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
