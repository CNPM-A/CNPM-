// // src/pages/driver/DriverContacts.jsx
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import {
//     Phone,
//     Search,
//     MapPin,
//     User,
//     Bell,
//     Clock,
//     AlertCircle,
//     CloudRain,
//     MessageCircle,
//     X,
//     Send,
//     ArrowLeft,
// } from 'lucide-react';

// const students = [
//     {
//         id: 's1',
//         name: 'Nguyễn Thị An',
//         class: '6A1',
//         school: 'THCS Lê Quý Đôn',
//         stopName: 'Trạm A - Nguyễn Trãi',
//         status: 'onboard',
//         parentName: 'Cô Lan',
//         parentPhone: '0901234567',
//         parentRelation: 'Mẹ',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
//     },
//     {
//         id: 's2',
//         name: 'Trần Văn Bình',
//         class: '7B2',
//         school: 'THCS Lê Quý Đôn',
//         stopName: 'Trạm B - Lê Văn Sỹ',
//         status: 'onboard',
//         parentName: 'Chú Hùng',
//         parentPhone: '0912223334',
//         parentRelation: 'Bố',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh',
//     },
//     {
//         id: 's3',
//         name: 'Lê Minh Cường',
//         class: '8A3',
//         school: 'THPT Nguyễn Thị Minh Khai',
//         stopName: 'Trạm C - Cách Mạng Tháng 8',
//         status: 'absent',
//         parentName: 'Cô Mai',
//         parentPhone: '0934445556',
//         parentRelation: 'Mẹ',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuong',
//     },
//     {
//         id: 's4',
//         name: 'Phạm Hồng Đào',
//         class: '6A2',
//         school: 'THCS Lê Quý Đôn',
//         stopName: 'Trạm A - Nguyễn Trãi',
//         status: 'late',
//         parentName: 'Chị Hoa',
//         parentPhone: '0987654321',
//         parentRelation: 'Chị',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dao',
//     },
// ];

// const notifications = [
//     { id: 'n1', title: 'Học sinh vắng', time: '07:15', body: 'Cường chưa lên xe hôm nay', type: 'warning' },
//     { id: 'n2', title: 'Cập nhật lộ trình', time: '07:50', body: 'Đi đường vòng do tắc Nguyễn Trãi', type: 'info' },
//     { id: 'n3', title: 'Thời tiết xấu', time: '08:05', body: 'Mưa lớn, xe chạy chậm, phụ huynh yên tâm', type: 'weather' },
// ];

// // Tin nhắn mẫu ban đầu (sẽ được cập nhật khi gửi tin)
// const initialMessages = {
//     'parent-s1': [
//         { id: 1, sender: 'parent', text: 'Cháu An hôm nay có lên xe đúng giờ không ạ?', time: '07:05' },
//         { id: 2, sender: 'driver', text: 'Dạ có ạ, cháu lên xe lúc 6:55 rồi ạ!', time: '07:06' },
//         { id: 3, sender: 'parent', text: 'Cảm ơn chú tài nhiều ạ!', time: '07:07' },
//     ],
//     'parent-s3': [
//         { id: 4, sender: 'parent', text: 'Hôm nay Cường bị ốm, cháu nghỉ học ạ', time: '06:30' },
//         { id: 5, sender: 'driver', text: 'Dạ chú biết rồi ạ, chúc cháu mau khỏe!', time: '06:32' },
//     ],
//     admin: [
//         { id: 6, sender: 'admin', text: 'Hôm nay xe số 28 đi đường nào vậy anh?', time: '07:20' },
//         { id: 7, sender: 'driver', text: 'Dạ em đang đi vòng qua CMT8 do kẹt Nguyễn Trãi ạ', time: '07:22' },
//         { id: 8, sender: 'admin', text: 'Ok anh, cảm ơn thông tin!', time: '07:23' },
//         { id: 9, sender: 'driver', text: 'Xe sắp đến trường rồi ạ', time: '08:10' },
//     ],
// };

// export default function DriverContacts() {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [activeChat, setActiveChat] = useState(null);
//     const [messageSearch, setMessageSearch] = useState('');
//     const [newMessage, setNewMessage] = useState('');
//     const [messages, setMessages] = useState(initialMessages); // Quản lý tin nhắn động
//     const messagesEndRef = useRef(null);

//     // Lọc học sinh
//     const filteredStudents = useMemo(() => {
//         if (!searchTerm) return students;
//         const lower = searchTerm.toLowerCase();
//         return students.filter(
//             (s) =>
//                 s.name.toLowerCase().includes(lower) ||
//                 s.class.toLowerCase().includes(lower) ||
//                 s.stopName.toLowerCase().includes(lower) ||
//                 s.parentName.toLowerCase().includes(lower)
//         );
//     }, [searchTerm]);

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'onboard':
//                 return <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">Đã lên xe</span>;
//             case 'absent':
//                 return <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold">Vắng</span>;
//             case 'late':
//                 return <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">Trễ xe</span>;
//             default:
//                 return null;
//         }
//     };

//     // Lấy tin nhắn hiện tại
//     const currentMessages = activeChat ? messages[activeChat] || [] : [];

//     // Lọc tin nhắn theo từ khóa tìm kiếm
//     const filteredMessages = useMemo(() => {
//         if (!messageSearch) return currentMessages;
//         const lower = messageSearch.toLowerCase();
//         return currentMessages.filter((m) => m.text.toLowerCase().includes(lower));
//     }, [currentMessages, messageSearch]);

//     // Tự động cuộn xuống cuối
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [currentMessages]);

