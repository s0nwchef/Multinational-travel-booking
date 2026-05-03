/**
 * Seed script - Add sample tours and destinations to MongoDB
 * Run: node server/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Destination from './models/Destination.js';
import Tour from './models/Tour.js';
import Booking from './models/Booking.js';
import Review from './models/Review.js';

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
        await Booking.deleteMany({});
        await Review.deleteMany({});
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

        const seedUsers = [];
        const seededPasswordHash = await bcrypt.hash('Password123!', 10);
        const userSeeds = [
            {
                email: 'sarah.jenkins@example.com',
                fullName: 'Sarah Jenkins',
                avatarUrl: 'https://i.pravatar.cc/150?img=1',
            },
            {
                email: 'marcus.chen@example.com',
                fullName: 'Marcus Chen',
                avatarUrl: 'https://i.pravatar.cc/150?img=2',
            },
            {
                email: 'elena.dragan@example.com',
                fullName: 'Elena Dragan',
                avatarUrl: 'https://i.pravatar.cc/150?img=3',
            },
            {
                email: 'olivia.miller@example.com',
                fullName: 'Olivia Miller',
                avatarUrl: 'https://i.pravatar.cc/150?img=4',
            },
            {
                email: 'daniel.kim@example.com',
                fullName: 'Daniel Kim',
                avatarUrl: 'https://i.pravatar.cc/150?img=5',
            }
        ];

        for (const userSeed of userSeeds) {
            const user = await User.findOneAndUpdate(
                { email: userSeed.email },
                {
                    $set: {
                        fullName: userSeed.fullName,
                        avatarUrl: userSeed.avatarUrl,
                        role: 'user',
                        passwordHash: seededPasswordHash
                    }
                },
                    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
            seedUsers.push(user);
        }

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

        const reviewsByTour = [
            {
                tourId: tours[0]._id,
                averageRating: 4.9,
                reviews: [
                    
                    {
                        user: seedUsers[1],
                        title: 'Wonderful and well organized',
                        rating: 5,
                        content: 'Ba thành phố đều rất đẹp, đặc biệt Venice vào buổi tối. Dịch vụ rất chuyên nghiệp.',
                        photos: []
                    },
                    {
                        user: seedUsers[2],
                        title: 'Great trip with a busy schedule',
                        rating: 4,
                        content: 'Tour có nhiều trải nghiệm tốt, chỉ hơi dày lịch trình ở ngày 4-5 nhưng vẫn đáng tiền.',
                        photos: [
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop'
                        ]
                    }
                ]
            },
            {
                tourId: tours[1]._id,
                averageRating: 4.8,
                reviews: [
                    {
                        user: seedUsers[3],
                        title: 'Paris at its best',
                        rating: 5,
                        content: 'Paris đẹp đúng như kỳ vọng. Phần tham quan Louvre và Versailles là điểm nhấn lớn nhất.',
                        photos: [
                            'https://images.unsplash.com/photo-1431274172911-5dff6b52884b?w=600&auto=format&fit=crop'
                        ]
                    },
                    {
                        user: seedUsers[4],
                        title: 'Perfect for a family trip',
                        rating: 5,
                        content: 'Nhịp tour nhẹ nhàng, phù hợp cho gia đình. Hướng dẫn viên am hiểu và hỗ trợ tốt.',
                        photos: []
                    }
                ]
            },
            {
                tourId: tours[2]._id,
                averageRating: 4.7,
                reviews: [
                    
                    {
                        user: seedUsers[1],
                        title: 'Worth every penny',
                        rating: 4,
                        content: 'Đáng tiền, đặc biệt là ngày đi Mount Fuji. Có thể thêm một đêm nghỉ ở khu Shibuya thì tuyệt hơn.',
                        photos: []
                    }
                ]
            }
        ];

        const reviewDocs = [];
        const bookingDocs = [];

        // Give Sarah Jenkins a completed booking for every seeded tour
        // so review creation can be tested on all tours.
        for (const tour of tours) {
            bookingDocs.push({
                userId: seedUsers[0]._id,
                bookingType: 'tour',
                itemId: tour._id,
                bookingCode: `SARAH-${tour._id.toString().slice(-6)}`,
                bookingReference: `SARAH-REF-${tour._id.toString().slice(-6)}`,
                customerName: seedUsers[0].fullName,
                tourId: tour._id,
                travelers: [
                    {
                        fullName: seedUsers[0].fullName,
                        age: 30,
                        documentId: `DOC-${seedUsers[0]._id.toString().slice(-6)}`,
                        seatNumber: 'A1',
                        baggage: '7kg xách tay'
                    }
                ],
                grandTotal: tour.basePrice || 0,
                totalAmount: tour.basePrice || 0,
                status: 'completed',
                paymentStatus: 'paid'
            });
        }

        for (const reviewGroup of reviewsByTour) {
            for (const reviewSeed of reviewGroup.reviews) {
                reviewDocs.push({
                    userId: reviewSeed.user._id,
                    tourId: reviewGroup.tourId,
                    title: reviewSeed.title || '',
                    rating: reviewSeed.rating,
                    content: reviewSeed.content,
                    photos: reviewSeed.photos,
                    isAnonymous: false,
                    detailedRatings: {}
                });

                bookingDocs.push({
                    userId: reviewSeed.user._id,
                    bookingType: 'tour',
                    itemId: reviewGroup.tourId,
                    bookingCode: `SEED-${reviewGroup.tourId.toString().slice(-6)}-${reviewSeed.user._id.toString().slice(-4)}`,
                    bookingReference: `REF-${reviewGroup.tourId.toString().slice(-6)}-${reviewSeed.user._id.toString().slice(-4)}`,
                    customerName: reviewSeed.user.fullName,
                    tourId: reviewGroup.tourId,
                    travelers: [
                        {
                            fullName: reviewSeed.user.fullName,
                            age: 30,
                            documentId: `DOC-${reviewSeed.user._id.toString().slice(-6)}`,
                            seatNumber: 'A1',
                            baggage: '7kg xách tay'
                        }
                    ],
                    grandTotal: tours.find((tour) => String(tour._id) === String(reviewGroup.tourId))?.basePrice || 0,
                    totalAmount: tours.find((tour) => String(tour._id) === String(reviewGroup.tourId))?.basePrice || 0,
                    status: 'completed',
                    paymentStatus: 'paid'
                });
            }
        }

        await Booking.insertMany(bookingDocs);
        await Review.insertMany(reviewDocs);

        for (const reviewGroup of reviewsByTour) {
            const totalReviews = reviewGroup.reviews.length;
            const averageRating = reviewGroup.reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews;

            await Tour.findByIdAndUpdate(reviewGroup.tourId, {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews
            });
        }

        console.log(`✅ Đã thêm ${reviewDocs.length} reviews`);
        console.log(`✅ Đã thêm ${bookingDocs.length} completed bookings`);

        console.log('\n✨ Seed data thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi seed data:', error);
        process.exit(1);
    }
}

// Run seed
connectDB().then(() => seedData());
