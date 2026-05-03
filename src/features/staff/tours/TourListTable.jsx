import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import TourStatusBadge from './TourStatusBadge';

const TourListTable = ({ tours, onEdit, onDelete }) => {
  const formatCurrency = (price) => {
    if (!price) return 'Contact';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getCategoryBadge = (category) => {
    const colors = {
      adventure: 'bg-orange-100 text-orange-800',
      cultural: 'bg-purple-100 text-purple-800',
      relaxation: 'bg-blue-100 text-blue-800',
      family: 'bg-green-100 text-green-800',
      luxury: 'bg-yellow-100 text-yellow-800',
      nature: 'bg-emerald-100 text-emerald-800',
      city_tour: 'bg-pink-100 text-pink-800',
      food: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Map API data to table format
  const mappedTours = tours.map(tour => ({
    id: tour._id || tour.id,
    name: tour.title || tour.name,
    status: tour.status,
    price: tour.basePrice || tour.price,
    category: tour.category || '-',
    startDate: tour.startDate || '-',
    endDate: tour.endDate || '-',
    bookings: tour.totalBookings || tour.bookings || 0,
    rating: tour.averageRating || tour.rating || 0,
    destination: tour.destinationId?.name || tour.destination || '-',
    duration: tour.duration || 1,
    createdAt: tour.createdAt
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tour Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Price</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Travel Dates</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Bookings</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Rating</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Destination</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mappedTours.map((tour) => (
            <tr 
              key={tour.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{tour.name}</p>
                  <p className="text-sm text-gray-500">{tour.duration} day(s)</p>
                </div>
              </td>
              <td className="py-3 px-4">
                {tour.category !== '-' ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(tour.category)}`}>
                    {tour.category}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
              <td className="py-3 px-4">
                <TourStatusBadge status={tour.status} />
              </td>
              <td className="py-3 px-4">
                <p className="font-semibold text-gray-900">{formatCurrency(tour.price)}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600 text-sm">
                  {tour.startDate !== '-' && tour.endDate !== '-' 
                    ? `${formatDate(tour.startDate)} - ${formatDate(tour.endDate)}`
                    : '-'
                  }
                </p>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{tour.bookings}</span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                {tour.rating > 0 ? (
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${getRatingColor(tour.rating)}`}>
                    <span className="text-sm font-semibold">{tour.rating.toFixed(1)}</span>
                    <span className="text-xs">★</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No rating</span>
                )}
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600">{tour.destination}</p>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit?.(tour.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(tour.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {mappedTours.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-500">Try changing your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TourListTable;