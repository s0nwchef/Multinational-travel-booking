import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Heart,
  MapPinned,
  Plane,
  Search,
  Settings,
  ShieldCheck,
  Ticket,
  User,
  Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pageCopy = {
  en: {
    badge: 'Help Center',
    title: 'Complete Platform Guide',
    description:
      'This page brings together the main workflows across the travel platform, from discovering destinations and tours to booking, payments, flights, wishlist, reviews, and staff operations.',
    searchPlaceholder: 'Quick search: booking, wishlist, checkout, staff...',
    sectionCount: 'guide sections',
    quickLinksHint: 'Includes direct links to key features',
    tocTitle: 'Feature Table of Contents',
    tocDescription:
      'Jump straight to the area you need. Each section includes a summary and a direct button to the matching page.',
    tocItemLabel: 'Section',
    sectionLabel: 'Guide',
    noResultsTitle: 'No matching section found',
    noResultsDescription:
      'Try a different keyword such as `tour`, `checkout`, `wishlist`, `transactions`, or `staff`.',
    localeLabel: 'Language',
    localeEn: 'English',
    localeVi: 'Tiếng Việt',
    ctaTitle: 'Need quick access to a specific area?',
    ctaDescription:
      'You can jump directly into the main pages to take action now, then return to Help whenever you want a more detailed walkthrough.',
  },
  vi: {
    badge: 'Trung Tâm Trợ Giúp',
    title: 'Hướng Dẫn Sử Dụng Toàn Bộ Hệ Thống',
    description:
      'Trang này tổng hợp đầy đủ các luồng chính của nền tảng du lịch, từ khám phá điểm đến và tour cho tới đặt chỗ, thanh toán, chuyến bay, wishlist, đánh giá và khu vực staff.',
    searchPlaceholder: 'Tìm nhanh: booking, wishlist, checkout, staff...',
    sectionCount: 'mục hướng dẫn',
    quickLinksHint: 'Có liên kết nhanh tới từng tính năng',
    tocTitle: 'Mục Lục Chức Năng',
    tocDescription:
      'Chọn nhanh phần bạn cần xem. Mỗi mục đều có mô tả ngắn và nút đi tới trang tương ứng.',
    tocItemLabel: 'Mục',
    sectionLabel: 'Hướng dẫn',
    noResultsTitle: 'Không tìm thấy mục phù hợp',
    noResultsDescription:
      'Hãy thử từ khóa khác như `tour`, `checkout`, `wishlist`, `transactions` hoặc `staff`.',
    localeLabel: 'Ngôn ngữ',
    localeEn: 'English',
    localeVi: 'Tiếng Việt',
    ctaTitle: 'Cần xem nhanh một khu vực cụ thể?',
    ctaDescription:
      'Bạn có thể đi thẳng tới các màn hình chính để thao tác ngay, rồi quay lại Help khi cần xem quy trình chi tiết hơn.',
  },
};

