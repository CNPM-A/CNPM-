const io = require('socket.io-client');

// ================= CẤU HÌNH =================
const SERVER_URL = 'https://smart-school-bus-api.onrender.com';
const API_KEY = 'edcb1e0d-604b-4f95-b711-5e30daad380b'; // API Key của bạn
const TRIP_ID = '6936a8b422b982cd50e00e05'; // Trip ID của bạn


// Tốc độ: 1 giây gửi tọa độ 1 lần mili giây 
const UPDATE_INTERVAL = 1000; 

// CẤU HÌNH DỪNG TRẠM
const STOP_DURATION = 30; // Dừng 30s để check-in

// Các vị trí Index tương ứng với 5 TRẠM trong lộ trình SGU Campus Link
// 0: SGU Chính (Q5)
// 75: Ngã 6 Phù Đổng
// 105: SGU Cơ sở 1 (Q3)
// 140: Hồ Con Rùa
// 209: SGU Cơ sở 2 (Q1 - Cuối bến)
const STOP_INDICES = [75, 105, 140, 209]; 

// DỮ LIỆU ĐƯỜNG ĐI (Đã làm sạch từ JSON MongoDB của bạn)
const ROUTE_PATH = [
   [
                    106.657702,
                    10.772206
                ],
                [
                    106.657625,
                    10.77248
                ],
                [
                    106.657548,
                    10.772449
                ],
                [
                    106.657638,
                    10.772125
                ],
                [
                    106.657673,
                    10.772002
                ],
                [
                    106.657753,
                    10.771688
                ],
                [
                    106.65803,
                    10.770734
                ],
                [
                    106.658114,
                    10.770383
                ],
                [
                    106.658169,
                    10.770174
                ],
                [
                    106.658487,
                    10.768997
                ],
                [
                    106.658686,
                    10.768288
                ],
                [
                    106.658716,
                    10.768182
                ],
                [
                    106.658783,
                    10.767957
                ],
                [
                    106.658851,
                    10.7677
                ],
                [
                    106.659217,
                    10.766391
                ],
                [
                    106.659704,
                    10.764651
                ],
                [
                    106.659887,
                    10.763996
                ],
                [
                    106.659924,
                    10.763865
                ],
                [
                    106.659949,
                    10.763774
                ],
                [
                    106.66005,
                    10.763824
                ],
                [
                    106.660847,
                    10.764253
                ],
                [
                    106.660913,
                    10.764288
                ],
                [
                    106.661161,
                    10.764421
                ],
                [
                    106.661241,
                    10.764463
                ],
                [
                    106.661554,
                    10.764628
                ],
                [
                    106.661615,
                    10.764369
                ],
                [
                    106.66218,
                    10.764479
                ],
                [
                    106.662581,
                    10.764558
                ],
                [
                    106.662822,
                    10.764603
                ],
                [
                    106.663134,
                    10.764662
                ],
                [
                    106.663489,
                    10.764735
                ],
                [
                    106.663739,
                    10.76479
                ],
                [
                    106.663956,
                    10.764837
                ],
                [
                    106.664285,
                    10.764914
                ],
                [
                    106.664436,
                    10.764951
                ],
                [
                    106.664567,
                    10.764982
                ],
                [
                    106.665109,
                    10.765109
                ],
                [
                    106.665619,
                    10.765228
                ],
                [
                    106.665974,
                    10.765312
                ],
                [
                    106.666237,
                    10.765373
                ],
                [
                    106.666935,
                    10.765537
                ],
                [
                    106.667204,
                    10.7656
                ],
                [
                    106.667506,
                    10.765667
                ],
                [
                    106.667726,
                    10.764706
                ],
                [
                    106.667939,
                    10.763769
                ],
                [
                    106.668102,
                    10.763045
                ],
                [
                    106.668249,
                    10.762404
                ],
                [
                    106.668271,
                    10.762306
                ],
                [
                    106.668375,
                    10.761849
                ],
                [
                    106.668429,
                    10.761613
                ],
                [
                    106.668508,
                    10.761266
                ],
                [
                    106.668774,
                    10.760096
                ],
                [
                    106.66878,
                    10.76002
                ],
                [
                    106.668716,
                    10.759959
                ],
                [
                    106.668686,
                    10.759875
                ],
                [
                    106.66869,
                    10.759815
                ],
                [
                    106.668713,
                    10.759755
                ],
                [
                    106.668771,
                    10.759696
                ],
                [
                    106.668879,
                    10.759663
                ],
                [
                    106.668981,
                    10.759691
                ],
                [
                    106.669056,
                    10.759769
                ],
                [
                    106.669076,
                    10.759874
                ],
                [
                    106.670446,
                    10.76017
                ],
                [
                    106.674013,
                    10.760902
                ],
                [
                    106.67452,
                    10.761017
                ],
                [
                    106.674564,
                    10.761033
                ],
                [
                    106.674612,
                    10.761078
                ],
                [
                    106.674939,
                    10.761095
                ],
                [
                    106.675086,
                    10.76106
                ],
                [
                    106.675552,
                    10.75888
                ],
                [
                    106.675756,
                    10.758097
                ],
                [
                    106.681938,
                    10.760581
                ],
                [
                    106.681979,
                    10.760477
                ],
                [
                    106.681938,
                    10.760581
                ],
                [
                    106.683118,
                    10.761055
                ],
                [
                    106.683304,
                    10.761173
                ],
                [
                    106.683343,
                    10.761222
                ],
                [
                    106.683373,
                    10.761309
                ],
                [
                    106.68221,
                    10.764228
                ],
                [
                    106.681986,
                    10.764754
                ],
                [
                    106.681861,
                    10.76507
                ],
                [
                    106.681829,
                    10.765207
                ],
                [
                    106.681872,
                    10.765247
                ],
                [
                    106.681934,
                    10.765367
                ],
                [
                    106.68193,
                    10.765492
                ],
                [
                    106.681875,
                    10.765593
                ],
                [
                    106.684533,
                    10.768303
                ],
                [
                    106.68643,
                    10.770384
                ],
                [
                    106.687229,
                    10.771241
                ],
                [
                    106.689269,
                    10.773391
                ],
                [
                    106.689444,
                    10.773538
                ],
                [
                    106.689521,
                    10.77362
                ],
                [
                    106.689565,
                    10.773698
                ],
                [
                    106.689771,
                    10.773919
                ],
                [
                    106.690611,
                    10.77479
                ],
                [
                    106.690681,
                    10.774884
                ],
                [
                    106.691538,
                    10.775791
                ],
                [
                    106.691529,
                    10.775847
                ],
                [
                    106.691659,
                    10.775983
                ],
                [
                    106.690619,
                    10.776938
                ],
                [
                    106.6902,
                    10.776483
                ],
                [
                    106.690003,
                    10.77627
                ],
                [
                    106.689568,
                    10.775753
                ],
                [
                    106.689952,
                    10.775399
                ],
                [
                    106.690539,
                    10.774857
                ],
                [
                    106.690611,
                    10.77479
                ],
                [
                    106.690681,
                    10.774884
                ],
                [
                    106.691041,
                    10.775265
                ]


];
// ============================================

