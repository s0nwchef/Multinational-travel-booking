import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelerDetails from '../features/checkout/TravelerDetails';
import PaymentDetails from '../features/checkout/PaymentDetails';
import OrderSummary from '../features/checkout/OrderSummary';
import tourService from '../services/tourService.js';
import bookingService from '../services/bookingService.js';
import authService from '../services/authService.js';

const formatDepartureDate = (value) => {
  if (!value) return 'Flexible dates';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Flexible dates';

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const normalizeTour = (data) => {
  const source = data?.tour ?? data ?? {};
  const destination = source.id_diem_den || source.destinationId || null;
  const departures = Array.isArray(source.lich_khoi_hanh) ? source.lich_khoi_hanh : [];

  return {
    id: source._id || source.id,
    slug: source.slug || source._id || source.id,
    title: source.ten_tour || source.title || 'Untitled Tour',
    description: source.mo_ta || source.description || '',
    location: destination?.thanh_pho || destination?.name || source.location || '',
    image: source.anh_dai_dien || source.imageUrl || (Array.isArray(source.danh_sach_anh) ? source.danh_sach_anh[0] : ''),
    rating: source.diem_trung_binh ?? source.averageRating ?? source.rating ?? 0,
    reviews: source.so_luong_danh_gia ?? source.totalReviews ?? source.reviewCount ?? 0,
    duration: source.so_ngay ?? source.duration ?? source.days ?? 0,
    price: source.gia_nguoi_lon ?? source.basePrice ?? source.price ?? 0,
    departures,
  };
};

const CheckoutPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [travelerData, setTravelerData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [promoData, setPromoData] = useState({ code: '', discount: 0, coupon: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchTour = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTourById(tourId);
        const normalized = normalizeTour(data);

        if (mounted) setTour(normalized);

        const firstAvailable = normalized.departures.find((item) => item.trang_thai === 'available') || normalized.departures[0];
        if (mounted && firstAvailable) {
          setSelectedScheduleId(firstAvailable._id || firstAvailable.id || '');
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Không thể tải thông tin tour');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTour();
    return () => { mounted = false; };
  }, [tourId]);

  const handleTravelerDataChange = (data) => setTravelerData(data);
  const handlePaymentDataChange = (data) => setPaymentData(data);
  const handlePromoChange = (data) => setPromoData(data || { code: '', discount: 0, coupon: null });

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

    // Validate required fields according to DatTour schema
    const fullName = travelerData.fullName?.trim() || '';
    if (!fullName) {
      setError('Vui lòng nhập họ và tên người liên hệ');
      return;
    }
    if (!travelerData.email) {
      setError('Vui lòng nhập email liên hệ');
      return;
    }
    if (!travelerData.phone) {
      setError('Vui lòng nhập số điện thoại liên hệ');
      return;
    }

    // scheduleId is required for booking (LichKhoiHanh._id)
    const scheduleId = selectedScheduleId;
    if (!scheduleId) {
      setError('Vui lòng chọn lịch khởi hành');
      return;
    }

    // Build travelers array per server expectation
    const travelers = [];
    // Use counts if provided, otherwise at least one traveler from contact info
    const adultsCount = Math.max(1, parseInt(travelerData.adults || 1));
    const childrenCount = Math.max(0, parseInt(travelerData.children || 0));

    // Push one contact traveler derived from contact info
    travelers.push({
      fullName: fullName,
      dateOfBirth: travelerData.dateOfBirth || '2000-01-01',
      gender: travelerData.gender || 'other',
      age: 30
    });

    // Add placeholder additional travelers if counts indicate more
    for (let i = 1; i < adultsCount; i++) {
      travelers.push({ fullName: `Adult ${i + 1}`, dateOfBirth: '2000-01-01', gender: 'other', age: 30 });
    }
    for (let i = 0; i < childrenCount; i++) {
      travelers.push({ fullName: `Child ${i + 1}`, dateOfBirth: '2018-01-01', gender: 'other', age: 6 });
    }

    try {
      setSubmitting(true);
      const payload = {
        customerName: fullName,
        email: travelerData.email,
        phone: travelerData.phone,
        itemId: scheduleId,
        travelers,
        promoCode: promoData.code,
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
  if (!tour) return <div className="py-12 text-center">Không tìm thấy tour.</div>;

  const isValidationMessage = error.toLowerCase().startsWith('vui lòng');

  const selectedSchedule = tour.departures.find((item) => (item._id || item.id) === selectedScheduleId);

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

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className={`rounded-xl border px-4 py-3 text-sm ${isValidationMessage ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-red-200 bg-red-50 text-red-700'}`}>
            <span className="font-semibold mr-2">
              {isValidationMessage ? 'Vui lòng nhập đủ thông tin:' : 'Không thể tiếp tục:'}
            </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">0</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Departure Date</h2>
              </div>

              {tour.departures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.departures.map((departure) => {
                    const departureId = departure._id || departure.id;
                    const isActive = departureId === selectedScheduleId;
                    return (
                      <button
                        key={departureId}
                        type="button"
                        onClick={() => setSelectedScheduleId(departureId)}
                        className={`text-left rounded-xl border p-4 transition-all ${isActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatDepartureDate(departure.ngay_khoi_hanh || departure.ngayKhoiHanh)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Return: {formatDepartureDate(departure.ngay_ve || departure.ngayVe)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(departure.gia_nguoi_lon || tour.price)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{(departure.tong_cho || 0) - (departure.cho_da_dat || 0)} seats left</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No available departure dates for this tour yet.</p>
              )}

              {selectedSchedule && (
                <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 p-4 text-sm text-gray-700 dark:text-gray-300">
                  Selected: {formatDepartureDate(selectedSchedule.ngay_khoi_hanh || selectedSchedule.ngayKhoiHanh)}
                </div>
              )}
            </div>

            <TravelerDetails onFormChange={handleTravelerDataChange} />
            <PaymentDetails onPaymentChange={handlePaymentDataChange} />
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary 
              tour={tour} 
              selectedSchedule={selectedSchedule}
              travelerData={travelerData}
              onPromoChange={handlePromoChange}
              onCompleteBooking={handleCompleteBooking} 
              submitting={submitting} 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
