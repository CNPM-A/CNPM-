import React, { useState, useEffect } from 'react';
import { BellIcon } from '../../components/parent/Icons';
import io from 'socket.io-client';

interface Notification {
  id: number | string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'neutral' | 'warning';
  evidenceUrl?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Bus Arriving', message: 'The bus is 5 minutes away from your pickup point.', time: '2 mins ago', type: 'info' },
  { id: 2, title: 'Student On Board', message: 'Nguyen Van A has successfully boarded the bus.', time: '15 mins ago', type: 'success' },
  { id: 3, title: 'Trip Started', message: 'Morning Route #12 has started.', time: '30 mins ago', type: 'neutral' },
  { id: 4, title: 'Payment Due', message: 'Monthly bus fee is due next Monday.', time: '1 day ago', type: 'warning' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    // Connect to socket to listen for real-time notifications
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('student:checked_in', (data: any) => {
      const newNotification: Notification = {
        id: Date.now(),
        title: 'Học sinh đã check-in',
        message: `${data.studentName || 'Học sinh'} đã lên xe thành công`,
        time: 'Vừa xong',
        type: 'success',
        evidenceUrl: data.evidenceUrl
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">Mark all as read</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {notifications.map((notif, index) => (
          <div 
            key={notif.id} 
            className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${index !== notifications.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 
              ${notif.type === 'info' ? 'bg-blue-100 text-blue-600' : 
                notif.type === 'success' ? 'bg-green-100 text-green-600' : 
                notif.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}
            >
              <BellIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              {notif.evidenceUrl && (
                <div className="mt-2">
                  <img 
                    src={notif.evidenceUrl} 
                    alt="Check-in evidence" 
                    className="w-20 h-20 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(notif.evidenceUrl, '_blank')}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            {index === 0 && (
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}