const guideSections = [
  {
    id: 'getting-started',
    icon: BookOpen,
    title: {
      en: 'Getting Started',
      vi: 'Bắt đầu sử dụng',
    },
    summary: {
      en: 'Learn the fastest way to explore, search, and move around the platform.',
      vi: 'Làm quen nhanh với cách truy cập, tìm kiếm và điều hướng trong hệ thống.',
    },
    cta: {
      label: {
        en: 'Go to Home',
        vi: 'Về trang chủ',
      },
      path: '/home',
    },
    items: [
      {
        en: 'Open `Home` to see featured tours, popular destinations, and fast shortcuts.',
        vi: 'Vào `Home` để xem tour nổi bật, điểm đến phổ biến và các gợi ý nhanh.',
      },
      {
        en: 'Use the search bar on the homepage or the Tours page to search by tour name, country, or destination.',
        vi: 'Dùng thanh tìm kiếm ở Homepage hoặc trang Tours để nhập tên tour, quốc gia hoặc điểm đến.',
      },
      {
        en: 'When you find a matching tour, open the tour card or click `View Details` to reach the full detail page.',
        vi: 'Khi thấy tour phù hợp, bấm vào thẻ tour hoặc nút `View Details` để mở trang chi tiết.',
      },
      {
        en: 'If you prefer browsing by region, open `Destination` to explore places grouped by continent.',
        vi: 'Nếu muốn xem theo khu vực, vào `Destination` để duyệt danh sách điểm đến theo châu lục.',
      },
    ],
  },
  {
    id: 'account-auth',
    icon: User,
    title: {
      en: 'Account and Sign In',
      vi: 'Tài khoản và đăng nhập',
    },
    summary: {
      en: 'Create an account, sign in, and keep your personal profile up to date.',
      vi: 'Cách tạo tài khoản, đăng nhập và cập nhật hồ sơ cá nhân.',
    },
    cta: {
      label: {
        en: 'Open Settings',
        vi: 'Mở cài đặt',
      },
      path: '/settings',
    },
    items: [
      {
        en: 'Register or sign in before using protected features such as booking, wishlist, and reviews.',
        vi: 'Đăng ký hoặc đăng nhập để sử dụng các chức năng cần xác thực như đặt tour, wishlist và đánh giá.',
      },
      {
        en: 'You can sign in with email or Google if that login option is enabled for your account.',
        vi: 'Bạn có thể đăng nhập bằng email hoặc Google nếu tài khoản đã được cấu hình.',
      },
      {
        en: 'After signing in, go to `Settings` to update your name, phone number, avatar, and password.',
        vi: 'Sau khi đăng nhập, vào `Settings` để cập nhật họ tên, số điện thoại, ảnh đại diện và đổi mật khẩu.',
      },
      {
        en: 'If a page requires authentication, the system will redirect you through the login flow before continuing.',
        vi: 'Nếu đang ở một trang yêu cầu đăng nhập, hệ thống sẽ chuyển bạn tới luồng xác thực trước khi tiếp tục.',
      },
    ],
  },
  {
    id: 'destinations',
    icon: MapPinned,
    title: {
      en: 'Explore Destinations',
      vi: 'Khám phá điểm đến',
    },
    summary: {
      en: 'Browse destinations by region and review the most iconic places available in the platform.',
      vi: 'Tìm điểm đến theo khu vực và xem các địa danh nổi bật.',
    },
    cta: {
      label: {
        en: 'View Destinations',
        vi: 'Xem Destination',
      },
      path: '/destination',
    },
    items: [
      {
        en: 'The `Destination` page groups places by region so you can browse more naturally.',
        vi: 'Trang `Destination` hiển thị các điểm đến theo khu vực để bạn dễ khám phá.',
      },
      {
        en: 'Open a destination card to review the matching regional collection in more detail.',
        vi: 'Bấm vào một điểm đến để mở danh sách chi tiết của khu vực tương ứng.',
      },
      {
        en: 'City and country are shown directly on cards to avoid confusion between places in the same country.',
        vi: 'Tên thành phố và quốc gia được hiển thị trực tiếp trên thẻ để tránh nhầm giữa các địa danh cùng quốc gia.',
      },
      {
        en: 'From destination discovery, you can continue into tours that match the place you want to visit.',
        vi: 'Từ danh sách điểm đến, bạn có thể tiếp tục chuyển sang tour phù hợp với nơi mình muốn đi.',
      },
    ],
  },
  {
    id: 'tours',
    icon: Compass,
    title: {
      en: 'Find and Review Tours',
      vi: 'Tìm và xem tour',
    },
    summary: {
      en: 'Filter tours, open detail pages, compare schedules, and check pricing.',
      vi: 'Cách lọc tour, xem chi tiết, lịch khởi hành và giá.',
    },
    cta: {
      label: {
        en: 'Open Tours',
        vi: 'Mở Tours',
      },
      path: '/tours',
    },
    items: [
      {
        en: 'Open `Tours` to browse the full list of active tours.',
        vi: 'Vào `Tours` để xem toàn bộ danh sách tour đang hoạt động.',
      },
      {
        en: 'Use filters and the search box to narrow results by destination, duration, or keywords.',
        vi: 'Dùng bộ lọc và ô tìm kiếm để thu hẹp kết quả theo điểm đến, thời lượng hoặc từ khóa.',
      },
      {
        en: 'On the tour detail page, you can review descriptions, images, ratings, base price, and available departures.',
        vi: 'Trong trang chi tiết tour, bạn sẽ thấy mô tả, ảnh, đánh giá, giá cơ bản và các lịch khởi hành khả dụng.',
      },
      {
        en: 'Pricing across the current frontend is standardized to `$` for a more consistent display.',
        vi: 'Giá hiển thị trong hệ thống hiện được chuẩn hóa sang `$` để thống nhất trải nghiệm.',
      },
    ],
  },
  {
    id: 'booking-checkout',
    icon: Ticket,
    title: {
      en: 'Booking and Checkout',
      vi: 'Đặt tour và thanh toán',
    },
    summary: {
      en: 'Go from selecting a departure date to finishing your booking smoothly.',
      vi: 'Từ chọn lịch khởi hành đến hoàn tất đơn đặt tour.',
    },
    cta: {
      label: {
        en: 'View My Bookings',
        vi: 'Xem booking của tôi',
      },
      path: '/my-bookings',
    },
    items: [
      {
        en: 'On the tour detail page, select an available departure and continue to `Checkout`.',
        vi: 'Tại trang chi tiết tour, chọn lịch khởi hành còn chỗ và bấm đặt tour để vào `Checkout`.',
      },
      {
        en: 'Enter the number of adults, children, and required traveler details.',
        vi: 'Điền số lượng người lớn, trẻ em và thông tin hành khách theo yêu cầu.',
      },
      {
        en: 'If you have a valid coupon or discount code, apply it in the order summary before confirming.',
        vi: 'Nếu có mã giảm giá hoặc coupon hợp lệ, áp dụng ngay trong phần tóm tắt đơn hàng.',
      },
      {
        en: 'After confirmation, your order will appear in `My Bookings` and `Transactions`.',
        vi: 'Sau khi xác nhận, đơn đặt tour sẽ xuất hiện trong `My Bookings` và `Transactions`.',
      },
    ],
  },
  {
    id: 'wishlist-reviews',
    icon: Heart,
    title: {
      en: 'Wishlist and Reviews',
      vi: 'Wishlist và đánh giá',
    },
    summary: {
      en: 'Save favorite tours and submit useful feedback after your trip.',
      vi: 'Lưu tour yêu thích và gửi nhận xét sau chuyến đi.',
    },
    cta: {
      label: {
        en: 'Open Wishlist',
        vi: 'Mở Wishlist',
      },
      path: '/wishlist',
    },
    items: [
      {
        en: 'Click the heart icon on a tour to add it to your wishlist.',
        vi: 'Bấm biểu tượng tim trên tour để thêm vào wishlist của bạn.',
      },
      {
        en: 'The `Wishlist` page helps you revisit saved tours and reopen their detail pages quickly.',
        vi: 'Trang `Wishlist` giúp bạn xem lại các tour đã lưu và mở nhanh trang chi tiết.',
      },
      {
        en: 'After completing a trip, go to `My Bookings` or the review area to write your feedback.',
        vi: 'Sau khi hoàn thành chuyến đi, bạn có thể vào `My Bookings` hoặc trang review để viết đánh giá.',
      },
      {
        en: 'Your review contributes to the average rating and helps other travelers choose more confidently.',
        vi: 'Đánh giá của bạn sẽ góp phần cập nhật điểm trung bình và giúp người dùng khác chọn tour dễ hơn.',
      },
    ],
  },
  {
    id: 'transactions-rewards',
    icon: Wallet,
    title: {
      en: 'Transactions, Coupons, and Rewards',
      vi: 'Giao dịch, coupon và điểm thưởng',
    },
    summary: {
      en: 'Track payment history, discounts, and reward-related activity.',
      vi: 'Theo dõi thanh toán, ưu đãi và lịch sử giao dịch.',
    },
    cta: {
      label: {
        en: 'Open Transactions',
        vi: 'Mở Transactions',
      },
      path: '/transactions',
    },
    items: [
      {
        en: 'The `Transactions` page shows payment history and booking-related transaction statuses.',
        vi: 'Trang `Transactions` hiển thị lịch sử giao dịch và trạng thái thanh toán liên quan đến booking.',
      },
      {
        en: 'Coupons can be applied during checkout when the order meets the required conditions.',
        vi: 'Coupon có thể được dùng trong luồng checkout nếu đáp ứng điều kiện đơn hàng.',
      },
      {
        en: 'Some offers may be connected to reward points or membership level.',
        vi: 'Một số ưu đãi được gắn với điểm thưởng hoặc hạng thành viên của người dùng.',
      },
      {
        en: 'Always double-check the final amount, booking code, and payment status after each transaction.',
        vi: 'Bạn nên kiểm tra kỹ giá cuối cùng, mã booking và trạng thái thanh toán sau mỗi giao dịch.',
      },
    ],
  },
  {
    id: 'flights',
    icon: Plane,
    title: {
      en: 'Search Flights',
      vi: 'Tìm chuyến bay',
    },
    summary: {
      en: 'Browse flights, choose seats, and move through the booking process.',
      vi: 'Duyệt chuyến bay, chọn ghế và tiếp tục quy trình đặt chỗ.',
    },
    cta: {
      label: {
        en: 'Open Flights',
        vi: 'Mở Flights',
      },
      path: '/flights',
    },
    items: [
      {
        en: 'Open `Flights` to start searching by route and travel intention.',
        vi: 'Vào `Flights` để bắt đầu tìm kiếm chuyến bay theo hành trình mong muốn.',
      },
      {
        en: 'When results load, pick the most suitable option to continue into seat selection.',
        vi: 'Sau khi có kết quả, chọn chuyến phù hợp để vào bước chọn ghế.',
      },
      {
        en: 'On the seat map, you can distinguish available seats, reserved seats, and your current selection.',
        vi: 'Ở màn chọn ghế, bạn sẽ thấy các ghế trống, ghế đã có người đặt và ghế đang chọn.',
      },
      {
        en: 'The flight flow is separate from tours, but it follows the same overall navigation style.',
        vi: 'Luồng chuyến bay là khu vực tách biệt với tour, nhưng được thiết kế cùng cách điều hướng để dễ sử dụng.',
      },
    ],
  },
  {
    id: 'staff-admin',
    icon: ShieldCheck,
    title: {
      en: 'Staff and Admin Area',
      vi: 'Khu vực staff và quản trị',
    },
    summary: {
      en: 'For staff and admin accounts managing tours, bookings, customers, refunds, and analytics.',
      vi: 'Dành cho tài khoản staff/admin quản lý tour, booking, khách hàng và phân tích.',
    },
    cta: {
      label: {
        en: 'Open Staff Dashboard',
        vi: 'Mở Staff Dashboard',
      },
      path: '/staff/dashboard',
    },
    items: [
      {
        en: 'Staff and admin accounts can access a dedicated dashboard for tours, bookings, customers, and refund work.',
        vi: 'Tài khoản staff/admin có thể truy cập dashboard riêng để quản lý tour, booking, khách hàng và hoàn tiền.',
      },
      {
        en: 'Tour Management lets the team create tours, edit content, update status, and monitor performance.',
        vi: 'Tour Management cho phép tạo mới, sửa nội dung, cập nhật trạng thái và theo dõi hiệu quả tour.',
      },
      {
        en: 'Booking Management helps staff review bookings, process status changes, and coordinate refunds when needed.',
        vi: 'Booking Management dùng để xem danh sách booking, xử lý trạng thái và phối hợp hoàn tiền khi cần.',
      },
      {
        en: 'Analytics supports revenue monitoring, tour performance review, customer behavior, and operational metrics.',
        vi: 'Analytics hỗ trợ xem doanh thu, hiệu suất tour, hành vi khách hàng và các chỉ số vận hành.',
      },
    ],
  },
  {
    id: 'support',
    icon: Settings,
    title: {
      en: 'Usage Tips and Support',
      vi: 'Mẹo sử dụng và hỗ trợ',
    },
    summary: {
      en: 'Common tips for faster navigation and handling frequent situations.',
      vi: 'Một số lưu ý để thao tác nhanh hơn và xử lý tình huống thường gặp.',
    },
    cta: {
      label: {
        en: 'Open Help',
        vi: 'Liên hệ hỗ trợ',
      },
      path: '/help',
    },
    items: [
      {
        en: 'If fresh data does not appear, try reloading the page or adjusting your active filters.',
        vi: 'Nếu không thấy dữ liệu mới, hãy thử tải lại trang hoặc đổi bộ lọc tìm kiếm.',
      },
      {
        en: 'When images or pricing look wrong, review the related tour and departure data first.',
        vi: 'Khi ảnh hoặc giá chưa đúng như mong muốn, nên kiểm tra lại dữ liệu tour và lịch khởi hành.',
      },
      {
        en: 'If booking cannot continue, confirm that you are signed in and that the selected departure is still available.',
        vi: 'Nếu booking không tiếp tục được, hãy xác nhận bạn đã đăng nhập và lịch khởi hành vẫn còn khả dụng.',
      },
      {
        en: 'Use the Help page as the platform’s central guide whenever you need a structured walkthrough.',
        vi: 'Trong trường hợp cần hỗ trợ, bạn có thể dùng trang Help như tài liệu hướng dẫn trung tâm của hệ thống.',
      },
    ],
  },
];