//     // Mở chat
//     const openChat = (chatId) => {
//         setActiveChat(chatId);
//         setIsChatOpen(true);
//         setMessageSearch('');
//         setNewMessage('');
//     };

//     // Gửi tin nhắn (cập nhật thật vào state)
//     const sendMessage = () => {
//         if (!newMessage.trim() || !activeChat) return;

//         const now = new Date();
//         const timeStr = now.toTimeString().slice(0, 5); // HH:MM

//         const newMsg = {
//             id: Date.now(),
//             sender: 'driver',
//             text: newMessage.trim(),
//             time: timeStr,
//         };

//         setMessages((prev) => ({
//             ...prev,
//             [activeChat]: [...(prev[activeChat] || []), newMsg],
//         }));

//         setNewMessage('');
//     };

//     // Tiêu đề chat
//     const getChatTitle = () => {
//         if (activeChat === 'admin') return 'Nhóm Quản Lý (Admin)';
//         const student = students.find((s) => `parent-${s.id}` === activeChat);
//         return student ? `Chat với ${student.parentName} (PH ${student.name})` : 'Chat';
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* HEADER */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl mb-10">
//                     <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-5 justify-center md:justify-start">
//                         <Phone className="w-14 h-14" />
//                         Danh Bạ & Tin Nhắn
//                     </h1>
//                     <p className="text-xl mt-4 text-center md:text-left opacity-90">
//                         Quản lý học sinh • Chat nhanh với phụ huynh & admin
//                     </p>
//                 </div>

//                 <div className="grid lg:grid-cols-3 gap-8">
//                     {/* CỘT TRÁI */}
//                     <div className="lg:col-span-2 space-y-8">
//                         {/* Chat với Admin */}
//                         <button
//                             onClick={() => openChat('admin')}
//                             className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-3xl p-6 shadow-2xl hover:scale-105 transition flex items-center justify-center gap-4 text-2xl font-bold"
//                         >
//                             <MessageCircle className="w-12 h-12" />
//                             Chat với Quản Lý (Admin)
//                         </button>

//                         {/* Tìm kiếm + Danh sách học sinh */}
//                         <div className="bg-white rounded-3xl shadow-2xl p-6">
//                             <div className="relative mb-6">
//                                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8" />
//                                 <input
//                                     type="text"
//                                     placeholder="Tìm tên, lớp, trạm, phụ huynh..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-20 pr-8 py-6 text-lg rounded-3xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none shadow-inner"
//                                 />
//                             </div>

//                             <div className="space-y-4">
//                                 {filteredStudents.map((student) => (
//                                     <div
//                                         key={student.id}
//                                         className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition"
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-6">
//                                                 <img
//                                                     src={student.avatar}
//                                                     alt={student.name}
//                                                     className="w-20 h-20 rounded-full ring-4 ring-white shadow-xl"
//                                                 />
//                                                 <div>
//                                                     <h3 className="text-2xl font-bold">{student.name}</h3>
//                                                     <p className="text-lg text-gray-600">{student.class} • {student.stopName}</p>
//                                                     <p className="text-sm text-indigo-700">PH: {student.parentName}</p>
//                                                 </div>
//                                             </div>

