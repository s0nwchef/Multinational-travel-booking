import React, { useState } from 'react';
import { Eye, Mail, Phone, Calendar, User, MapPin, Check } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingListTable = ({ bookings, onUpdateStatus }) => {
  const [showStatusModal, setShowStatusModal] = useState(null);

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = (bookingId) => {
    console.log('View booking details:', bookingId);
  };

  const handleContactCustomer = (customerEmail) => {
    console.log('Contact customer:', customerEmail);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    onUpdateStatus?.(bookingId, newStatus);
    setShowStatusModal(null);
  };

  // Map API data to table format
  const mappedBookings = bookings.map(booking => ({
    id: booking._id || booking.id,
    bookingNumber: booking.bookingReference || booking.bookingNumber || `BK-${booking._id?.slice(-6)}`,
    customerName: booking.userId?.fullName || booking.customerName || 'Customer',
    customerEmail: booking.userId?.email || booking.customerEmail || '-',
    tourName: booking.tourId?.title || booking.tourName || '-',
    bookingDate: booking.bookingDate || booking.createdAt,
    travelDate: booking.travelDate || '-',
    status: booking.status,
    totalAmount: booking.totalAmount,
    numberOfTravelers: booking.travelers?.length || booking.numberOfTravelers || 1,
    paymentMethod: booking.paymentMethod || 'Credit Card'
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Booking #</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tour</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Book Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Total</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappedBookings.map((booking) => (
            <tr 
              key={booking.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">BK</span>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">{booking.bookingNumber}</p>
                    <p className="text-xs text-gray-500">{booking.numberOfTravelers} traveler(s)</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.customerEmail}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{booking.tourName}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{formatDate(booking.bookingDate)}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                  <p className="text-xs text-gray-500">{booking.paymentMethod}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleViewDetails(booking.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleContactCustomer(booking.customerEmail)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Contact Customer"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(booking.id)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Update Status"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="space-y-2">
              {['confirmed', 'pending', 'cancelled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(showStatusModal, status)}
                  className="w-full p-3 text-left rounded-xl border hover:border-orange-500 hover:bg-orange-50 transition-colors capitalize"
                >
                  {status === 'confirmed' && '✅ Confirmed'}
                  {status === 'pending' && '⏳ Pending'}
                  {status === 'cancelled' && '❌ Cancelled'}
                  {status === 'completed' && '🎉 Completed'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(null)}
              className="mt-4 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {mappedBookings.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">Try changing your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default BookingListTable;