import React, { useEffect, useState } from 'react';
import { Users, Bell, MessageSquare, UserPlus } from 'lucide-react';
import { getFriends, getNotifications, type Friend, type Notification } from '../api/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  onStartDM?: (userId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartDM }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); 
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [friendsData, notificationsData] = await Promise.all([
        getFriends(),
        getNotifications(),
      ]);

      setFriends(friendsData.friends);
      setOnlineCount(friendsData.onlineCount);
      setNotifications(notificationsData.notifications);
      setUnreadCount(notificationsData.unreadCount);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Friends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Friends</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{friends.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Online Friends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online Now</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{onlineCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="relative">
                <Users className="w-8 h-8 text-green-600" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Unread Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="text-3xl font-bold text-primary-600 mt-1">{unreadCount}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Bell className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friends List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Friends</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition">
                <UserPlus className="w-4 h-4" />
                Add Friend
              </button>
            </div>
          </div>
          <div className="p-6">
            {friends.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No friends yet</p>
                <p className="text-sm mt-1">Add friends to start chatting</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.slice(0, 5).map((friend) => (
                  <div
                    key={friend.identifier}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {friend.username[0].toUpperCase()}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{friend.username}</p>
                        <p className="text-xs text-gray-500">
                          {friend.isOnline ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Online
                            </span>
                          ) : (
                            'Offline'
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onStartDM?.(friend.identifier)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Send Message"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {friends.length > 5 && (
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
                    View all {friends.length} friends
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
          </div>
          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition hover:shadow-sm ${
                      notification.isRead
                        ? 'bg-white border-gray-100'
                        : 'bg-primary-50 border-primary-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {notification.from}
                          </p>
                          {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length > 5 && (
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
                    View all notifications
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;