require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import models
const User = require("./models/user.model");
const Student = require("./models/student.model");
const Bus = require("./models/bus.model");
const Station = require("./models/station.model");
const Route = require("./models/route.model");
const Schedule = require("./models/schedule.model");
const Trip = require("./models/trip.model");
const Location = require("./models/location.model");
const Notification = require("./models/notification.model");
const Alert = require("./models/alert.model");

const { DB_URL } = process.env;

// Dữ liệu mẫu
const DISTRICTS = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Quận 9', 'Thủ Đức', 'Bình Thạnh', 'Phú Nhuận'];
const STREETS = ['Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Điện Biên Phủ', 'Võ Văn Tần', 'Pasteur', 'Cách Mạng Tháng 8', 'Xô Viết Nghệ Tĩnh', 'Hoàng Văn Thụ', 'Phan Xích Long'];
const SCHOOL_NAMES = ['Trường THPT Lê Quý Đôn', 'Trường THPT Nguyễn Thị Minh Khai', 'Trường THPT Gia Định', 'Trường THPT Trần Phú', 'Trường THPT Marie Curie'];
const GRADES = ['Lớp 6A1', 'Lớp 6A2', 'Lớp 7A1', 'Lớp 7A2', 'Lớp 8A1', 'Lớp 8A2', 'Lớp 9A1', 'Lớp 9A2', 'Lớp 10A1', 'Lớp 10A2', 'Lớp 11A1', 'Lớp 11A2', 'Lớp 12A1', 'Lớp 12A2'];

const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const MIDDLE_NAMES = ['Văn', 'Thị', 'Minh', 'Hữu', 'Đức', 'Anh', 'Thanh', 'Tuấn', 'Quốc', 'Hồng', 'Thu', 'Kim'];
const LAST_NAMES_MALE = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Khang', 'Long', 'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tài', 'Tuấn', 'Vũ'];
const LAST_NAMES_FEMALE = ['Anh', 'Chi', 'Diệu', 'Hà', 'Hương', 'Lan', 'Linh', 'Mai', 'Ngọc', 'Phương', 'Quỳnh', 'Thảo', 'Trang', 'Vy', 'Yến'];

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPhone = () => `0${randomNumber(3, 9)}${randomNumber(10000000, 99999999)}`;
const randomLat = () => (10.7 + Math.random() * 0.2).toFixed(6);
const randomLng = () => (106.6 + Math.random() * 0.2).toFixed(6);

const generateName = (isMale = true) => {
    const firstName = randomElement(FIRST_NAMES);
    const middleName = randomElement(MIDDLE_NAMES);
    const lastName = randomElement(isMale ? LAST_NAMES_MALE : LAST_NAMES_FEMALE);
    return `${firstName} ${middleName} ${lastName}`;
};

const generateEmail = (name) => {
    return name.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .split(' ')
        .join('') + randomNumber(100, 999) + '@gmail.com';
};

const generateAddress = () => {
    const street = randomElement(STREETS);
    const district = randomElement(DISTRICTS);
    const number = randomNumber(1, 500);
    return {
        street: street,
        city: 'TP.HCM',
        district: district,
        fullAddress: `${number} ${street}, ${district}, TP.HCM`,
        latitude: parseFloat(randomLat()),
        longitude: parseFloat(randomLng())
    };
};

