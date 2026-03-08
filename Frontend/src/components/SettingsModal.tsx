import React, { useState } from 'react';
import { X, Bell, Lock, Palette, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  console.log('⚙️ Settings Modal - Current theme:', theme);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    console.log('🎨 Theme button clicked:', newTheme);
    setTheme(newTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] light:bg-white rounded-2xl w-full max-w-md border border-gray-800 light:border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 light:border-gray-200">
          <h2 className="text-xl font-semibold text-white light:text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white light:text-gray-600 light:hover:text-gray-900 hover:bg-gray-800 light:hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white light:text-gray-900 mb-4">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0a0a0a] light:bg-gray-50 rounded-xl border border-gray-800 light:border-gray-200">
                <span className="text-sm text-gray-300 light:text-gray-700">Enable Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition relative cursor-pointer ${
                    notifications ? 'bg-blue-600' : 'bg-gray-700 light:bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      notifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0a0a0a] light:bg-gray-50 rounded-xl border border-gray-800 light:border-gray-200">
                <span className="text-sm text-gray-300 light:text-gray-700">Sound Effects</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 rounded-full transition relative cursor-pointer ${
                    soundEnabled ? 'bg-blue-600' : 'bg-gray-700 light:bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      soundEnabled ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white light:text-gray-900 mb-4">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-gray-800 light:border-gray-200 bg-[#0a0a0a] light:bg-gray-50 hover:border-gray-700 light:hover:border-gray-300'
                }`}
              >
                <Moon className="w-5 h-5 text-white light:text-gray-700 mb-2 mx-auto" />
                <span className="text-sm text-white light:text-gray-900 font-medium">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-gray-800 light:border-gray-200 bg-[#0a0a0a] light:bg-gray-50 hover:border-gray-700 light:hover:border-gray-300'
                }`}
              >
                <Sun className="w-5 h-5 text-white light:text-gray-700 mb-2 mx-auto" />
                <span className="text-sm text-white light:text-gray-900 font-medium">Light</span>
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white light:text-gray-900 mb-4">
              <Lock className="w-4 h-4" />
              Privacy & Security
            </h3>
            <button className="w-full p-3 bg-[#0a0a0a] light:bg-gray-50 rounded-xl border border-gray-800 light:border-gray-200 text-left hover:bg-gray-900 light:hover:bg-gray-100 transition cursor-pointer">
              <span className="text-sm text-gray-300 light:text-gray-700">Change Password</span>
            </button>
          </div>

          {/* Language */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white light:text-gray-900 mb-4">
              <Globe className="w-4 h-4" />
              Language
            </h3>
            <select className="w-full p-3 bg-[#0a0a0a] light:bg-gray-50 border border-gray-800 light:border-gray-200 rounded-xl text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 light:border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
