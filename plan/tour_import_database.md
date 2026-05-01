# Tour Data Import Plan

## Database Collections Involved

| Collection | Related To |
|------------|------------|
| `tours` | Main tour data |
| `destinations` | Tour references destination |
| `bookings` | Bookings reference tours |
| `reviews` | Reviews reference tours |
| `wishlists` | Wishlists reference tours |

## Option 1: Delete All & Import Fresh

**Steps:**
1. Delete all documents from `tours` collection
2. Delete all documents from `destinations` collection (if exists)
3. Import new tour data from `extended_data.json`
4. Import destinations data from `destinations.json`

**Pros:**
- Clean data, no duplicates
- Ensures all new fields (category, startDate, endDate) are present

**Cons:**
- Will lose all existing bookings, reviews, wishlists
- Need to re-create related data

## Option 2: Update Existing Records

**Steps:**
1. For each tour in `extended_data.json`:
   - Check if tour exists by title
   - Update existing record with new fields
   - If not exists, create new
2. Keep all existing bookings, reviews, wishlists

**Pros:**
- Preserve existing user data
- No data loss

**Cons:**
- May have stale data if not all fields updated

## Recommended Approach

**Option 2 - Update** is recommended for:
- Production environments
- When existing bookings/reviews need to be preserved

**Option 1 - Delete & Import** is recommended for:
- Development/testing environments
- When you want a fresh start with clean data

## Implementation Notes

- New fields added to Tour model:
  - `startDate` (Date)
  - `endDate` (Date)
  - `category` (enum: adventure, cultural, relaxation, family, luxury, nature, city_tour, food)
- Prices converted from VND to USD
- All tour data translated to English