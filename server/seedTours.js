import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// Use Google and Cloudflare DNS to avoid ISP querySrv errors
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tour Schema (inline to avoid import issues)
const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  basePrice: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  category: { 
    type: String, 
    enum: ['adventure', 'cultural', 'relaxation', 'family', 'luxury', 'nature', 'city_tour', 'food'], 
    default: 'city_tour' 
  },
  images: [{ type: String }],
  itinerary: [{
    day: Number,
    activity: String
  }],
  included: [{ type: String }],
  excluded: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'archived'], 
    default: 'draft' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBookings: { type: Number, default: 0 }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

// Destination Schema
const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: String,
  best_time: String,
  image: String
}, { timestamps: true });

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

async function seedTours() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Lỗi: Chưa tìm thấy MONGODB_URI trong .env');
      process.exit(1);
    }

    console.log('🔌 Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB!');

    // Read data file
    const dataPath = path.join(__dirname, '../src/data/extended_data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Read destinations
    const destDataPath = path.join(__dirname, '../src/data/destinations.json');
    const destData = JSON.parse(fs.readFileSync(destDataPath, 'utf8'));

    // Seed Destinations first
    console.log('\n📍 Đang seed destinations...');
    
    // Add missing destinations
    const missingDests = [
      { name: "Da Nang", country: "Vietnam", description: "beaches, mountains, bridges, cuisine", best_time: "Feb,Mar,Apr,May,Jun,Jul,Aug,Sep" },
      { name: "Ha Long", country: "Vietnam", description: "bay, islands, caves, cruises, world heritage", best_time: "Oct,Nov,Dec,Jan,Feb,Mar,Apr" },
      { name: "New York", country: "USA", description: "landmarks, museums, theatre, culture, food, shopping", best_time: "Apr,May,Jun,Sep,Oct,Nov,Dec" }
    ];
    
    for (const dest of missingDests) {
      const existing = await Destination.findOne({ name: dest.name });
      if (!existing) {
        await Destination.create(dest);
        console.log(`  ✅ Created: ${dest.name}`);
      }
    }
    
    // Seed from destinations.json
    for (const dest of destData) {
      const existing = await Destination.findOne({ name: dest.name });
      if (!existing) {
        await Destination.create(dest);
        console.log(`  ✅ Created: ${dest.name}`);
      } else {
        console.log(`  ⏭️  Exists: ${dest.name}`);
      }
    }

    // Get destination map
    const destinations = await Destination.find();
    const destMap = {};
    destinations.forEach(d => {
      destMap[d.name] = d._id;
    });

    // Seed Tours
    console.log('\n🎫 Đang seed tours...');
    let created = 0;
    let updated = 0;

    for (const tour of data.tours) {
      // Find destination ID
      const destId = destMap[tour.destinationName];
      if (!destId) {
        console.log(`  ⚠️  Destination not found: ${tour.destinationName}`);
        continue;
      }

      const tourData = {
        ...tour,
        destinationId: destId,
        status: 'active'
      };
      delete tourData.destinationName;

      // Check if tour exists by title
      const existingTour = await Tour.findOne({ title: tour.title });
      
      if (existingTour) {
        // Update existing
        await Tour.findByIdAndUpdate(existingTour._id, tourData);
        updated++;
        console.log(`  🔄 Updated: ${tour.title}`);
      } else {
        // Create new
        await Tour.create(tourData);
        created++;
        console.log(`  ✅ Created: ${tour.title}`);
      }
    }

    console.log(`\n🎉 Hoàn thành!`);
    console.log(`   - Tạo mới: ${created} tours`);
    console.log(`   - Cập nhật: ${updated} tours`);
    console.log(`   - Tổng: ${created + updated} tours`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối MongoDB');
    process.exit(0);
  }
}

seedTours();