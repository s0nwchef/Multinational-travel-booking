import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

const PaymentDetails = ({ onPaymentChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('creditCard');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Format card number with spaces
    let formattedValue = newValue;
    if (name === 'cardNumber' && type !== 'checkbox') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate' && type !== 'checkbox') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    }

    // Format CVV
    if (name === 'cvv' && type !== 'checkbox') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    const updated = { ...formData, [name]: formattedValue };
    setFormData(updated);
    onPaymentChange?.(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm">
          2
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Your payment information is encrypted and secure.
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-3">
          {/* Credit Card */}
          <button
            onClick={() => handleMethodChange('creditCard')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedMethod === 'creditCard'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-300'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium">Credit Card</span>
          </button>

          {/* PayPal */}
          <button
            onClick={() => handleMethodChange('paypal')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedMethod === 'paypal'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-300'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.008-.027.15a.806.806 0 0 1-.795.68h-2.61a.587.587 0 0 1-.58-.67l.04-.22.63-4.008.027-.15a.806.806 0 0 1 .794-.68h.5c3.236 0 5.773-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327-.6-.98-1.738-1.672-3.166-1.916.74-1.014 1.094-2.47.872-4.065-.216-1.595-1.24-2.71-2.705-3.004-1.466-.293-3.14.24-4.106 1.403-.966 1.162-.996 2.945.083 4.57-.49.244-1.626.936-2.226 1.916-.28.457-.456 1.024-.51 1.67-.054.646.056 1.368.328 2.15.544 1.56 1.796 2.672 3.417 2.965.188.344.456.693.794 1.042-2.22.244-4.446 1.162-5.51 3.15-.704 1.37-.94 3.035-.704 4.843.236 1.808 1.2 3.37 2.836 4.516 1.636 1.147 3.754 1.647 6.124 1.647 3.356 0 5.91-1.325 7.41-4.04 1.5-2.713 1.82-6.78.816-12.235-.524-2.89-1.85-4.89-3.7-6.06z"/>
            </svg>
            <span className="text-sm font-medium">PayPal</span>
          </button>

          {/* Pay Later */}
          <button
            onClick={() => handleMethodChange('payLater')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedMethod === 'payLater'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-300'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="text-sm font-medium">Pay Later</span>
          </button>
        </div>
      </div>

      {/* Credit Card Form */}
      {selectedMethod === 'creditCard' && (
        <>
          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="0000  0000  0000  0000"
              maxLength="19"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Expiry and CVV Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiration Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM / YY"
                maxLength="5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVC/CVV
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-gray-400 cursor-help"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  title="3 or 4 digit security code on the back of your card"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="Name as it appears on card"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Save Card Checkbox */}
          <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="w-4 h-4 border-gray-300 dark:border-gray-600 rounded cursor-pointer accent-orange-500"
            />
            <span>Save this card for future bookings securely</span>
          </label>
        </>
      )}

      {/* PayPal Message */}
      {selectedMethod === 'paypal' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      )}

      {/* Pay Later Message */}
      {selectedMethod === 'payLater' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            Pay later options will be displayed after you review your booking details.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
