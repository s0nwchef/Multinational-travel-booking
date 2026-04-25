import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
  Plus
} from 'lucide-react';
import MetricCard from '../../features/staff/dashboard/MetricCard';
import RecentBookingsTable from '../../features/staff/dashboard/RecentBookingsTable';
import UpcomingToursCalendar from '../../features/staff/dashboard/UpcomingToursCalendar';
import QuickStats from '../../features/staff/dashboard/QuickStats';
import staffService from '../../services/staffService.js';

const StaffDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await staffService.getDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Navigation handlers
  const handleToursClick = () => navigate('/staff/tours');
  const handleBookingsClick = () => navigate('/staff/bookings');
  const handleCustomersClick = () => navigate('/staff/customers');
  const handleAddTour = () => navigate('/staff/tours/new');
  const handleViewCalendar = () => navigate('/staff/tours');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <p className="mt-4 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Prepare metrics from dashboard data
  const dashboardMetrics = [
    {
      title: "Tổng số tour",
      value: dashboardData?.tourStats?.active || 0,
      icon: MapPin,
      color: "orange",
      trend: "+12%",
      trendUp: true,
      onClick: handleToursClick
    },
    {
      title: "Tổng số booking",
      value: Object.values(dashboardData?.bookingStats || {}).reduce((sum, stat) => sum + stat.count, 0),
      icon: Calendar,
      color: "blue",
      trend: "+8%",
      trendUp: true,
      onClick: handleBookingsClick
    },
    {
      title: "Tổng doanh thu",
      value: `${dashboardData?.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: "green",
      trend: "+15%",
      trendUp: true,
      onClick: handleBookingsClick
    },
    {
      title: "Khách hàng",
      value: dashboardData?.totalCustomers || 0,
      icon: Star,
      color: "purple",
      trend: "+5%",
      trendUp: true,
      onClick: handleCustomersClick
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Tổng quan về hoạt động tour và booking</p>
        </div>
        <button 
          onClick={handleAddTour}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm tour mới
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            color={metric.color}
            trend={metric.trend}
            trendUp={metric.trendUp}
            onClick={metric.onClick}
          />
        ))}
      </div>

      {/* Quick Stats and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2">
          <QuickStats />
        </div>

        {/* Upcoming Tours Calendar */}
        <div>
          <UpcomingToursCalendar tours={dashboardData?.upcomingTours || []} onViewAll={handleViewCalendar} />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booking gần đây</h2>
            <p className="text-gray-500">Các booking mới nhất trong 7 ngày qua</p>
          </div>
          <button 
            onClick={handleBookingsClick}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <RecentBookingsTable 
          bookings={dashboardData?.recentBookings || []} 
          onViewBooking={handleBookingsClick}
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất tháng này</h3>
            <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              {dashboardData?.totalRevenue > 0 ? '+15%' : '0%'}
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tour đang hoạt động</p>
            <p className="font-semibold text-gray-900">{dashboardData?.tourStats?.active || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Booking đã xác nhận</p>
            <p className="font-semibold text-gray-900">{dashboardData?.bookingStats?.confirmed?.count || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tổng khách hàng</p>
            <p className="font-semibold text-gray-900">{dashboardData?.totalCustomers || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Doanh thu tổng</p>
            <p className="font-semibold text-gray-900">${dashboardData?.totalRevenue?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;