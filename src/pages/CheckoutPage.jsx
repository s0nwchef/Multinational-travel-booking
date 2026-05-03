import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelerDetails from '../features/checkout/TravelerDetails';
import PaymentDetails from '../features/checkout/PaymentDetails';
import OrderSummary from '../features/checkout/OrderSummary';
import tourService from '../services/tourService.js';
import bookingService from '../services/bookingService.js';
import authService from '../services/authService.js';

const CheckoutPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [travelerData, setTravelerData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTourById(tourId);
        const normalized = {
          id: data._id || data.id,
          name: data.title || data.name || 'Untitled Tour',
          location: data.destinationId?.name || data.location || '',
          image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : data.imageUrl || '',
          rating: data.averageRating || data.rating || 0,
          reviews: data.totalReviews || data.reviewCount || 0,
          dates: data.dates || '',
          guests: '1 Adult',
          duration: data.duration || data.days || '',
          price: data.basePrice || data.price || 0,
        };

        if (mounted) setTour(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Không thể tải thông tin tour');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTour();
    return () => { mounted = false; };
  }, [tourId]);

  const handleTravelerDataChange = (data) => setTravelerData(data);
  const handlePaymentDataChange = (data) => setPaymentData(data);

  const handleBackClick = () => navigate(-1);

  const normalizePaymentMethod = (method) => {
    if (method === 'creditCard') return 'credit_card';
    if (method === 'paypal') return 'paypal';
    if (method === 'payLater') return 'bank_transfer';
    return 'credit_card';
  };

  const handleCompleteBooking = async () => {
    if (!authService.isAuthenticated()) {
      navigate(`/home?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userId: authService.getCurrentUser()?._id,
        bookingType: 'tour',
        tourId: tour.id,
        itemId: tour.id,
        customerName: `${travelerData.firstName || ''} ${travelerData.lastName || ''}`.trim(),
        travelers: [{ fullName: `${travelerData.firstName || ''} ${travelerData.lastName || ''}`.trim(), age: 30 }],
        baseFare: tour.price,
        totalAmount: tour.price,
        grandTotal: tour.price,
        paymentStatus: 'paid',
        paymentHistory: [{ transactionId: `txn_${Date.now()}`, amount: tour.price, method: normalizePaymentMethod(paymentData.method), status: 'success' }],
        status: 'confirmed'
      };

      await bookingService.createBooking(payload);
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking failed', err);
      setError(err.message || 'Không thể tạo booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Đang tải thông tin tour...</div>;
  if (error) return <div className="py-12 text-center text-red-500">Lỗi: {error}</div>;
  if (!tour) return <div className="py-12 text-center">Không tìm thấy tour.</div>;

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
            <span>{tour.location}</span>
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
            <OrderSummary tour={tour} onCompleteBooking={handleCompleteBooking} submitting={submitting} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
