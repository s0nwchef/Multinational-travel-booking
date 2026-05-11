const API_BASE_URL = "http://localhost:3000/api";

const tourService = {
  async getTours() {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const tours = await response.json();

      return tours
        .filter((tour) => tour.trang_thai === "active")
        .map((tour) => {
          const city = tour.id_diem_den?.thanh_pho || "Unknown";
          const country = tour.id_diem_den?.quoc_gia || "";

          const schedules = tour.lich_khoi_hanh || [];

          const availableSchedules = schedules.filter(
            (l) => l.trang_thai === "available",
          );

          const prices = availableSchedules
            .map((l) => l.gia_nguoi_lon)
            .filter((p) => p > 0);
          const minPrice =
            prices.length > 0 ? Math.min(...prices) : tour.gia_nguoi_lon;

          const nextDeparture =
            availableSchedules.sort(
              (a, b) => new Date(a.ngay_khoi_hanh) - new Date(b.ngay_khoi_hanh),
            )[0] || null;

          return {
            id: tour._id,

            title: tour.ten_tour,
            slug: tour.slug,
            description: tour.mo_ta || "",

            city,
            country,
            location: city.toUpperCase(),

            basePrice: minPrice,
            childBasePrice: tour.gia_tre_em,

            originalPrice: tour.gia_nguoi_lon
              ? Math.round(tour.gia_nguoi_lon * 1.15)
              : null,

            departures: availableSchedules.map((item) => ({
              id: item._id,
              ngayKhoiHanh: item.ngay_khoi_hanh,
              ngayVe: item.ngay_ve,
              giaNguoiLon: item.gia_nguoi_lon,
              choConLai: item.tong_cho - item.cho_da_dat,
            })),

            nextDeparture: nextDeparture
              ? {
                  ngayKhoiHanh: nextDeparture.ngay_khoi_hanh,
                  ngayVe: nextDeparture.ngay_ve,
                  giaNguoiLon: nextDeparture.gia_nguoi_lon,
                  choConLai: nextDeparture.tong_cho - nextDeparture.cho_da_dat,
                }
              : null,

            soNgay: tour.so_ngay,
            soDem: tour.so_dem,
            duration: `${tour.so_ngay} D / ${tour.so_dem} N`,

            image:
              tour.anh_dai_dien ||
              tour.danh_sach_anh?.[0] ||
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",

            gallery: tour.danh_sach_anh || [],

            rating: tour.diem_trung_binh || 0,
            totalReviews: tour.so_luong_danh_gia || 0,

            status: tour.trang_thai,
            featured: tour.noi_bat,

            badge:
              tour.diem_trung_binh >= 4.8
                ? "BEST SELLER"
                : tour.noi_bat
                  ? "FEATURED"
                  : "POPULAR",

            badgeType:
              tour.diem_trung_binh >= 4.8
                ? "orange"
                : tour.noi_bat
                  ? "purple"
                  : "blue",

            coordinates: this._getCoordinates(city),
          };
        });
    } catch (error) {
      console.error("getTours error:", error);
      throw error;
    }
  },

  async getTourById(id) {
    try {
      const [tourRes, lichRes, reviewRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tours/${id}`),
        fetch(`${API_BASE_URL}/lich-khoi-hanh/tour/${id}`),
        fetch(`${API_BASE_URL}/danh-gia/tour/${id}`),
      ]);

      if (!tourRes.ok) {
        throw new Error("Cannot fetch tour");
      }

      const tour = await tourRes.json();
      const lichKhoiHanh = lichRes.ok ? await lichRes.json() : [];
      const reviews = reviewRes.ok ? await reviewRes.json() : [];

      const city = tour.id_diem_den?.thanh_pho || "Unknown";
      const country = tour.id_diem_den?.quoc_gia || "";

      const availableSchedules = lichKhoiHanh.filter(
        (l) => l.trang_thai === "available",
      );

      return {
        id: tour._id,
        title: tour.ten_tour,
        slug: tour.slug,
        description: tour.mo_ta || "",

        destination: {
          id: tour.id_diem_den?._id,
          city,
          country,
          continent: tour.id_diem_den?.chau_luc,
          description: tour.id_diem_den?.mo_ta,
          image: tour.id_diem_den?.anh_bia,
        },

        location: city.toUpperCase(),

        basePrice: tour.gia_nguoi_lon,
        childBasePrice: tour.gia_tre_em,

        soNgay: tour.so_ngay,
        soDem: tour.so_dem,
        duration: `${tour.so_ngay} D / ${tour.so_dem} N`,

        image: tour.anh_dai_dien,
        gallery: [tour.anh_dai_dien, ...(tour.danh_sach_anh || [])],
        videoUrl: tour.video_url || "",

        itinerary: tour.lich_trinh || [],
        included: tour.bao_gom || [],
        excluded: tour.khong_bao_gom || [],
        cancelPolicy: tour.chinh_sach_huy || "",
        highlights: tour.diem_noi_bat || [],

        minPeople: tour.so_nguoi_toi_thieu,
        maxPeople: tour.so_nguoi_toi_da,

        rating: tour.diem_trung_binh || 0,
        totalReviews: tour.so_luong_danh_gia || 0,
        reviews: reviews || [],

        departures: availableSchedules.map((item) => ({
          id: item._id,
          ngayKhoiHanh: item.ngay_khoi_hanh,
          ngayVe: item.ngay_ve,

          giaNguoiLon: item.gia_nguoi_lon,
          giaTreEm: item.gia_tre_em,

          tongCho: item.tong_cho,
          choDaDat: item.cho_da_dat,
          choConLai: item.tong_cho - item.cho_da_dat,

          status: item.trang_thai,
        })),

        status: tour.trang_thai,
        featured: tour.noi_bat,

        coordinates: this._getCoordinates(city),
      };
    } catch (error) {
      console.error("getTourById error:", error);
      throw error;
    }
  },

  _getCoordinates(city) {
    if (!city) return [21.0285, 105.8542];

    const normalizedCity = city.trim().toLowerCase();

    const coordsMap = {
      paris: [48.8566, 2.3522],
      rome: [41.9028, 12.4964],
      florence: [43.7696, 11.2558],
      venice: [45.4408, 12.3155],
      tokyo: [35.6762, 139.6503],
    };

    return coordsMap[normalizedCity] || [21.0285, 105.8542];
  },
};

export default tourService;
