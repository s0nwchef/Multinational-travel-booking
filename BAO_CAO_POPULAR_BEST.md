# Bao cao chinh sua Popular Experiences va trang Best

## 1. Noi dung da chinh sua

- Da doi khu vuc `Popular Experiences` trong trang Destination tu cach doi danh sach bang timer sang auto slider chay lien tuc.
- Slider moi dung `experience-track` va animation CSS `popularSlide`, tao cam giac anh truot tu phai sang trai lien mach.
- Khi dua chuot vao slider, animation se tam dung de nguoi dung de click hon.
- Khi click vao anh/card trong `Popular Experiences`, he thong dieu huong sang trang `/region/:slug`, giong cach click destination card o phan tren.

## 2. Cac file da thay doi

- `src/pages/Destination/layout/Destination.jsx`
  - Bo state `slideIndex` va `setInterval`.
  - Tao `sliderExperiences` bang cach nhan doi danh sach popular de animation co the lap vo han.
  - Truyen them `slug` vao `ExperienceCard` de click sang trang best cua region.

- `src/pages/Destination/component/ExperienceCard.jsx`
  - Them `useNavigate`.
  - Them ham `handleClick()` de chuyen den `/region/${experience.slug}`.
  - Ho tro click chuot va phim `Enter`/`Space` cho accessibility.

- `src/pages/Destination/css/destination.css`
  - Doi `.experience-slider` tu grid sang khung overflow hidden.
  - Them `.experience-track` de cac card nam tren mot hang ngang va tu dong truot.
  - Them `@keyframes popularSlide`.
  - Them responsive width cho card tren desktop, tablet va mobile.

## 3. Popular lay du lieu tu dau

Trang Destination goi API qua:

```js
getDestinations()
```

Sau do map du lieu tu backend thanh object hien thi. Field quyet dinh mot destination co nam trong Popular hay khong la:

```js
popular: item.pho_bien === true
```

Nghia la neu trong database destination co `pho_bien: true` thi destination do se hien trong `Popular Experiences`.

## 4. Trang Best lay du lieu tu dau

Trang `/region/:regionName` dang nam o:

```txt
src/pages/RegionDetail/layout/RegionDetail.jsx
```

Trang nay lay song song 2 nguon du lieu:

```js
getDestinations()
tourService.getTours()
```

- `getDestinations()` lay danh sach diem den.
- `tourService.getTours()` lay danh sach tour dang active.
- Sau do trang loc destination theo `chau_luc` da slug hoa de hien thi cac country/card trong region do.

## 5. Star tren trang Best lay tu dau

Trong `RegionDetail.jsx`, moi country tinh rating bang rating cao nhat trong cac tour thuoc destination do:

```js
rating: destinationTours.length
    ? Math.max(...destinationTours.map((tour) => tour.rating || 0)).toFixed(1)
    : "0.0"
```

`tour.rating` nay duoc lay trong `tourService.getTours()` tu field backend:

```js
rating: tour.diem_trung_binh || 0
```

Backend cap nhat `diem_trung_binh` khi nguoi dung tao/sua/xoa danh gia trong `server/controllers/reviewController.js`.

## 6. Top Rated lay tu dau

Co 2 noi lien quan den `Top Rated`:

- O trang Best, tag `TOP RATED` dang duoc gan theo destination popular:

```js
tag: destination.pho_bien ? "TOP RATED" : ""
```

Tuc la tag nay hien khi destination co `pho_bien: true`.

- O trang Tours, option sort `Top Rated` sap xep tour theo rating giam dan:

```js
if (sortBy === "rating") return b.rating - a.rating;
```

Rating nay cung den tu `tour.diem_trung_binh` trong backend.

## 7. Cac ham quan trong de control project

- `toSlug(value)`
  - Chuyen ten region thanh slug URL, vi du `South East Asia` thanh `south-east-asia`.

- `fetchDestinations()`
  - Lay destination tu API va bien doi du lieu thanh format frontend can.

- `popularExperiences`
  - Loc cac destination co `popular === true`.

- `sliderExperiences`
  - Nhan doi danh sach popular de CSS animation chay lap vo han.

- `handleRegionPageChange(page)`
  - Doi trang destination grid va scroll ve dau grid.

- `ExperienceCard.handleClick()`
  - Dieu huong nguoi dung sang trang `/region/:slug`.

- `tourService.getTours()`
  - Lay tour active tu backend, tinh gia thap nhat, lich khoi hanh gan nhat, rating, badge va du lieu hien thi tren trang Tours/Best.

- `TourList.handleFilterChange(key, value)`
  - Doi filter cua trang Tours nhu category, start date, end date, rating, price.

- `TourList.sortedTours`
  - Sap xep tour theo gia hoac rating. `Top Rated` dung logic `b.rating - a.rating`.

## 8. Cach ban co the dieu khien nhanh

- Muon destination hien trong Popular: set `pho_bien: true` trong database destination.
- Muon destination khong hien trong Popular: set `pho_bien: false`.
- Muon star/rating cao hon: can co review cao hon cho tour, vi backend tinh lai `diem_trung_binh` tu bang danh gia.
- Muon tag `TOP RATED` tren trang Best doi dieu kien: sua dong `tag: destination.pho_bien ? "TOP RATED" : ""` trong `RegionDetail.jsx`.
- Muon slider nhanh/cham hon: sua `28s` trong `.experience-track { animation: popularSlide 28s linear infinite; }`.
