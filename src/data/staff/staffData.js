// Main export file for staff tour operator view data
// Re-exports all staff-related data for easy importing

export { staffTours, dashboardMetrics } from './staffTours.js';
export { staffBookings, recentBookings } from './staffBookings.js';
export { staffCustomers } from './staffCustomers.js';
export { 
  staffAnalytics, 
  monthlyRevenueData, 
  bookingStatusDistribution, 
  customerTypeDistribution,
  destinationPopularity 
} from './staffAnalytics.js';

// Combined data for dashboard
export const staffDashboardData = {
  metrics: [
    {
      title: "Tổng số tour",
      value: 10,
      icon: "MapPin",
      color: "orange",
      trend: "+12%"
    },
    {
      title: "Tổng số booking",
      value: 15,
      icon: "Calendar",
      color: "blue",
      trend: "+8%"
    },
    {
      title: "Tổng doanh thu",
      value: "79.5M",
      icon: "DollarSign",
      color: "green",
      trend: "+15%"
    },
    {
      title: "Đánh giá trung bình",
      value: "3.7",
      icon: "Star",
      color: "purple",
      trend: "+0.2"
    }
  ],
  recentBookings: [
    {
      id: "BK001",
      customerName: "Nguyễn Văn A",
      tourName: "Tour Đà Nẵng - Hội An 3N2Đ",
      bookingDate: "2024-03-15",
      status: "confirmed",
      amount: 4500000
    },
    {
      id: "BK002",
      customerName: "Trần Thị B",
      tourName: "Tour Phú Quốc 4N3Đ",
      bookingDate: "2024-03-10",
      status: "pending",
      amount: 6800000
    },
    {
      id: "BK003",
      customerName: "Lê Văn C",
      tourName: "Tour Hạ Long - Tuần Châu 2N1Đ",
      bookingDate: "2024-03-05",
      status: "completed",
      amount: 2800000
    },
    {
      id: "BK004",
      customerName: "Phạm Thị D",
      tourName: "Tour Nha Trang - Đà Lạt 5N4Đ",
      bookingDate: "2024-02-28",
      status: "cancelled",
      amount: 7500000
    },
    {
      id: "BK005",
      customerName: "Hoàng Văn E",
      tourName: "Tour Đà Nẵng - Hội An 3N2Đ",
      bookingDate: "2024-03-12",
      status: "confirmed",
      amount: 4500000
    },
    {
      id: "BK006",
      customerName: "Vũ Thị F",
      tourName: "Tour Cần Thơ - Chợ Nổi Cái Răng 2N1Đ",
      bookingDate: "2024-03-08",
      status: "completed",
      amount: 2500000
    },
    {
      id: "BK007",
      customerName: "Đặng Văn G",
      tourName: "Tour Quy Nhơn - Kỳ Co 3N2Đ",
      bookingDate: "2024-03-01",
      status: "pending",
      amount: 3800000
    },
    {
      id: "BK008",
      customerName: "Bùi Thị H",
      tourName: "Tour Hạ Long - Tuần Châu 2N1Đ",
      bookingDate: "2024-02-25",
      status: "completed",
      amount: 5600000
    },
    {
      id: "BK009",
      customerName: "Ngô Văn I",
      tourName: "Tour Phú Quốc 4N3Đ",
      bookingDate: "2024-02-20",
      status: "confirmed",
      amount: 13600000
    },
    {
      id: "BK010",
      customerName: "Trịnh Thị K",
      tourName: "Tour Nha Trang - Đà Lạt 5N4Đ",
      bookingDate: "2024-02-15",
      status: "cancelled",
      amount: 7500000
    }
  ],
  upcomingTours: [
    {
      id: "TOUR001",
      name: "Tour Đà Nẵng - Hội An 3N2Đ",
      date: "2024-04-10",
      seats: 15,
      status: "active"
    },
    {
      id: "TOUR003",
      name: "Tour Phú Quốc 4N3Đ",
      date: "2024-05-15",
      seats: 8,
      status: "active"
    },
    {
      id: "TOUR006",
      name: "Tour Hạ Long - Tuần Châu 2N1Đ",
      date: "2024-03-25",
      seats: 5,
      status: "active"
    },
    {
      id: "TOUR004",
      name: "Tour Nha Trang - Đà Lạt 5N4Đ",
      date: "2024-04-20",
      seats: 12,
      status: "active"
    },
    {
      id: "TOUR009",
      name: "Tour Quy Nhơn - Kỳ Co 3N2Đ",
      date: "2024-04-15",
      seats: 7,
      status: "active"
    }
  ]
};