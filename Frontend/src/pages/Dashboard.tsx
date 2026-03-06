
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  LogOut,
  MessageSquare,
  Users,
  Settings,
  UserPlus,
  Star,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DMChat from '../components/DMChat';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const overallRating = 0;
  const totalMessages = 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-lg">
                Chattify
              </span>
            </div>

            <div className="flex items-center gap-3">

              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.username || 'User'}
                </span>
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <button onClick={handleLogout}>
                  <LogOut className="w-4 h-4 text-gray-500" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {selectedChat ? (
          <div className="bg-white rounded-2xl border shadow-sm h-[calc(100vh-10rem)]">
            <DMChat
              otherUserId={selectedChat}
              onBack={() => setSelectedChat(null)}
            />
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-8 space-y-6">

              {/* Overall Rating */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">
                  Overall Rating
                </h3>

                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {overallRating}
                  </span>

                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-3">
                  +0 points from last month
                </p>
              </div>

              {/* Activity Stats */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">
                  Activity Stats
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Messages
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {totalMessages}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">
                    This Month
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    +0
                  </span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h3>

                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  No recent activity
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4 space-y-6">

              {/* Online Friends */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Online Friends
                  </h3>
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>

                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">
                    0
                  </p>
                  <p className="text-sm text-gray-500">
                    of 0 friends online
                  </p>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">
                  Today's Activity
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Messages Sent
                    </span>
                    <span className="font-bold">0</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Active Time
                    </span>
                    <span className="font-bold">0 hour</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Response Rate
                    </span>
                    <span className="font-bold">0%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default Dashboard;


