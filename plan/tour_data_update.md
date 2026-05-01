# Tour Data Update Plan

## Tasks

### 1. Translate All Tour Data to English
- [x] 1.1 Translate tour titles from Vietnamese to English
- [x] 1.2 Translate tour descriptions from Vietnamese to English
- [x] 1.3 Translate itinerary activities from Vietnamese to English
- [x] 1.4 Translate included/excluded items from Vietnamese to English
- [x] 1.5 Update destination names to English (e.g., "Đà Nẵng" → "Da Nang", "Hạ Long" → "Ha Long")

### 2. Convert basePrice from VND to USD
- [x] 2.1 Convert all prices from VND to USD (divide by ~24,500)
- [x] 2.2 Update sample data with USD prices

### 3. Add Start Date and End Date to Tours
- [x] 3.1 Update Tour model (`server/models/Tour.js`) to add:
  - `startDate` field (Date)
  - `endDate` field (Date)
- [x] 3.2 Update sample data in `src/data/extended_data.json` with realistic dates
- [ ] 3.3 Update API controllers if needed to handle new date fields

## Files Modified

| File | Changes |
|------|---------|
| `server/models/Tour.js` | Added `startDate`, `endDate` schema fields |
| `src/data/extended_data.json` | Translated to English + added dates + USD prices |

## Summary
- ✅ 20 tours translated to English
- ✅ Prices converted from VND to USD (e.g., 900,000 VND → $37 USD)
- ✅ Added startDate and endDate for each tour (June 2025)
- ✅ JSON validated successfully