const quickLinks = [
  { label: 'Tours', path: '/tours' },
  { label: 'Destination', path: '/destination' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'My Bookings', path: '/my-bookings' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Settings', path: '/settings' },
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState('en');
  const navigate = useNavigate();
  const t = pageCopy[locale];

  const filteredSections = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) {
      return guideSections;
    }

    return guideSections.filter((section) => {
      const haystack = [
        section.title.en,
        section.title.vi,
        section.summary.en,
        section.summary.vi,
        ...section.items.flatMap((item) => [item.en, item.vi]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFE4C7] p-8 shadow-sm md:p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_rgba(251,146,60,0.18),_transparent_65%)] md:block" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
              <BookOpen className="h-4 w-4" />
              {t.badge}
            </div>

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                  {t.title}
                </h1>
                <p className="mt-4 text-base leading-8 text-gray-600 md:text-lg">
                  {t.description}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-white/85 p-2 shadow-sm">
                <p className="px-3 pb-2 text-[11px] font-black uppercase tracking-[0.18em] text-orange-500">
                  {t.localeLabel}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLocale('en')}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                      locale === 'en'
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                        : 'bg-white text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {pageCopy.en.localeEn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('vi')}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                      locale === 'vi'
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                        : 'bg-white text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    {pageCopy.vi.localeVi}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative mt-6 max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-orange-200 bg-white px-12 py-4 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                {filteredSections.length} {t.sectionCount}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm">
                <Compass className="h-4 w-4 text-orange-500" />
                {t.quickLinksHint}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="self-start rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-black text-gray-900">{t.tocTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{t.tocDescription}</p>

            <div className="mt-5 space-y-3">
              {filteredSections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 px-4 py-3 transition hover:border-orange-200 hover:bg-orange-50/70"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-500">
                        {t.tocItemLabel} {index + 1}
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {section.title[locale]}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            {filteredSections.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-8 py-14 text-center shadow-sm">
                <Search className="mx-auto h-10 w-10 text-orange-400" />
                <h3 className="mt-4 text-2xl font-black text-gray-900">{t.noResultsTitle}</h3>
                <p className="mt-3 text-gray-500">{t.noResultsDescription}</p>
              </div>
            ) : (
              filteredSections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 rounded-[2rem] border border-gray-200 bg-white p-7 shadow-sm md:p-8"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">
                            {t.sectionLabel} {index + 1}
                          </p>
                          <h3 className="mt-2 text-2xl font-black text-gray-900">
                            {section.title[locale]}
                          </h3>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
                            {section.summary[locale]}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(section.cta.path)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
                      >
                        {section.cta.label[locale]}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-3">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={`${section.id}-${itemIndex}`}
                          className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-4"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                          <p className="text-sm leading-7 text-gray-700 md:text-[15px]">
                            {item[locale]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })
            )}

            <section className="rounded-[2rem] bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8 text-white shadow-lg shadow-orange-200">
              <h3 className="text-2xl font-black">{t.ctaTitle}</h3>
              <p className="mt-3 max-w-2xl leading-7 text-white/90">{t.ctaDescription}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-50"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