//                                             <div className="flex flex-col items-end gap-4">
//                                                 {getStatusBadge(student.status)}
//                                                 <div className="flex gap-3">
//                                                     <a
//                                                         href={`tel:${student.parentPhone}`}
//                                                         className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-xl hover:scale-110 transition"
//                                                     >
//                                                         <Phone className="w-8 h-8" />
//                                                     </a>
//                                                     <button
//                                                         onClick={() => openChat(`parent-${student.id}`)}
//                                                         className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition"
//                                                     >
//                                                         <MessageCircle className="w-8 h-8" />
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* CỘT PHẢI - THÔNG BÁO */}
//                     <div className="space-y-8">
//                         <div className="bg-white rounded-3xl shadow-2xl p-8">
//                             <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-4 text-indigo-700">
//                                 <Bell className="w-12 h-12" />
//                                 Thông báo hôm nay
//                             </h2>
//                             <div className="space-y-5">
//                                 {notifications.map((notif) => (
//                                     <div
//                                         key={notif.id}
//                                         className={`p-6 rounded-3xl border-l-8 shadow-lg ${
//                                             notif.type === 'warning'
//                                                 ? 'border-red-500 bg-red-50'
//                                                 : notif.type === 'weather'
//                                                 ? 'border-blue-500 bg-blue-50'
//                                                 : 'border-indigo-500 bg-indigo-50'
//                                         }`}
//                                     >
//                                         <div className="flex items-start gap-5">
//                                             {notif.type === 'warning' && <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />}
//                                             {notif.type === 'weather' && <CloudRain className="w-10 h-10 text-blue-600 flex-shrink-0" />}
//                                             {notif.type === 'info' && <Bell className="w-10 h-10 text-indigo-600 flex-shrink-0" />}
//                                             <div>
//                                                 <h4 className="text-xl font-bold">{notif.title}</h4>
//                                                 <p className="text-gray-700 mt-2">{notif.body}</p>
//                                                 <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
//                                                     <Clock className="w-5 h-5" /> {notif.time}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* MODAL CHAT - HOẠT ĐỘNG THẬT */}
//                 {isChatOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-3xl shadow-3xl w-full max-w-4xl h-5/6 flex flex-col">
//                             {/* Header */}
//                             <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-t-3xl flex items-center justify-between">
//                                 <div className="flex items-center gap-4">
//                                     <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
//                                         <ArrowLeft className="w-8 h-8" />
//                                     </button>
//                                     <h2 className="text-2xl font-bold">{getChatTitle()}</h2>
//                                 </div>
//                                 <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
//                                     <X className="w-8 h-8" />
//                                 </button>
//                             </div>

//                             {/* Tìm kiếm tin nhắn */}
//                             <div className="p-4 border-b">
//                                 <div className="relative">
//                                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                     <input
//                                         type="text"
//                                         placeholder="Tìm trong cuộc trò chuyện..."
//                                         value={messageSearch}
//                                         onChange={(e) => setMessageSearch(e.target.value)}
//                                         className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Danh sách tin nhắn */}
//                             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                                 {filteredMessages.length === 0 ? (
//                                     <p className="text-center text-gray-500">Chưa có tin nhắn nào</p>
//                                 ) : (
//                                     filteredMessages.map((msg) => (
//                                         <div
//                                             key={msg.id}
//                                             className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
//                                         >
//                                             <div
//                                                 className={`max-w-xs lg:max-w-md px-5 py-3 rounded-3xl shadow-md ${
//                                                     msg.sender === 'driver'
//                                                         ? 'bg-indigo-600 text-white'
//                                                         : 'bg-gray-200 text-gray-800'
//                                                 }`}
//                                             >
//                                                 <p className="text-sm md:text-base">{msg.text}</p>
//                                                 <p className={`text-xs mt-1 ${msg.sender === 'driver' ? 'text-indigo-200' : 'text-gray-500'}`}>
//                                                     {msg.time}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>

