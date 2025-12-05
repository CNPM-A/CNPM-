import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import { SettingsIcon } from '../../components/parent/Icons';

// Moon and Sun icons for theme toggle
const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label, description }: { 
  enabled: boolean; 
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        enabled ? 'bg-orange-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function ParentSettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Settings State
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // User Info
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUserInfo({
        name: (user as any).name || '',
        email: (user as any).email || '',
        phoneNumber: (user as any).phoneNumber || ''
      });
    }

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleThemeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setMessage({ type: 'success', text: 'Đã chuyển sang chế độ tối' });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setMessage({ type: 'success', text: 'Đã chuyển sang chế độ sáng' });
    }
    setTimeout(() => setMessage(null), 2000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp.' });
      setLoading(false);
      return;
    }

    try {
      // SIMULATE API CALL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ type: 'success', text: 'Yêu cầu đổi mật khẩu đã được gửi thành công!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cài đặt</h1>
          <p className="text-slate-500">Quản lý tùy chọn và preferences của bạn</p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-100' 
            : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin tài khoản</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Họ và tên</span>
            <span className="text-sm font-medium text-slate-900">{userInfo.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-sm text-slate-500">Email</span>
            <span className="text-sm font-medium text-slate-900">{userInfo.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-500">Số điện thoại</span>
            <span className="text-sm font-medium text-slate-900">{userInfo.phoneNumber}</span>
          </div>
        </div>
      </div>

      {/* Theme Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Giao diện</h2>
        <p className="text-sm text-slate-500 mb-4">Tùy chỉnh giao diện hiển thị</p>
        
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Chế độ tối</p>
              <p className="text-xs text-slate-500 mt-1">Chuyển đổi giữa chế độ sáng và tối</p>
            </div>
            <button
              onClick={() => handleThemeToggle(!darkMode)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                darkMode ? 'bg-slate-700' : 'bg-orange-400'
              }`}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                  darkMode ? 'translate-x-9' : 'translate-x-1'
                }`}
              >
                {darkMode ? (
                  <MoonIcon className="w-4 h-4 text-slate-700" />
                ) : (
                  <SunIcon className="w-4 h-4 text-orange-500" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Thông báo</h2>
        <p className="text-sm text-slate-500 mb-4">Quản lý cách bạn nhận thông báo</p>
        
        <div className="divide-y divide-slate-100">
          <ToggleSwitch
            enabled={emailNotifications}
            onChange={setEmailNotifications}
            label="Thông báo qua Email"
            description="Nhận cập nhật qua email"
          />
          <ToggleSwitch
            enabled={pushNotifications}
            onChange={setPushNotifications}
            label="Thông báo Push"
            description="Nhận thông báo đẩy trên thiết bị"
          />
          <ToggleSwitch
            enabled={soundAlerts}
            onChange={setSoundAlerts}
            label="Cảnh báo âm thanh"
            description="Phát âm thanh khi có thông báo mới"
          />
        </div>
      </div>

      {/* Privacy Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Quyền riêng tư</h2>
        <p className="text-sm text-slate-500 mb-4">Kiểm soát quyền riêng tư của bạn</p>
        
        <div className="border-t border-slate-100">
          <ToggleSwitch
            enabled={locationTracking}
            onChange={setLocationTracking}
            label="Theo dõi vị trí"
            description="Cho phép ứng dụng truy cập vị trí của bạn"
          />
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h2>
            <p className="text-sm text-slate-500 mt-1">Cập nhật mật khẩu của bạn</p>
          </div>
          <ChevronDownIcon 
            className={`w-5 h-5 text-slate-400 transition-transform ${
              showPasswordSection ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="Nhập lại mật khẩu mới"
                required
                minLength={6}
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordSection(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
