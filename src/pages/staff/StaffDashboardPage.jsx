import React from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import MetricCard from '../../features/staff/dashboard/MetricCard';
import RecentBookingsTable from '../../features/staff/dashboard/RecentBookingsTable';
import UpcomingToursCalendar from '../../features/staff/dashboard/UpcomingToursCalendar';
import QuickStats from '../../features/staff/dashboard/QuickStats';

const StaffDashboardPage = () => {
  const dashboardMetrics = [
    {
      title: "Tổng số tour",
      value: 42,
      icon: MapPin,
      color: "orange",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Tổng số booking",
      value: 156,
      icon: Calendar,
      color: "blue",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Tổng doanh thu",
      value: "$24,580",
      icon: DollarSign,
      color: "green",
      trend: "+15%",
      trendUp: true
    },
    {
      title: "Đánh giá trung bình",
      value: "4.7",
      icon: Star,
      color: "purple",
      trend: "+0.2",
      trendUp: true
    }
  ];

  const recentBookings = [
    {
      id: "BK001",
      customerName: "Nguyễn Văn A",
      tourName: "Tour Đà Nẵng - Hội An",
      bookingDate: "2024-03-15",
      status: "confirmed",
      amount: 450
    },
    {
      id: "BK002",
      customerName: "Trần Thị B",
      tourName: "Tour Sapa Mùa Lúa Chín",
      bookingDate: "2024-03-14",
      status: "pending",
      amount: 320
    },
    {
      id: "BK003",
      customerName: "Lê Văn C",
      tourName: "Tour Phú Quốc 4N3Đ",
      bookingDate: "2024-03-13",
      status: "completed",
      amount: 680
    },
    {
      id: "BK004",
      customerName: "Phạm Thị D",
      tourName: "Tour Nha Trang - Đà Lạt",
      bookingDate: "2024-03-12",
      status: "confirmed",
      amount: 520
    },
    {
      id: "BK005",
      customerName: "Hoàng Văn E",
      tourName: "Tour Hạ Long - Cát Bà",
      bookingDate: "2024-03-11",
      status: "cancelled",
      amount: 380
    }
  ];

  const upcomingTours = [
    {
      id: "TOUR001",
      name: "Tour Đà Nẵng - Hội An",
      date: "2024-03-20",
      seats: 8,
      totalSeats: 20
    },
    {
      id: "TOUR002",
      name: "Tour Sapa Mùa Lúa Chín",
      date: "2024-03-22",
      seats: 15,
      totalSeats: 25
    },
    {
      id: "TOUR003",
      name: "Tour Phú Quốc 4N3Đ",
      date: "2024-03-25",
      seats: 5,
      totalSeats: 15
    },
    {
      id: "TOUR004",
      name: "Tour Nha Trang - Đà Lạt",
      date: "2024-03-28",
      seats: 12,
      totalSeats: 30
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Tổng quan về hoạt động tour và booking</p>
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
            onClick={() => console.log(`Navigate to ${metric.title}`)}
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
          <UpcomingToursCalendar tours={upcomingTours} />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booking gần đây</h2>
            <p className="text-gray-500">Các booking mới nhất trong 7 ngày qua</p>
          </div>
          <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <RecentBookingsTable bookings={recentBookings} />
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất tháng này</h3>
            <p className="text-gray-600">Doanh thu tăng 15% so với tháng trước</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-2xl font-bold text-green-600">+15%</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tour phổ biến nhất</p>
            <p className="font-semibold text-gray-900">Đà Nẵng - Hội An</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tỷ lệ hủy</p>
            <p className="font-semibold text-gray-900">3.2%</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Khách hàng mới</p>
            <p className="font-semibold text-gray-900">24</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Đánh giá trung bình</p>
            <p className="font-semibold text-gray-900">4.7/5.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;