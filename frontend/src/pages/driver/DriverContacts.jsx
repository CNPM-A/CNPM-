// // src/pages/driver/DriverContacts.jsx
// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import {
//     Phone,
//     Search,
//     MapPin,
//     Bell,
//     Clock,
//     AlertCircle,
//     CloudRain,
//     MessageCircle,
//     X,
//     Send,
//     ArrowLeft,
// } from 'lucide-react';
// import { useRouteTracking } from '../../context/RouteTrackingContext';

// const notifications = [
//     { id: 'n1', title: 'Học sinh vắng', time: '07:15', body: 'Cường chưa lên xe hôm nay', type: 'warning' },
//     { id: 'n2', title: 'Cập nhật lộ trình', time: '07:50', body: 'Đi đường vòng do tắc Nguyễn Trãi', type: 'info' },
//     { id: 'n3', title: 'Thời tiết xấu', time: '08:05', body: 'Mưa lớn, xe chạy chậm, phụ huynh yên tâm', type: 'weather' },
// ];

// export default function DriverContacts() {
//     // ĐÃ XÓA useAuth vì không dùng đến user → hết lỗi ESLint
//     const {
//         isTracking,
//         currentStation,
//         studentCheckIns,
//         allStudentsForContact = [],
//     } = useRouteTracking();

//     const [searchTerm, setSearchTerm] = useState('');
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [activeChat, setActiveChat] = useState(null);
//     const [messageSearch, setMessageSearch] = useState('');
//     const [newMessage, setNewMessage] = useState('');
//     const [messages, setMessages] = useState({
//         admin: [
//             { id: 1, sender: 'admin', text: 'Chuyến đi hôm nay thế nào anh?', time: '07:20' },
//             { id: 2, sender: 'driver', text: 'Dạ đang chạy tốt ạ!', time: '07:22' },
//         ],
//     });
//     const messagesEndRef = useRef(null);

//     // Tự động cuộn xuống cuối khi có tin mới
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages, activeChat]);

//     // Lọc học sinh theo tìm kiếm
//     const filteredStudents = useMemo(() => {
//         if (!searchTerm) return allStudentsForContact;
//         const lower = searchTerm.toLowerCase();
//         return allStudentsForContact.filter((s) =>
//             s.name.toLowerCase().includes(lower) ||
//             s.class.toLowerCase().includes(lower) ||
//             s.parentName.toLowerCase().includes(lower)
//         );
//     }, [searchTerm, allStudentsForContact]);

//     // Lấy trạng thái học sinh từ Context
//     const getStudentStatus = (studentId) => {
//         if (!isTracking) return 'waiting';
//         const status = studentCheckIns[studentId];
//         if (status === 'present') return 'onboard';
//         if (status === 'absent') return 'absent';
//         return 'late'; // chưa check-in → trễ
//     };

//     // Badge trạng thái (compact)
//     const getStatusBadge = (status) => {
//         const base = 'px-3 py-1 rounded-full text-xs font-semibold';
//         switch (status) {
//             case 'onboard':
//                 return <span className={`${base} bg-green-100 text-green-800`}>Đã</span>;
//             case 'absent':
//                 return <span className={`${base} bg-red-100 text-red-800`}>Vắng</span>;
//             case 'late':
//                 return <span className={`${base} bg-yellow-100 text-yellow-800`}>Trễ</span>;
//             default:
//                 return <span className={`${base} bg-gray-100 text-gray-700`}>Chưa</span>;
//         }
//     };

//     // Mở chat
//     const openChat = (chatId) => {
//         setActiveChat(chatId);
//         setIsChatOpen(true);
//         setMessageSearch('');
//         setNewMessage('');
//     };

//     // Gửi tin nhắn thật (cập nhật state)
//     const sendMessage = () => {
//         if (!newMessage.trim() || !activeChat) return;

//         const now = new Date().toTimeString().slice(0, 5);
//         const newMsg = {
//             id: Date.now(),
//             sender: 'driver',
//             text: newMessage.trim(),
//             time: now,
//         };

//         setMessages((prev) => ({
//             ...prev,
//             [activeChat]: [...(prev[activeChat] || []), newMsg],
//         }));

//         setNewMessage('');
//     };

//     // Lấy tin nhắn hiện tại
//     const currentMessages = activeChat ? messages[activeChat] || [] : [];

//     // Lọc tin nhắn theo tìm kiếm
//     const filteredMessages = useMemo(() => {
//         if (!messageSearch) return currentMessages;
//         const lower = messageSearch.toLowerCase();
//         return currentMessages.filter((m) => m.text.toLowerCase().includes(lower));
//     }, [currentMessages, messageSearch]);