//                             {/* Gửi tin nhắn */}
//                             <div className="p-4 border-t bg-gray-50">
//                                 <div className="flex gap-3">
//                                     <input
//                                         type="text"
//                                         placeholder="Nhập tin nhắn..."
//                                         value={newMessage}
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
//                                         className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                     />
//                                     <button
//                                         onClick={sendMessage}
//                                         disabled={!newMessage.trim()}
//                                         className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-4 rounded-full shadow-xl hover:scale-110 transition disabled:scale-100"
//                                     >
//                                         <Send className="w-6 h-6" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// src/pages/driver/DriverContacts.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Phone,
    Search,
    MapPin,
    Bell,
    Clock,
    AlertCircle,
    CloudRain,
    MessageCircle,
    X,
    Send,
    ArrowLeft,
} from 'lucide-react';
import { useRouteTracking } from '../../context/RouteTrackingContext';

const notifications = [
    { id: 'n1', title: 'Học sinh vắng', time: '07:15', body: 'Cường chưa lên xe hôm nay', type: 'warning' },
    { id: 'n2', title: 'Cập nhật lộ trình', time: '07:50', body: 'Đi đường vòng do tắc Nguyễn Trãi', type: 'info' },
    { id: 'n3', title: 'Thời tiết xấu', time: '08:05', body: 'Mưa lớn, xe chạy chậm, phụ huynh yên tâm', type: 'weather' },
];

