import React, { useState } from 'react';
import { X, Bell, Lock, Palette, Globe, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Notifications */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-gray-800">
                <span className="text-sm text-gray-300">Enable Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition relative ${
                    notifications ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      notifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-gray-800">
                <span className="text-sm text-gray-300">Sound Effects</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 rounded-full transition relative ${
                    soundEnabled ? 'bg-blue-600' : 'bg-gray-700'
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
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border-2 transition ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700'
                }`}
              >
                <Moon className="w-5 h-5 text-white mb-2 mx-auto" />
                <span className="text-sm text-white">Dark</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border-2 transition ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-600/10'
                    : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700'
                }`}
              >
                <Sun className="w-5 h-5 text-white mb-2 mx-auto" />
                <span className="text-sm text-white">Light</span>
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Lock className="w-4 h-4" />
              Privacy & Security
            </h3>
            <button className="w-full p-3 bg-[#0a0a0a] rounded-xl border border-gray-800 text-left hover:bg-gray-900 transition">
              <span className="text-sm text-gray-300">Change Password</span>
            </button>
          </div>

          {/* Language */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Globe className="w-4 h-4" />
              Language
            </h3>
            <select className="w-full p-3 bg-[#0a0a0a] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;