const socket = io(SERVER_URL, { auth: { apiKey: API_KEY } });
let currentIndex = 0;
let isRunning = false;
let simulationInterval;
// State để quản lý việc dừng trạm
let isStopping = false;
let stopCounter = 0;

console.log('🤖 Bot Driver đang khởi động...');

socket.on('connect', () => {
    console.log('✅ Đã kết nối:', socket.id);
    socket.emit('driver:start_trip', { tripId: TRIP_ID });
});

socket.on('trip:started_successfully', () => {
    console.log('🚀 Trip Started!');
    isRunning = true;
    drive();
});

socket.on('trip:completed', () => {
    console.log('\n🏁 SERVER XÁC NHẬN: COMPLETED!');
    process.exit(0);
});

function drive() {
    simulationInterval = setInterval(() => {
        if (!isRunning) return;

        const rawPoint = ROUTE_PATH[currentIndex]; 
        const coords = { latitude: rawPoint[1], longitude: rawPoint[0] };

        // 1. Gửi tọa độ (kể cả khi đang dừng)
        socket.emit('driver:update_location', { coords: coords });

        // 2. Logic kiểm tra Dừng Trạm
        // Nếu điểm hiện tại nằm trong danh sách cần dừng VÀ chưa ở trạng thái dừng
        if (STOP_INDICES.includes(currentIndex) && !isStopping) {
            console.log(`\n\n🚏 ĐÃ ĐẾN TRẠM (Index ${currentIndex}). Dừng ${STOP_DURATION}s để check-in...`);
            isStopping = true;
            stopCounter = 0;
        }

        // 3. Xử lý khi đang dừng
        if (isStopping) {
            stopCounter++;
            const remaining = STOP_DURATION - stopCounter;
            process.stdout.write(`\r⏳ Đang dừng chờ Check-in: ${stopCounter}/${STOP_DURATION}s ... `);

            if (stopCounter >= STOP_DURATION) {
                console.log('\n▶️ Hết thời gian chờ. Tiếp tục di chuyển!');
                isStopping = false;
                currentIndex++; // Nhích nhẹ để thoát khỏi điểm dừng
            }
            // RETURN ngay để không chạy phần di chuyển bên dưới
            return; 
        }

        // 4. Di chuyển bình thường
        const progress = ((currentIndex / ROUTE_PATH.length) * 100).toFixed(1);
        process.stdout.write(`\r🚌 Chạy: ${progress}% [${coords.latitude}, ${coords.longitude}]`);

        if (currentIndex >= ROUTE_PATH.length - 1) {
            clearInterval(simulationInterval);
            console.log('\n🛑 Đến bến cuối. Đợi 5s...');
            
            // Giả lập đậu 5s
            let count = 0;
            const wait = setInterval(() => {
                socket.emit('driver:update_location', { coords: coords });
                count++;
                if (count >= 5) {
                    clearInterval(wait);
                    console.log('\n🔘 Bấm End Trip...');
                    socket.emit('driver:end_trip');
                }
            }, 1000);

        } else {
            currentIndex++;
        }
    }, UPDATE_INTERVAL);
}