export default function DriverContacts() {
    // ĐÃ XÓA useAuth vì không dùng đến user → hết lỗi ESLint
    const {
        isTracking,
        currentStation,
        studentCheckIns,
        allStudentsForContact = [],
    } = useRouteTracking();

    const [searchTerm, setSearchTerm] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [messageSearch, setMessageSearch] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState({
        admin: [
            { id: 1, sender: 'admin', text: 'Chuyến đi hôm nay thế nào anh?', time: '07:20' },
            { id: 2, sender: 'driver', text: 'Dạ đang chạy tốt ạ!', time: '07:22' },
        ],
    });
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống cuối khi có tin mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChat]);

    // Lọc học sinh theo tìm kiếm
    const filteredStudents = useMemo(() => {
        if (!searchTerm) return allStudentsForContact;
        const lower = searchTerm.toLowerCase();
        return allStudentsForContact.filter((s) =>
            s.name.toLowerCase().includes(lower) ||
            s.class.toLowerCase().includes(lower) ||
            s.parentName.toLowerCase().includes(lower)
        );
    }, [searchTerm, allStudentsForContact]);

    // Lấy trạng thái học sinh từ Context
    const getStudentStatus = (studentId) => {
        if (!isTracking) return 'waiting';
        const status = studentCheckIns[studentId];
        if (status === 'present') return 'onboard';
        if (status === 'absent') return 'absent';
        return 'late'; // chưa check-in → trễ
    };

    // Badge trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'onboard':
                return <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">Đã lên xe</span>;
            case 'absent':
                return <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold">Vắng</span>;
            case 'late':
                return <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">Trễ xe</span>;
            default:
                return <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold">Chưa đón</span>;
        }
    };

    // Mở chat
    const openChat = (chatId) => {
        setActiveChat(chatId);
        setIsChatOpen(true);
        setMessageSearch('');
        setNewMessage('');
    };

    // Gửi tin nhắn thật (cập nhật state)
    const sendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;

        const now = new Date().toTimeString().slice(0, 5);
        const newMsg = {
            id: Date.now(),
            sender: 'driver',
            text: newMessage.trim(),
            time: now,
        };

        setMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMsg],
        }));

        setNewMessage('');
    };

    // Lấy tin nhắn hiện tại
    const currentMessages = activeChat ? messages[activeChat] || [] : [];

    // Lọc tin nhắn theo tìm kiếm
    const filteredMessages = useMemo(() => {
        if (!messageSearch) return currentMessages;
        const lower = messageSearch.toLowerCase();
        return currentMessages.filter((m) => m.text.toLowerCase().includes(lower));
    }, [currentMessages, messageSearch]);

    // Tiêu đề chat
    const getChatTitle = () => {
        if (activeChat === 'admin') return 'Nhóm Quản Lý (Admin)';
        const student = allStudentsForContact.find((s) => `parent-${s.id}` === activeChat);
        return student ? `Chat với ${student.parentName} (PH ${student.name})` : 'Chat';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-5 justify-center md:justify-start">
                        <Phone className="w-14 h-14" />
                        Danh Bạ & Tin Nhắn
                    </h1>
                    <p className="text-xl mt-4 text-center md:text-left opacity-90">
                        Quản lý học sinh • Chat nhanh với phụ huynh & admin
                    </p>
                    <p className="text-lg mt-3 opacity-80">
                        Trạng thái chuyến: <strong>{isTracking ? 'ĐANG CHẠY' : 'CHƯA BẮT ĐẦU'}</strong>
                        {currentStation && ` • Trạm hiện tại: ${currentStation.name}`}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI - DANH BẠ + CHAT */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chat với Admin */}
                        <button
                            onClick={() => openChat('admin')}
                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-3xl p-6 shadow-2xl hover:scale-105 transition flex items-center justify-center gap-4 text-2xl font-bold"
                        >
                            <MessageCircle className="w-12 h-12" />
                            Chat với Quản Lý (Admin)
                        </button>

                        {/* Tìm kiếm + Danh sách học sinh */}
                        <div className="bg-white rounded-3xl shadow-2xl p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8" />
                                <input
                                    type="text"
                                    placeholder="Tìm tên, lớp, phụ huynh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-20 pr-8 py-6 text-lg rounded-3xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none shadow-inner"
                                />
                            </div>

                            <div className="space-y-4">
                                {filteredStudents.map((student) => {
                                    const status = getStudentStatus(student.id);
                                    return (
                                        <div
                                            key={student.id}
                                            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <img
                                                        src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                                        alt={student.name}
                                                        className="w-20 h-20 rounded-full ring-4 ring-white shadow-xl"
                                                    />
                                                    <div>
                                                        <h3 className="text-2xl font-bold">{student.name}</h3>
                                                        <p className="text-lg text-gray-600">{student.class}</p>
                                                        <p className="text-sm text-indigo-700">PH: {student.parentName}</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-4">
                                                    {getStatusBadge(status)}
                                                    <div className="flex gap-3">
                                                        <a
                                                            href={`tel:${student.parentPhone}`}
                                                            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-xl hover:scale-110 transition"
                                                        >
                                                            <Phone className="w-8 h-8" />
                                                        </a>
                                                        <button
                                                            onClick={() => openChat(`parent-${student.id}`)}
                                                            className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition"
                                                        >
                                                            <MessageCircle className="w-8 h-8" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI - THÔNG BÁO */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-4 text-indigo-700">
                                <Bell className="w-12 h-12" />
                                Thông báo hôm nay
                            </h2>
                            <div className="space-y-5">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-6 rounded-3xl border-l-8 shadow-lg ${
                                            notif.type === 'warning'
                                                ? 'border-red-500 bg-red-50'
                                                : notif.type === 'weather'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-indigo-500 bg-indigo-50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-5">
                                            {notif.type === 'warning' && <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />}
                                            {notif.type === 'weather' && <CloudRain className="w-10 h-10 text-blue-600 flex-shrink-0" />}
                                            {notif.type === 'info' && <Bell className="w-10 h-10 text-indigo-600 flex-shrink-0" />}
                                            <div>
                                                <h4 className="text-xl font-bold">{notif.title}</h4>
                                                <p className="text-gray-700 mt-2">{notif.body}</p>
                                                <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                                                    <Clock className="w-5 h-5" /> {notif.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL CHAT - HOẠT ĐỘNG THẬT */}
                {isChatOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-3xl w-full max-w-4xl h-5/6 flex flex-col">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-t-3xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
                                        <ArrowLeft className="w-8 h-8" />
                                    </button>
                                    <h2 className="text-2xl font-bold">{getChatTitle()}</h2>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full">
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="p-4 border-b">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Tìm trong cuộc trò chuyện..."
                                        value={messageSearch}
                                        onChange={(e) => setMessageSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {filteredMessages.length === 0 ? (
                                    <p className="text-center text-gray-500">Chưa có tin nhắn nào</p>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-5 py-3 rounded-3xl shadow-md ${
                                                    msg.sender === 'driver'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-200 text-gray-800'
                                                }`}
                                            >
                                                <p className="text-sm md:text-base">{msg.text}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'driver' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t bg-gray-50">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                                        className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
                                    >
                                        <Send className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}