const generateLicensePlate = (index) => {
    const prefixes = ['29', '30', '51', '59', '61'];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return `${randomElement(prefixes)}${randomElement(letters)}-${String(10000 + index).slice(1)}`;
};

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await mongoose.connect(DB_URL);
        console.log('✅ Connected to database!');

        // Xóa dữ liệu cũ
        console.log('\n🗑️  Clearing old data...');
        await Promise.all([
            User.deleteMany({}),
            Student.deleteMany({}),
            Bus.deleteMany({}),
            Station.deleteMany({}),
            Route.deleteMany({}),
            Schedule.deleteMany({}),
            Trip.deleteMany({}),
            Location.deleteMany({}),
            Notification.deleteMany({}),
            Alert.deleteMany({})
        ]);
        console.log('✅ Old data cleared!');

        // ============================================
        // 1. TẠO USERS
        // ============================================
        console.log('\n👥 Creating users...');
        
        // 1 Admin
        const admin = await User.create({
            name: 'Administrator',
            email: 'admin@schoolbus.com',
            phoneNumber: '0901234567',
            password: 'Admin123456',
            role: 'Admin'
        });
        console.log('✅ Created 1 Admin');

        // 2 Managers
        const managers = [];
        for (let i = 1; i <= 2; i++) {
            const name = generateName(true);
            managers.push(await User.create({
                name: name,
                email: `manager${i}@schoolbus.com`,
                phoneNumber: randomPhone(),
                password: 'Manager123',
                role: 'Manager'
            }));
        }
        console.log('✅ Created 2 Managers');

        // 10 Drivers
        const drivers = [];
        for (let i = 1; i <= 10; i++) {
            const name = generateName(true);
            drivers.push(await User.create({
                name: name,
                email: generateEmail(name),
                phoneNumber: randomPhone(),
                password: 'Driver123',
                role: 'Driver'
            }));
        }
        console.log('✅ Created 10 Drivers');

        // 30 Parents
        const parents = [];
        for (let i = 1; i <= 30; i++) {
            const name = generateName(Math.random() > 0.5);
            parents.push(await User.create({
                name: name,
                email: generateEmail(name),
                phoneNumber: randomPhone(),
                password: 'Parent123',
                role: 'Parent'
            }));
        }
        console.log('✅ Created 30 Parents');

        // ============================================
        // 2. TẠO BUSES
        // ============================================
        console.log('\n🚌 Creating buses...');
        const buses = [];
        for (let i = 1; i <= 10; i++) {
            buses.push(await Bus.create({
                licensePlate: generateLicensePlate(i),
                isAssigned: false
            }));
        }
        console.log('✅ Created 10 Buses');

        // ============================================
        // 3. TẠO STATIONS
        // ============================================
        console.log('\n📍 Creating stations...');
        const stations = [];
        
        // Tạo 5 trường học
        for (let i = 0; i < 5; i++) {
            stations.push(await Station.create({
                name: SCHOOL_NAMES[i],
                address: generateAddress()
            }));
        }

        // Tạo 15 điểm đón/trả khác (khu dân cư)
        for (let i = 1; i <= 15; i++) {
            stations.push(await Station.create({
                name: `Khu dân cư ${randomElement(DISTRICTS)} - Điểm ${i}`,
                address: generateAddress()
            }));
        }
        console.log('✅ Created 20 Stations (5 schools + 15 pickup points)');

        // ============================================
        // 4. TẠO ROUTES
        // ============================================
        console.log('\n🛣️  Creating routes...');
        const routes = [];
        for (let i = 1; i <= 5; i++) {
            const numStops = randomNumber(4, 7);
            const stopPoints = [];
            
            // Chọn ngẫu nhiên các stations
            const availableStations = [...stations];
            for (let j = 0; j < numStops; j++) {
                const randomIndex = randomNumber(0, availableStations.length - 1);
                stopPoints.push(availableStations[randomIndex]._id);
                availableStations.splice(randomIndex, 1);
            }

            routes.push(await Route.create({
                name: `Tuyến ${String(i).padStart(2, '0')} - ${randomElement(DISTRICTS)}`,
                stopPoints: stopPoints
            }));
        }
        console.log('✅ Created 5 Routes');

        // ============================================
        // 5. TẠO STUDENTS
        // ============================================
        console.log('\n👦👧 Creating students...');
        const students = [];
        
        for (let i = 0; i < 50; i++) {
            const isMale = Math.random() > 0.5;
            const name = generateName(isMale);
            const parentIndex = Math.floor(i / 2); // Mỗi parent có 1-2 con
            const route = randomElement(routes);
            const routeStations = await Route.findById(route._id);
            
            students.push(await Student.create({
                name: name,
                grade: randomElement(GRADES),
                parentId: parents[parentIndex % 30]._id,
                routeId: route._id,
                pickupStopId: routeStations.stopPoints[randomNumber(0, routeStations.stopPoints.length - 2)],
                dropoffStopId: routeStations.stopPoints[routeStations.stopPoints.length - 1] // Trường học
            }));
        }
        console.log('✅ Created 50 Students');

        // ============================================
        // 6. TẠO SCHEDULES
        // ============================================
        console.log('\n📅 Creating schedules...');
        const schedules = [];
        const today = new Date();
        
        for (let i = 0; i < 10; i++) {
            const route = routes[i % 5];
            const bus = buses[i];
            const driver = drivers[i];
            const routeData = await Route.findById(route._id).populate('stopPoints');
            
            // Tạo stop times
            const stopTimes = [];
            const baseTime = new Date(today);
            baseTime.setHours(6, 30, 0, 0); // Bắt đầu 6:30 sáng
            
            for (let j = 0; j < routeData.stopPoints.length; j++) {
                const arrivalTime = new Date(baseTime);
                arrivalTime.setMinutes(baseTime.getMinutes() + (j * 15)); // Mỗi điểm cách nhau 15 phút
                
                stopTimes.push({
                    stationId: routeData.stopPoints[j]._id,
                    arrivalAt: arrivalTime
                });
            }

            // Lấy students thuộc route này
            const routeStudents = students.filter(s => s.routeId.toString() === route._id.toString());
            
            const startDate = new Date(today);
            startDate.setHours(6, 0, 0, 0);
            const endDate = new Date(today);
            endDate.setHours(8, 0, 0, 0);

            schedules.push(await Schedule.create({
                routeId: route._id,
                busId: bus._id,
                driverId: driver._id,
                startDate: startDate,
                endDate: endDate,
                stopTimes: stopTimes,
                studentIds: routeStudents.map(s => s._id)
            }));

            // Cập nhật bus đã được assign
            bus.isAssigned = true;
            await bus.save();
        }
        console.log('✅ Created 10 Schedules');

        // ============================================
        // 7. TẠO TRIPS
        // ============================================
        console.log('\n🚍 Creating trips...');
        const trips = [];
        const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
        
        for (let i = 0; i < schedules.length; i++) {
            const schedule = schedules[i];
            const status = randomElement(statuses);
            let studentsPickedUp = 0;
            
            if (status === 'IN_PROGRESS') {
                const totalStudents = schedule.studentIds.length;
                studentsPickedUp = randomNumber(1, totalStudents - 1);
            } else if (status === 'COMPLETED') {
                studentsPickedUp = schedule.studentIds.length;
            }

            trips.push(await Trip.create({
                scheduleId: schedule._id,
                studentsPickedUp: studentsPickedUp,
                status: status
            }));
        }
        console.log('✅ Created 10 Trips');

        // ============================================
        // 8. TẠO LOCATIONS (GPS tracking)
        // ============================================
        console.log('\n📡 Creating GPS locations...');
        const locations = [];
        
        // Tạo vị trí cho các xe đang chạy
        const activeBuses = buses.slice(0, 7); // 7 xe đang hoạt động
        for (const bus of activeBuses) {
            for (let i = 0; i < 3; i++) { // 3 điểm GPS gần nhất cho mỗi xe
                const timestamp = new Date();
                timestamp.setMinutes(timestamp.getMinutes() - (i * 5)); // Mỗi 5 phút 1 điểm
                
                locations.push(await Location.create({
                    busId: bus._id,
                    latitude: parseFloat(randomLat()),
                    longitude: parseFloat(randomLng()),
                    timestamp: timestamp
                }));
            }
        }
        console.log(`✅ Created ${locations.length} GPS locations`);

        // ============================================
        // 9. TẠO NOTIFICATIONS
        // ============================================
        console.log('\n🔔 Creating notifications...');
        const notifications = [];
        const messages = [
            'Con bạn đã được đón thành công',
            'Xe bus đang trên đường đến điểm đón',
            'Con bạn đã đến trường an toàn',
            'Xe bus sẽ đến điểm đón trong 5 phút',
            'Con bạn đã lên xe bus'
        ];

        for (let i = 0; i < 20; i++) {
            const student = randomElement(students);
            const parent = await User.findById(student.parentId);
            
            notifications.push(await Notification.create({
                recipientId: parent._id,
                contextStudentId: student._id,
                message: `${randomElement(messages)} - ${student.name}`
            }));
        }
        console.log('✅ Created 20 Notifications');

        // ============================================
        // 10. TẠO ALERTS
        // ============================================
        console.log('\n⚠️  Creating alerts...');
        const alerts = [];
        const alertMessages = [
            'Xe gặp trục trặc nhỏ, đang xử lý',
            'Tắc đường, có thể chậm 10 phút',
            'Đã xử lý xong sự cố',
            'Xe đang hoạt động bình thường',
            'Cần hỗ trợ tại vị trí hiện tại'
        ];

        for (let i = 0; i < 5; i++) {
            const bus = randomElement(buses);
            const schedule = schedules.find(s => s.busId.toString() === bus._id.toString());
            const driver = schedule ? await User.findById(schedule.driverId) : randomElement(drivers);

            alerts.push(await Alert.create({
                busId: bus._id,
                driverId: driver._id,
                message: randomElement(alertMessages),
                timestamp: new Date(Date.now() - randomNumber(0, 7200000)) // Trong 2 giờ qua
            }));
        }
        console.log('✅ Created 5 Alerts');

        // ============================================
        // TỔNG KẾT
        // ============================================
        console.log('\n' + '='.repeat(50));
        console.log('🎉 DATABASE SEEDING COMPLETED!');
        console.log('='.repeat(50));
        console.log('📊 Summary:');
        console.log(`   👤 Users: ${1 + 2 + 10 + 30} (1 Admin, 2 Managers, 10 Drivers, 30 Parents)`);
        console.log(`   🚌 Buses: ${buses.length}`);
        console.log(`   📍 Stations: ${stations.length}`);
        console.log(`   🛣️  Routes: ${routes.length}`);
        console.log(`   👦👧 Students: ${students.length}`);
        console.log(`   📅 Schedules: ${schedules.length}`);
        console.log(`   🚍 Trips: ${trips.length}`);
        console.log(`   📡 Locations: ${locations.length}`);
        console.log(`   🔔 Notifications: ${notifications.length}`);
        console.log(`   ⚠️  Alerts: ${alerts.length}`);
        console.log('='.repeat(50));
        console.log('\n📝 Login Credentials:');
        console.log('   Admin:   admin@schoolbus.com / Admin123456');
        console.log('   Manager: manager1@schoolbus.com / Manager123');
        console.log('   Driver:  Check database for emails / Driver123');
        console.log('   Parent:  Check database for emails / Parent123');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

// Chạy seeding
seedDatabase();
