// Sample tours data for staff tour operator view
// Matches Tour model from design document

export const staffTours = [
  {
    id: "TOUR001",
    name: "Tour Đà Nẵng - Hội An 3N2Đ",
    description: "Khám phá thành phố biển Đà Nẵng và phố cổ Hội An với trải nghiệm đầy đủ từ biển đến di sản.",
    destination: "Đà Nẵng, Hội An",
    duration: 3,
    price: 4500000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",
      "https://images.unsplash.com/photo-1583417311718-ef15f949cbaa",
      "https://images.unsplash.com/photo-1528127269322-539801943592"
    ],
    itinerary: [
      {
        day: 1,
        title: "Đà Nẵng - Bà Nà Hills",
        description: "Tham quan Cầu Vàng, làng Pháp, và vui chơi tại Fantasy Park."
      },
      {
        day: 2,
        title: "Hội An - Phố Cổ",
        description: "Khám phá phố cổ Hội An, thưởng thức ẩm thực địa phương."
      },
      {
        day: 3,
        title: "Biển Mỹ Khê - Về lại Hà Nội",
        description: "Tắm biển Mỹ Khê và shopping tại chợ Hàn."
      }
    ],
    inclusions: [
      "Khách sạn 3 sao",
      "Ăn sáng buffet",
      "Xe đưa đón",
      "Hướng dẫn viên tiếng Việt",
      "Bảo hiểm du lịch"
    ],
    exclusions: [
      "Chi phí cá nhân",
      "Đồ uống trong bữa ăn",
      "Vé tham quan ngoài chương trình"
    ],
    rating: 4.8,
    totalBookings: 3,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-20"
  },
  {
    id: "TOUR002",
    name: "Tour Sapa Mùa Lúa Chín",
    description: "Trải nghiệm vẻ đẹp của Sapa vào mùa lúa chín với những thửa ruộng bậc thang vàng óng.",
    destination: "Sapa, Lào Cai",
    duration: 2,
    price: 3200000,
    status: "draft",
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
      "https://images.unsplash.com/photo-1526392060635-9d6019884377"
    ],
    itinerary: [
      {
        day: 1,
        title: "Hà Nội - Sapa",
        description: "Di chuyển đến Sapa, tham quan thung lũng Mường Hoa."
      },
      {
        day: 2,
        title: "Fansipan - Bản Cát Cát",
        description: "Chinh phục Fansipan bằng cáp treo và tham quan bản Cát Cát."
      }
    ],
    inclusions: [
      "Khách sạn homestay",
      "Ăn sáng",
      "Vé cáp treo Fansipan",
      "Hướng dẫn viên địa phương"
    ],
    exclusions: [
      "Xe đưa đón từ Hà Nội",
      "Bữa trưa và tối",
      "Chi phí cá nhân"
    ],
    rating: 0,
    totalBookings: 0,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10"
  },
  {
    id: "TOUR003",
    name: "Tour Phú Quốc 4N3Đ",
    description: "Kỳ nghỉ biển đảo tại đảo ngọc Phú Quốc với resort 4 sao và các hoạt động giải trí đa dạng.",
    destination: "Phú Quốc, Kiên Giang",
    duration: 4,
    price: 6800000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ],
    itinerary: [
      {
        day: 1,
        title: "Đến Phú Quốc",
        description: "Nhận phòng resort, nghỉ ngơi và tắm biển."
      },
      {
        day: 2,
        title: "VinWonders & Safari",
        description: "Vui chơi tại VinWonders và tham quan Vinpearl Safari."
      },
      {
        day: 3,
        title: "Tour đảo Nam Du",
        description: "Khám phá các đảo nhỏ và lặn ngắm san hô."
      },
      {
        day: 4,
        title: "Mua sắm - Về lại",
        description: "Mua sắm tại chợ đêm Dương Đông và về lại."
      }
    ],
    inclusions: [
      "Resort 4 sao",
      "Ăn sáng buffet",
      "Vé VinWonders & Safari",
      "Tour đảo Nam Du",
      "Xe đưa đón sân bay"
    ],
    exclusions: [
      "Vé máy bay",
      "Bữa trưa và tối",
      "Chi phí cá nhân"
    ],
    rating: 4.9,
    totalBookings: 3,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-18"
  },
  {
    id: "TOUR004",
    name: "Tour Nha Trang - Đà Lạt 5N4Đ",
    description: "Hành trình kết hợp biển Nha Trang và cao nguyên Đà Lạt với khí hậu mát mẻ quanh năm.",
    destination: "Nha Trang, Đà Lạt",
    duration: 5,
    price: 7500000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368"
    ],
    itinerary: [
      {
        day: 1,
        title: "Nha Trang - Biển",
        description: "Nhận phòng khách sạn, tắm biển Nha Trang."
      },
      {
        day: 2,
        title: "Vinpearl Land",
        description: "Vui chơi cả ngày tại Vinpearl Land Nha Trang."
      },
      {
        day: 3,
        title: "Nha Trang - Đà Lạt",
        description: "Di chuyển đến Đà Lạt, tham quan thác Datanla."
      },
      {
        day: 4,
        title: "Đà Lạt City Tour",
        description: "Tham quan Hồ Xuân Hương, chợ Đà Lạt, biệt thự cổ."
      },
      {
        day: 5,
        title: "Đồi chè Cầu Đất - Về lại",
        description: "Tham quan đồi chè Cầu Đất và về lại."
      }
    ],
    inclusions: [
      "Khách sạn 3-4 sao",
      "Ăn sáng",
      "Vé Vinpearl Land",
      "Xe đưa đón",
      "Hướng dẫn viên"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Vé cáp treo"
    ],
    rating: 4.7,
    totalBookings: 2,
    createdAt: "2024-01-20",
    updatedAt: "2024-03-15"
  },
  {
    id: "TOUR005",
    name: "Tour Huế - Động Phong Nha 3N2Đ",
    description: "Khám phá cố đô Huế và hang động kỳ vĩ Phong Nha - Kẻ Bàng, di sản thiên nhiên thế giới.",
    destination: "Huế, Quảng Bình",
    duration: 3,
    price: 4200000,
    status: "archived",
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a"
    ],
    itinerary: [
      {
        day: 1,
        title: "Huế - Đại Nội",
        description: "Tham quan Đại Nội, chùa Thiên Mụ, sông Hương."
      },
      {
        day: 2,
        title: "Huế - Phong Nha",
        description: "Di chuyển đến Phong Nha, tham quan động Thiên Đường."
      },
      {
        day: 3,
        title: "Động Phong Nha - Về lại",
        description: "Tham quan động Phong Nha và về lại."
      }
    ],
    inclusions: [
      "Khách sạn 3 sao",
      "Ăn sáng",
      "Vé tham quan các điểm",
      "Xe đưa đón",
      "Hướng dẫn viên"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Thuê áo dài chụp ảnh"
    ],
    rating: 4.6,
    totalBookings: 0,
    createdAt: "2023-11-10",
    updatedAt: "2024-02-28"
  },
  {
    id: "TOUR006",
    name: "Tour Hạ Long - Tuần Châu 2N1Đ",
    description: "Trải nghiệm du thuyền trên vịnh Hạ Long và vui chơi tại đảo Tuần Châu.",
    destination: "Hạ Long, Quảng Ninh",
    duration: 2,
    price: 2800000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1528127269322-539801943592",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a"
    ],
    itinerary: [
      {
        day: 1,
        title: "Hạ Long - Du thuyền",
        description: "Lên du thuyền, tham quan hang Sửng Sốt, chèo kayak."
      },
      {
        day: 2,
        title: "Đảo Tuần Châu - Về lại",
        description: "Tham quan đảo Tuần Châu, xem biểu diễn cá heo."
      }
    ],
    inclusions: [
      "Du thuyền 3 sao",
      "Ăn 4 bữa trên tàu",
      "Vé tham quan",
      "Chèo kayak",
      "Bảo hiểm"
    ],
    exclusions: [
      "Đồ uống trên tàu",
      "Chi phí cá nhân",
      "Massage/spa"
    ],
    rating: 4.8,
    totalBookings: 3,
    createdAt: "2024-01-05",
    updatedAt: "2024-03-22"
  },
  {
    id: "TOUR007",
    name: "Tour Mộc Châu - Mai Châu 3N2Đ",
    description: "Khám phá vùng cao Tây Bắc với đồi chè Mộc Châu và bản làng Mai Châu.",
    destination: "Mộc Châu, Mai Châu",
    duration: 3,
    price: 3500000,
    status: "draft",
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1",
      "https://images.unsplash.com/photo-1526392060635-9d6019884377"
    ],
    itinerary: [
      {
        day: 1,
        title: "Hà Nội - Mộc Châu",
        description: "Di chuyển đến Mộc Châu, tham quan đồi chè, thác Dải Yếm."
      },
      {
        day: 2,
        title: "Mộc Châu - Mai Châu",
        description: "Di chuyển đến Mai Châu, tham quan bản Lác, thưởng thức rượu cần."
      },
      {
        day: 3,
        title: "Mai Châu - Về lại Hà Nội",
        description: "Tham quan hang Mỏ Luông và về lại Hà Nội."
      }
    ],
    inclusions: [
      "Homestay bản làng",
      "Ăn sáng",
      "Xe đưa đón",
      "Hướng dẫn viên địa phương",
      "Bảo hiểm"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Quà lưu niệm"
    ],
    rating: 0,
    totalBookings: 0,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05"
  },
  {
    id: "TOUR008",
    name: "Tour Cần Thơ - Chợ Nổi Cái Răng 2N1Đ",
    description: "Trải nghiệm miền Tây sông nước với chợ nổi Cái Răng và vườn trái cây.",
    destination: "Cần Thơ",
    duration: 2,
    price: 2500000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cần Thơ - Chợ nổi",
        description: "Tham quan chợ nổi Cái Răng sáng sớm, vườn trái cây."
      },
      {
        day: 2,
        title: "Bến Ninh Kiều - Về lại",
        description: "Tham quan Bến Ninh Kiều, chùa Ông và về lại."
      }
    ],
    inclusions: [
      "Khách sạn 3 sao",
      "Ăn sáng",
      "Thuyền tham quan chợ nổi",
      "Hướng dẫn viên",
      "Trái cây miễn phí"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Mua sắm tại chợ"
    ],
    rating: 4.5,
    totalBookings: 2,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-19"
  },
  {
    id: "TOUR009",
    name: "Tour Quy Nhơn - Kỳ Co 3N2Đ",
    description: "Khám phá bãi biển Quy Nhơn và đảo Kỳ Co với làn nước trong xanh.",
    destination: "Quy Nhơn, Bình Định",
    duration: 3,
    price: 3800000,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ],
    itinerary: [
      {
        day: 1,
        title: "Quy Nhơn - Biển",
        description: "Nhận phòng, tắm biển Quy Nhơn, tham quan bãi tắm Hoàng Hậu."
      },
      {
        day: 2,
        title: "Đảo Kỳ Co",
        description: "Tour đảo Kỳ Co, lặn ngắm san hô, tắm biển Eo Gió."
      },
      {
        day: 3,
        title: "Tháp Chăm - Về lại",
        description: "Tham quan tháp Chăm Bánh Ít và về lại."
      }
    ],
    inclusions: [
      "Khách sạn 3 sao",
      "Ăn sáng",
      "Tour đảo Kỳ Co",
      "Xe đưa đón",
      "Dụng cụ lặn"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Thuê áo phao"
    ],
    rating: 4.7,
    totalBookings: 2,
    createdAt: "2024-02-28",
    updatedAt: "2024-03-21"
  },
  {
    id: "TOUR010",
    name: "Tour Đồng Tháp - Vườn Quốc Gia Tràm Chim",
    description: "Khám phá vườn quốc gia Tràm Chim và làng hoa Sa Đéc.",
    destination: "Đồng Tháp",
    duration: 2,
    price: 2200000,
    status: "archived",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2"
    ],
    itinerary: [
      {
        day: 1,
        title: "Sa Đéc - Làng hoa",
        description: "Tham quan làng hoa Sa Đéc, nhà cổ Huỳnh Thủy Lê."
      },
      {
        day: 2,
        title: "Tràm Chim - Về lại",
        description: "Tham quan vườn quốc gia Tràm Chim, ngắm chim sếu đầu đỏ."
      }
    ],
    inclusions: [
      "Khách sạn 2 sao",
      "Ăn sáng",
      "Vé vào vườn quốc gia",
      "Xe đưa đón",
      "Hướng dẫn viên"
    ],
    exclusions: [
      "Bữa trưa và tối",
      "Chi phí cá nhân",
      "Thuê ống nhòm"
    ],
    rating: 4.4,
    totalBookings: 0,
    createdAt: "2023-12-10",
    updatedAt: "2024-02-15"
  }
];

export const dashboardMetrics = [
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
];