//     // Tiêu đề chat
//     const getChatTitle = () => {
//         if (activeChat === 'admin') return 'Nhóm Quản Lý (Admin)';
//         const student = allStudentsForContact.find((s) => `parent-${s.id}` === activeChat);
//         return student ? `Chat với ${student.parentName} (PH ${student.name})` : 'Chat';
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* HEADER compact */}
//                 <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-4 md:p-5 text-white shadow mb-6">
//                     <div className="flex items-center gap-3">
//                         <Phone className="w-10 h-10" />
//                         <div className="flex-1">
//                             <h1 className="text-lg md:text-xl font-bold">Danh Bạ & Tin Nhắn</h1>
//                             <p className="text-sm opacity-90">Quản lý học sinh • Chat nhanh với phụ huynh & admin</p>
//                         </div>
//                         <div className="text-right text-xs">
//                             <div className="font-semibold">{isTracking ? 'ĐANG CHẠY' : 'CHƯA BẮT ĐẦU'}</div>
//                             <div className="opacity-90">{currentStation ? `${currentStation.name}` : 'Trạm: -'}</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid lg:grid-cols-3 gap-4">
//                     {/* CỘT TRÁI - DANH BẠ + CHAT */}
//                     <div className="lg:col-span-2 space-y-4">
//                         {/* Chat với Admin */}
//                         <button
//                             onClick={() => openChat('admin')}
//                             className="w-full bg-teal-500 text-white rounded-xl py-3 shadow hover:scale-[1.02] transition flex items-center justify-center gap-3 text-lg font-semibold"
//                         >
//                             <MessageCircle className="w-8 h-8" />
//                             Chat với Quản Lý (Admin)
//                         </button>

//                         {/* Tìm kiếm + Danh sách học sinh */}
//                         <div className="bg-white rounded-xl shadow p-4">
//                             <div className="relative mb-4">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                 <input
//                                     type="text"
//                                     placeholder="Tìm tên, lớp, phụ huynh..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"
//                                 />
//                             </div>

//                             <div className="space-y-3">
//                                 {filteredStudents.map((student) => {
//                                     const status = getStudentStatus(student.id);
//                                     return (
//                                         <div
//                                             key={student.id}
//                                             className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 shadow-sm hover:shadow transition flex items-center justify-between"
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <img
//                                                     src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
//                                                     alt={student.name}
//                                                     className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
//                                                 />
//                                                 <div className="text-sm">
//                                                     <div className="font-semibold">{student.name}</div>
//                                                     <div className="text-xs text-gray-500">{student.class} • PH: {student.parentName}</div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-center gap-2">
//                                                 {getStatusBadge(status)}
//                                                 <a
//                                                     href={`tel:${student.parentPhone}`}
//                                                     className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
//                                                 >
//                                                     <Phone className="w-4 h-4" />
//                                                 </a>
//                                                 <button
//                                                     onClick={() => openChat(`parent-${student.id}`)}
//                                                     className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//                                                 >
//                                                     <MessageCircle className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>

//                     {/* CỘT PHẢI - THÔNG BÁO */}
//                     <div className="space-y-4">
//                         <div className="bg-white rounded-xl shadow p-4">
//                             <div className="flex items-center justify-between mb-2">
//                                 <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="w-4 h-4" /> Thông báo</h3>
//                                 <div className="text-xs text-gray-400">{notifications.length} mục</div>
//                             </div>

//                             <div className="space-y-2">
//                                 {notifications.map((notif) => (
//                                     <div
//                                         key={notif.id}
//                                         className={`p-3 rounded-lg border-l-4 flex items-start gap-3 ${notif.type === 'warning' ? 'border-red-400 bg-red-50' : notif.type === 'weather' ? 'border-blue-400 bg-blue-50' : 'border-indigo-400 bg-indigo-50'}`}
//                                     >
//                                         <div className="mt-1">
//                                             {notif.type === 'warning' && <AlertCircle className="w-6 h-6 text-red-600" />}
//                                             {notif.type === 'weather' && <CloudRain className="w-6 h-6 text-blue-600" />}
//                                             {notif.type === 'info' && <Bell className="w-6 h-6 text-indigo-600" />}
//                                         </div>
//                                         <div className="text-sm">
//                                             <div className="font-medium">{notif.title}</div>
//                                             <div className="text-xs text-gray-700">{notif.body}</div>
//                                             <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {notif.time}</div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="bg-white rounded-xl shadow p-3">
//                             <h4 className="font-semibold text-sm mb-2">Hành động nhanh</h4>
//                             <div className="flex flex-col gap-2">
//                                 <button className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Gọi nhanh phụ huynh</button>
//                                 <button className="w-full px-3 py-2 rounded-md border text-sm">Gửi thông báo hàng loạt</button>
//                                 <button className="w-full px-3 py-2 rounded-md bg-rose-500 text-white text-sm">Báo cáo sự cố</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* MODAL CHAT - HOẠT ĐỘNG THẬT */}
//                 {isChatOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-xl shadow w-full max-w-3xl h-[86vh] flex flex-col overflow-hidden">
//                             <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-3 flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-white/10">
//                                         <ArrowLeft className="w-5 h-5" />
//                                     </button>
//                                     <h2 className="text-lg font-bold">{getChatTitle()}</h2>
//                                 </div>
//                                 <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
//                             </div>

