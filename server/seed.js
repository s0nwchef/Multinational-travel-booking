/**
 * Seed script - Add sample tours and destinations to MongoDB
 * Run: node server/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import Destination from './models/Destination.js';
import Tour from './models/Tour.js';

// Set DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

async function connectDB() {
    let MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('❌ Lỗi: Chưa tìm thấy MONGODB_URI trong file .env');
        process.exit(1);
    }

    MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, '');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1);
    }
}

async function seedData() {
    try {
        // Clear existing data
        await Tour.deleteMany({});
        await Destination.deleteMany({});
        console.log('🗑️ Đã xóa dữ liệu cũ');

        // Create sample destinations
        const destinations = await Destination.insertMany([
            {
                name: 'Rome',
                type: 'city',
                description: 'Ancient capital of the Roman Empire',
                imageUrl: 'https://images.unsplash.com/photo-1552832860-cfdf26b96b51'
            },
            {
                name: 'Florence',
                type: 'city',
                description: 'Renaissance art and culture hub',
                imageUrl: 'https://images.unsplash.com/photo-1532635241749-b8aa163143d0'
            },
            {
                name: 'Venice',
                type: 'city',
                description: 'The City of Canals',
                imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785'
            },
            {
                name: 'Paris',
                type: 'city',
                description: 'The City of Light',
                imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
            },
            {
                name: 'Tokyo',
                type: 'city',
                description: 'Modern metropolis of Japan',
                imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
            }
        ]);
        console.log(`✅ Đã thêm ${destinations.length} destinations`);

        // Create sample tours
        const tours = await Tour.insertMany([
            {
                title: 'Best of Italy: Rome, Florence & Venice',
                description: 'Experience the magic of Italy with this comprehensive 10-day tour covering the country\'s most iconic destinations.',
                destinationId: destinations[0]._id,
                basePrice: 2499,
                duration: 10,
                images: [
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828'
                ],
                itinerary: [
                    { day: 1, activity: 'Arrival in Rome' },
                    { day: 2, activity: 'Explore Colosseum and Roman Forum' },
                    { day: 3, activity: 'Visit Vatican Museums' },
                    { day: 4, activity: 'Travel to Florence' },
                    { day: 5, activity: 'Tour Renaissance Florence' },
                    { day: 6, activity: 'Wine tasting in Tuscany' },
                    { day: 7, activity: 'Travel to Venice' },
                    { day: 8, activity: 'Gondola ride in Venice' },
                    { day: 9, activity: 'Island exploration' },
                    { day: 10, activity: 'Departure' }
                ],
                included: [
                    'Accommodation in 4-star hotels',
                    'Daily breakfast',
                    'Guided tours',
                    'Train tickets',
                    'Airport transfers'
                ],
                excluded: [
                    'Airfare',
                    'Travel insurance',
                    'Personal expenses'
                ],
                averageRating: 4.9,
                totalReviews: 1204,
                status: 'active'
            },
            {
                title: 'Paris in 5 Days',
                description: 'Discover the charm and beauty of Paris in this quintessential European experience.',
                destinationId: destinations[3]._id,
                basePrice: 1299,
                duration: 5,
                images: [
                    'https://images.unsplash.com/photo-1431274172911-5dff6b52884b'
                ],
                itinerary: [
                    { day: 1, activity: 'Arrival and Eiffel Tower visit' },
                    { day: 2, activity: 'Louvre Museum tour' },
                    { day: 3, activity: 'Notre-Dame and Latin Quarter' },
                    { day: 4, activity: 'Versailles Palace' },
                    { day: 5, activity: 'Montmartre and shopping' }
                ],
                included: [
                    'Hotel accommodation',
                    'Breakfast daily',
                    'Museum passes',
                    'Local transportation'
                ],
                excluded: [
                    'Meals (except breakfast)',
                    'International airfare'
                ],
                averageRating: 4.8,
                totalReviews: 856,
                status: 'active'
            },
            {
                title: 'Tokyo Cultural Experience',
                description: 'Immerse yourself in Japanese culture, tradition, and modernity.',
                destinationId: destinations[4]._id,
                basePrice: 1899,
                duration: 7,
                images: [
                    'https://images.unsplash.com/photo-1540959375944-7049f642e9a0'
                ],
                itinerary: [
                    { day: 1, activity: 'Arrival in Tokyo' },
                    { day: 2, activity: 'Shibuya and Shinjuku districts' },
                    { day: 3, activity: 'Temple and shrine visit' },
                    { day: 4, activity: 'Day trip to Mount Fuji' },
                    { day: 5, activity: 'Traditional Japanese experience' },
                    { day: 6, activity: 'Shopping and entertainment' },
                    { day: 7, activity: 'Departure' }
                ],
                included: [
                    'Hotel accommodation',
                    'Daily meals',
                    'JR Pass',
                    'Guide service'
                ],
                excluded: [
                    'International flights',
                    'Travel insurance'
                ],
                averageRating: 4.7,
                totalReviews: 632,
                status: 'active'
            }
        ]);
        console.log(`✅ Đã thêm ${tours.length} tours`);

        console.log('\n✨ Seed data thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi seed data:', error);
        process.exit(1);
    }
}

// Run seed
connectDB().then(() => seedData());
