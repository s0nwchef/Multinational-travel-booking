import React, { useState } from 'react';
import { Star, MapPin, Calendar, Users, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const OrderSummary = ({ tour, selectedSchedule, travelerData, onPromoChange, onCompleteBooking, submitting }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');

  // Calculate price dynamically based on selected schedule and travelers
  const adultsCount = Math.max(1, parseInt(travelerData?.adults || 1));
  const childrenCount = Math.max(0, parseInt(travelerData?.children || 0));
  
  const adultPrice = selectedSchedule?.gia_nguoi_lon || tour?.price || 2400;
  const childPrice = selectedSchedule?.gia_tre_em || 1500;
  
  const basePrice = (adultsCount * adultPrice) + (childrenCount * childPrice);
  const serviceFee = Math.round(basePrice * 0.02);
  const tax = 0;
  const totalBeforeDiscount = basePrice + serviceFee + tax;
  const calculateCouponDiscount = (coupon, amount) => {
    if (!coupon) return 0;

    if (coupon.discountType === 'phan_tram') {
      const percentageDiscount = (amount * Number(coupon.discountValue || 0)) / 100;
      const maxDiscount = Number(coupon.maxDiscount);
      if (Number.isFinite(maxDiscount) && maxDiscount > 0) {
        return Math.min(percentageDiscount, maxDiscount);
      }
      return percentageDiscount;
    }

    return Math.min(Number(coupon.discountValue || 0), amount);
  };

  const discountAmount = calculateCouponDiscount(appliedCoupon, totalBeforeDiscount);
  const totalAmount = Math.max(0, basePrice + serviceFee + tax - discountAmount);
  const pointsEarned = Math.floor(totalAmount / 10);

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    try {
      const session = JSON.parse(localStorage.getItem('travel_session'));
      if (session?.sessionId) {
        headers.Authorization = session.sessionId;
      }
    } catch {
      // Ignore malformed sessions.
    }
    return headers;
  };

  const validatePromo = async (code) => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setAppliedCoupon(null);
      setPromoMessage('');
      onPromoChange?.({ code: '', discount: 0, coupon: null });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code: normalizedCode, totalAmount }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data.message || 'Mã giảm giá không hợp lệ');
      }

      const coupon = data.coupon || null;
      const nextDiscount = calculateCouponDiscount(coupon, totalBeforeDiscount);
      setAppliedCoupon(coupon);
      setPromoMessage(`Áp dụng ${data.coupon?.ma || normalizedCode} thành công`);
      onPromoChange?.({ code: data.coupon?.ma || normalizedCode, discount: nextDiscount, coupon });
    } catch (error) {
      setAppliedCoupon(null);
      setPromoMessage(error.message || 'Không thể xác thực mã giảm giá');
      onPromoChange?.({ code: '', discount: 0, coupon: null, error: error.message });
    }
  };

  const handleApplyPromo = () => {
    void validatePromo(promoCode);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-6">
      {/* Tour Card */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Tour Image */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4 overflow-hidden">
          <img
            src={tour?.image || 'https://images.unsplash.com/photo-1540959375944-7049f642d455?w=400&h=300&fit=crop'}
            alt={tour?.title || tour?.name || 'Tour'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tour Info */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {tour?.title || tour?.name || 'Tour details'}
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
            <span>
              {selectedSchedule?.ngay_khoi_hanh 
                ? new Date(selectedSchedule.ngay_khoi_hanh).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Select date'}
              {selectedSchedule?.ngay_ve && (
                <> - {new Date(selectedSchedule.ngay_ve).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
              )}
            </span>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{adultsCount} Adult{adultsCount > 1 ? 's' : ''}{childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : ''}</span>
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
        {adultsCount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Adults ({adultsCount} × ${adultPrice})</span>
            <span className="text-gray-900 dark:text-white font-medium">${(adultsCount * adultPrice).toLocaleString('en-US')}</span>
          </div>
        )}
        {childrenCount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Children ({childrenCount} × ${childPrice})</span>
            <span className="text-gray-900 dark:text-white font-medium">${(childrenCount * childPrice).toLocaleString('en-US')}</span>
          </div>
        )}
        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white font-medium">${basePrice.toLocaleString('en-US')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Service Fee (2%)</span>
          <span className="text-gray-900 dark:text-white font-medium">${serviceFee.toLocaleString('en-US')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Taxes</span>
          <span className="text-green-600 font-medium">${tax}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Discount</span>
            <span className="text-green-600 font-medium">-${discountAmount.toLocaleString('en-US')}</span>
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
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleApplyPromo}
            type="button"
            className="px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {promoMessage || 'Promo code is validated from the ma_giam_gia table'}
        </p>
      </div>

      {/* Total Amount */}
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-orange-600">
          ${totalAmount.toLocaleString('en-US')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Points Earned: {pointsEarned}
        </p>
      </div>

      {/* Complete Booking Button */}
      <button
        type="button"
        onClick={() => onCompleteBooking?.()}
        disabled={submitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mb-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Processing...' : 'Complete Booking'}
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