//                             <div className="p-3 border-b">
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                                     <input
//                                         type="text"
//                                         placeholder="Tìm trong cuộc trò chuyện..."
//                                         value={messageSearch}
//                                         onChange={(e) => setMessageSearch(e.target.value)}
//                                         className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex-1 overflow-auto p-3 space-y-3">
//                                 {filteredMessages.length === 0 ? (
//                                     <p className="text-center text-gray-500 text-sm">Chưa có tin nhắn nào</p>
//                                 ) : (
//                                     filteredMessages.map((msg) => (
//                                         <div key={msg.id} className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
//                                             <div className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'driver' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
//                                                 <p className="text-sm">{msg.text}</p>
//                                                 <p className={`text-xs mt-1 ${msg.sender === 'driver' ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.time}</p>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                                 <div ref={messagesEndRef} />
//                             </div>

//                             <div className="p-3 border-t bg-gray-50">
//                                 <div className="flex gap-2">
//                                     <input
//                                         type="text"
//                                         placeholder="Nhập tin nhắn..."
//                                         value={newMessage}
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
//                                         className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                                     />
//                                     <button
//                                         onClick={sendMessage}
//                                         disabled={!newMessage.trim()}
//                                         className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-2 rounded-full"
//                                     >
//                                         <Send className="w-5 h-5" />
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

    // --- Load persisted messages from localStorage on mount and merge ---
    useEffect(() => {
        try {
            const raw = localStorage.getItem('chat_messages');
            if (raw) {
                const store = JSON.parse(raw);
                setMessages(prev => {
                    const merged = { ...prev };
                    Object.keys(store).forEach(thread => {
                        // avoid duplicating identical messages by id (simple guard)
                        const existingIds = new Set((merged[thread] || []).map(m => m.id));
                        merged[thread] = [...(merged[thread] || [])];
                        store[thread].forEach(m => {
                            if (!existingIds.has(m.id)) merged[thread].push(m);
                        });
                    });
                    return merged;
                });
            }
        } catch (e) {
            console.error('Failed to load chat_messages from localStorage', e);
        }
    }, []);

    // Listen to chat_message events dispatched by other components (DriverOperations)
    useEffect(() => {
        const handler = (e) => {
            try {
                const { threadId, message } = e.detail || {};
                if (!threadId || !message) return;
                setMessages(prev => {
                    const copy = { ...prev };
                    copy[threadId] = [...(copy[threadId] || []), message];
                    return copy;
                });
            } catch (err) {
                console.error('chat_message handler error', err);
            }
        };
        window.addEventListener('chat_message', handler);
        return () => window.removeEventListener('chat_message', handler);
    }, []);

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

    // Badge trạng thái (compact)
    const getStatusBadge = (status) => {
        const base = 'px-3 py-1 rounded-full text-xs font-semibold';
        switch (status) {
            case 'onboard':
                return <span className={`${base} bg-green-100 text-green-800`}>Đã</span>;
            case 'absent':
                return <span className={`${base} bg-red-100 text-red-800`}>Vắng</span>;
            case 'late':
                return <span className={`${base} bg-yellow-100 text-yellow-800`}>Trễ</span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-700`}>Chưa</span>;
        }
    };

    // Mở chat
    const openChat = (chatId) => {
        setActiveChat(chatId);
        setIsChatOpen(true);
        setMessageSearch('');
        setNewMessage('');
    };

    // Helper: persist a message to localStorage and broadcast a 'chat_message' event
    const persistAndBroadcast = (threadId, messageObj) => {
        try {
            const KEY = 'chat_messages';
            const raw = localStorage.getItem(KEY);
            let store = raw ? JSON.parse(raw) : {};
            if (!store[threadId]) store[threadId] = [];
            // avoid duplicate ids
            if (!store[threadId].some(m => m.id === messageObj.id)) {
                store[threadId].push(messageObj);
                localStorage.setItem(KEY, JSON.stringify(store));
            }
            window.dispatchEvent(new CustomEvent('chat_message', { detail: { threadId, message: messageObj } }));
        } catch (e) {
            console.error('persistAndBroadcast error', e);
        }
    };

    // Gửi tin nhắn thật (cập nhật state + persist + broadcast)
    const sendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;

        const now = new Date().toTimeString().slice(0, 5);
        const newMsg = {
            id: Date.now(),
            sender: 'driver',
            text: newMessage.trim(),
            time: now,
        };

        setMessages((prev) => {
            const next = { ...prev };
            next[activeChat] = [...(next[activeChat] || []), newMsg];
            return next;
        });

        // persist + broadcast so other modules (DriverOperations) or other tabs see it
        persistAndBroadcast(activeChat, newMsg);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER compact */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-4 md:p-5 text-white shadow mb-6">
                    <div className="flex items-center gap-3">
                        <Phone className="w-10 h-10" />
                        <div className="flex-1">
                            <h1 className="text-lg md:text-xl font-bold">Danh Bạ & Tin Nhắn</h1>
                            <p className="text-sm opacity-90">Quản lý học sinh • Chat nhanh với phụ huynh & admin</p>
                        </div>
                        <div className="text-right text-xs">
                            <div className="font-semibold">{isTracking ? 'ĐANG CHẠY' : 'CHƯA BẮT ĐẦU'}</div>
                            <div className="opacity-90">{currentStation ? `${currentStation.name}` : 'Trạm: -'}</div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                    {/* CỘT TRÁI - DANH BẠ + CHAT */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Chat với Admin */}
                        <button
                            onClick={() => openChat('admin')}
                            className="w-full bg-teal-500 text-white rounded-xl py-3 shadow hover:scale-[1.02] transition flex items-center justify-center gap-3 text-lg font-semibold"
                        >
                            <MessageCircle className="w-8 h-8" />
                            Chat với Quản Lý (Admin)
                        </button>

                        {/* Tìm kiếm + Danh sách học sinh */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm tên, lớp, phụ huynh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredStudents.map((student) => {
                                    const status = getStudentStatus(student.id);
                                    return (
                                        <div
                                            key={student.id}
                                            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 shadow-sm hover:shadow transition flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                                    alt={student.name}
                                                    className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
                                                />
                                                <div className="text-sm">
                                                    <div className="font-semibold">{student.name}</div>
                                                    <div className="text-xs text-gray-500">{student.class} • PH: {student.parentName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(status)}
                                                <a
                                                    href={`tel:${student.parentPhone}`}
                                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => openChat(`parent-${student.id}`)}
                                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI - THÔNG BÁO */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm flex items-center gap-2"><Bell className="w-4 h-4" /> Thông báo</h3>
                                <div className="text-xs text-gray-400">{notifications.length} mục</div>
                            </div>

                            <div className="space-y-2">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-3 rounded-lg border-l-4 flex items-start gap-3 ${notif.type === 'warning' ? 'border-red-400 bg-red-50' : notif.type === 'weather' ? 'border-blue-400 bg-blue-50' : 'border-indigo-400 bg-indigo-50'}`}
                                    >
                                        <div className="mt-1">
                                            {notif.type === 'warning' && <AlertCircle className="w-6 h-6 text-red-600" />}
                                            {notif.type === 'weather' && <CloudRain className="w-6 h-6 text-blue-600" />}
                                            {notif.type === 'info' && <Bell className="w-6 h-6 text-indigo-600" />}
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium">{notif.title}</div>
                                            <div className="text-xs text-gray-700">{notif.body}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {notif.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow p-3">
                            <h4 className="font-semibold text-sm mb-2">Hành động nhanh</h4>
                            <div className="flex flex-col gap-2">
                                <button className="w-full px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Gọi nhanh phụ huynh</button>
                                <button className="w-full px-3 py-2 rounded-md border text-sm">Gửi thông báo hàng loạt</button>
                                <button className="w-full px-3 py-2 rounded-md bg-rose-500 text-white text-sm">Báo cáo sự cố</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL CHAT - HOẠT ĐỘNG THẬT */}
                {isChatOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow w-full max-w-3xl h-[86vh] flex flex-col overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-white/10">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h2 className="text-lg font-bold">{getChatTitle()}</h2>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-3 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Tìm trong cuộc trò chuyện..."
                                        value={messageSearch}
                                        onChange={(e) => setMessageSearch(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto p-3 space-y-3">
                                {filteredMessages.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm">Chưa có tin nhắn nào</p>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'driver' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'driver' ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-3 border-t bg-gray-50">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                                        className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-2 rounded-full"
                                    >
                                        <Send className="w-5 h-5" />
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
