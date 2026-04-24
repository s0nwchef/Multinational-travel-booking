// Sample analytics data for staff tour operator view
// Matches AnalyticsData model from design document

export const staffAnalytics = {
  revenueTrend: [
    { date: "2024-01", revenue: 12000000 },
    { date: "2024-02", revenue: 15000000 },
    { date: "2024-03", revenue: 18000000 },
    { date: "2024-04", revenue: 24580000 }
  ],
  
  bookingDistribution: [
    { tourName: "Tour Đà Nẵng - Hội An 3N2Đ", bookings: 45 },
    { tourName: "Tour Sapa Mùa Lúa Chín", bookings: 32 },
    { tourName: "Tour Phú Quốc 4N3Đ", bookings: 28 },
    { tourName: "Tour Nha Trang - Đà Lạt 5N4Đ", bookings: 24 },
    { tourName: "Tour Huế - Động Phong Nha 3N2Đ", bookings: 18 },
    { tourName: "Tour Hạ Long - Tuần Châu 2N1Đ", bookings: 36 },
    { tourName: "Tour Mộc Châu - Mai Châu 3N2Đ", bookings: 12 },
    { tourName: "Tour Cần Thơ - Chợ Nổi Cái Răng 2N1Đ", bookings: 15 },
    { tourName: "Tour Quy Nhơn - Kỳ Co 3N2Đ", bookings: 10 },
    { tourName: "Tour Đồng Tháp - Vườn Quốc Gia Tràm Chim", bookings: 8 }
  ],
  
  customerDemographics: [
    { ageGroup: "18-25", percentage: 25 },
    { ageGroup: "26-35", percentage: 40 },
    { ageGroup: "36-45", percentage: 20 },
    { ageGroup: "46-55", percentage: 10 },
    { ageGroup: "56+", percentage: 5 }
  ],
  
  tourPerformance: [
    {
      tourName: "Tour Đà Nẵng - Hội An 3N2Đ",
      revenue: 20250000,
      bookings: 45,
      rating: 4.8
    },
    {
      tourName: "Tour Hạ Long - Tuần Châu 2N1Đ",
      revenue: 10080000,
      bookings: 36,
      rating: 4.8
    },
    {
      tourName: "Tour Phú Quốc 4N3Đ",
      revenue: 19040000,
      bookings: 28,
      rating: 4.9
    },
    {
      tourName: "Tour Nha Trang - Đà Lạt 5N4Đ",
      revenue: 18000000,
      bookings: 24,
      rating: 4.7
    },
    {
      tourName: "Tour Sapa Mùa Lúa Chín",
      revenue: 10240000,
      bookings: 32,
      rating: 4.6
    },
    {
      tourName: "Tour Huế - Động Phong Nha 3N2Đ",
      revenue: 7560000,
      bookings: 18,
      rating: 4.6
    },
    {
      tourName: "Tour Cần Thơ - Chợ Nổi Cái Răng 2N1Đ",
      revenue: 3750000,
      bookings: 15,
      rating: 4.5
    },
    {
      tourName: "Tour Mộc Châu - Mai Châu 3N2Đ",
      revenue: 4200000,
      bookings: 12,
      rating: 4.4
    },
    {
      tourName: "Tour Quy Nhơn - Kỳ Co 3N2Đ",
      revenue: 3800000,
      bookings: 10,
      rating: 4.7
    },
    {
      tourName: "Tour Đồng Tháp - Vườn Quốc Gia Tràm Chim",
      revenue: 1760000,
      bookings: 8,
      rating: 4.4
    }
  ]
};

// Additional analytics data for charts
export const monthlyRevenueData = [
  { month: "Tháng 1", revenue: 12000000, bookings: 45 },
  { month: "Tháng 2", revenue: 15000000, bookings: 56 },
  { month: "Tháng 3", revenue: 18000000, bookings: 68 },
  { month: "Tháng 4", revenue: 24580000, bookings: 92 },
  { month: "Tháng 5", revenue: 21000000, bookings: 78 },
  { month: "Tháng 6", revenue: 19500000, bookings: 72 },
  { month: "Tháng 7", revenue: 23000000, bookings: 85 },
  { month: "Tháng 8", revenue: 26500000, bookings: 98 },
  { month: "Tháng 9", revenue: 24000000, bookings: 88 },
  { month: "Tháng 10", revenue: 28000000, bookings: 102 },
  { month: "Tháng 11", revenue: 31000000, bookings: 115 },
  { month: "Tháng 12", revenue: 35000000, bookings: 128 }
];

export const bookingStatusDistribution = [
  { status: "confirmed", count: 85, percentage: 55 },
  { status: "pending", count: 25, percentage: 16 },
  { status: "completed", count: 35, percentage: 22 },
  { status: "cancelled", count: 10, percentage: 7 }
];

export const customerTypeDistribution = [
  { type: "regular", count: 65, percentage: 42 },
  { type: "prospect", count: 40, percentage: 26 },
  { type: "new", count: 50, percentage: 32 }
];

export const destinationPopularity = [
  { destination: "Đà Nẵng", bookings: 45, revenue: 20250000 },
  { destination: "Hạ Long", bookings: 36, revenue: 10080000 },
  { destination: "Phú Quốc", bookings: 28, revenue: 19040000 },
  { destination: "Nha Trang", bookings: 24, revenue: 18000000 },
  { destination: "Sapa", bookings: 32, revenue: 10240000 },
  { destination: "Huế", bookings: 18, revenue: 7560000 },
  { destination: "Cần Thơ", bookings: 15, revenue: 3750000 },
  { destination: "Đà Lạt", bookings: 20, revenue: 9000000 },
  { destination: "Hội An", bookings: 30, revenue: 13500000 },
  { destination: "Quy Nhơn", bookings: 10, revenue: 3800000 }
];