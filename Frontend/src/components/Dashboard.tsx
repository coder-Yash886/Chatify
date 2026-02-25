// import React, { useEffect, useState } from 'react';
// import { Users, Bell, MessageSquare, UserPlus } from 'lucide-react';
// import { getFriends, getNotifications, type Friend, type Notification } from '../api/api';
// import { formatDistanceToNow } from 'date-fns';

// interface DashboardProps {
//   onStartDM?: (userId: string) => void;
// }

// const Dashboard: React.FC<DashboardProps> = ({ onStartDM }) => {
//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//     const interval = setInterval(loadData, 10000); 
//     return () => clearInterval(interval);
//   }, []);

//   const loadData = async () => {
//     try {
//       const [friendsData, notificationsData] = await Promise.all([
//         getFriends(),
//         getNotifications(),
//       ]);

//       setFriends(friendsData.friends);
//       setOnlineCount(friendsData.onlineCount);
//       setNotifications(notificationsData.notifications);
//       setUnreadCount(notificationsData.unreadCount);
//     } catch (error) {
//       console.error('Failed to load dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Total Friends */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Friends</p>
//               <p className="text-3xl font-bold text-gray-800 mt-1">{friends.length}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <Users className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {/* Online Friends */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Online Now</p>
//               <p className="text-3xl font-bold text-green-600 mt-1">{onlineCount}</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-lg">
//               <div className="relative">
//                 <Users className="w-8 h-8 text-green-600" />
//                 <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Unread Notifications */}
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Notifications</p>
//               <p className="text-3xl font-bold text-primary-600 mt-1">{unreadCount}</p>
//             </div>
//             <div className="bg-primary-100 p-3 rounded-lg">
//               <Bell className="w-8 h-8 text-primary-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Friends List */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-800">Friends</h3>
//               <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 transition">
//                 <UserPlus className="w-4 h-4" />
//                 Add Friend
//               </button>
//             </div>
//           </div>
//           <div className="p-6">
//             {friends.length === 0 ? (
//               <div className="text-center text-gray-400 py-8">
//                 <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                 <p className="font-medium">No friends yet</p>
//                 <p className="text-sm mt-1">Add friends to start chatting</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {friends.slice(0, 5).map((friend) => (
//                   <div
//                     key={friend.identifier}
//                     className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="relative">
//                         <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
//                           {friend.username[0].toUpperCase()}
//                         </div>
//                         {friend.isOnline && (
//                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
//                         )}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">{friend.username}</p>
//                         <p className="text-xs text-gray-500">
//                           {friend.isOnline ? (
//                             <span className="text-green-600 flex items-center gap-1">
//                               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                               Online
//                             </span>
//                           ) : (
//                             'Offline'
//                           )}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => onStartDM?.(friend.identifier)}
//                       className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition opacity-0 group-hover:opacity-100"
//                       title="Send Message"
//                     >
//                       <MessageSquare className="w-5 h-5" />
//                     </button>
//                   </div>
//                 ))}
//                 {friends.length > 5 && (
//                   <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
//                     View all {friends.length} friends
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Notifications */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//           <div className="p-6 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800">Recent Notifications</h3>
//           </div>
//           <div className="p-6">
//             {notifications.length === 0 ? (
//               <div className="text-center text-gray-400 py-8">
//                 <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                 <p className="font-medium">No notifications</p>
//                 <p className="text-sm mt-1">You're all caught up!</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {notifications.slice(0, 5).map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-3 rounded-lg border transition hover:shadow-sm ${
//                       notification.isRead
//                         ? 'bg-white border-gray-100'
//                         : 'bg-primary-50 border-primary-200'
//                     }`}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium text-gray-800 truncate">
//                             {notification.from}
//                           </p>
//                           {!notification.isRead && (
//                             <span className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full"></span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                           {notification.content}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">
//                           {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {notifications.length > 5 && (
//                   <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
//                     View all notifications
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  LogOut, 
  MessageSquare, 
  Users, 
  UserPlus,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getFriends, 
  getNotifications, 
  searchUsers,
  addFriend,
  type Friend, 
  type Notification,
  type UserProfile 
} from '../api/api';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const monthlyMessages = [145, 168, 142, 189, 215, 234, 268, 289, 312, 345, 378, 420];

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
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchUsers(searchQuery.trim());
      setSearchResults(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddFriend = async (email: string) => {
    try {
      await addFriend(email);
      alert('Friend request sent!');
      loadData();
      setShowSearch(false);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const overallRating = 4.2;
  const ratingIncrease = 0.6;
  const totalMessages = friends.length * 28;
  const monthlyIncrease = monthlyMessages[monthlyMessages.length - 1];
  const satisfactionRate = 94;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Chattify
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-1">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                  Overview
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">
                  Messages
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">
                  Friends
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition">
                  Settings
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    {notifications.slice(0, 5).map((notif) => (
                      <div key={notif.id} className="p-4 border-b hover:bg-gray-50">
                        <p className="text-sm font-medium">{notif.from}</p>
                        <p className="text-sm text-gray-600 mt-1">{notif.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) handleSearch();
                  }}
                  placeholder="Search for users..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className="border-t max-h-96 overflow-y-auto">
                {searchResults.map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(user.email)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section - Main Cards */}
          <div className="col-span-8 space-y-6">
            {/* Overall Rating Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-6">Overall Rating</h3>
              
              <div className="flex items-start gap-12">
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-6xl font-bold text-gray-900">{overallRating.toFixed(1)}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-6 h-6 text-yellow-400" 
                          fill={i < Math.floor(overallRating) ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">
                    +{ratingIncrease.toFixed(1)} points from last month
                  </p>
                </div>

                {/* Mini Chart */}
                <div className="flex-1">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[...Array(12)].map((_, i) => {
                      const height = 30 + (i * 5);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-gray-400">
                            {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Activity Stats */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-gray-500">Activity Stats</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Messages</span>
                      <span className="text-xs text-gray-500">Since Launch</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalMessages.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Since last month</span>
                    <span className="text-2xl font-bold">+{monthlyIncrease}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between h-24 gap-1">
                  {monthlyMessages.map((value, i) => (
                    <div key={i} className="flex-1">
                      <div 
                        className={`w-full rounded-t ${i >= 9 ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-gray-200'}`}
                        style={{ height: `${(value / 420) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Satisfaction Card */}
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                
                <div className="relative">
                  <h3 className="text-sm font-semibold opacity-90 mb-6">User Satisfaction</h3>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <svg className="w-36 h-36 transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          stroke="white"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${(satisfactionRate / 100) * 402} 402`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold mb-1">Great!</p>
                    <p className="text-sm opacity-90">
                      <span className="font-bold">{satisfactionRate}%</span> of users are satisfied
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium mb-1">No activity yet</p>
                  <p className="text-sm text-gray-400">Add friends to see their activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {friends.slice(0, 3).map((friend, idx) => (
                    <div key={friend.identifier} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {friend.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{friend.username}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">
                            {idx === 0 ? '2h ago' : idx === 1 ? '5h ago' : '1d ago'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Excellent experience! Very responsive and professional. Highly recommend for anyone looking for quality communication.
                        </p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Online Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-500">Online Status</h3>
                <button 
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <svg className="w-44 h-44 transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="76"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                      fill="none"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="76"
                      stroke="url(#donutGradient)"
                      strokeWidth="14"
                      fill="none"
                      strokeDasharray={`${((onlineCount / (friends.length || 1)) * 477)} 477`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">{onlineCount}</p>
                    <p className="text-sm text-gray-500">of {friends.length}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">Online</span>
                  </div>
                  <span className="font-semibold text-gray-900">{onlineCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <span className="text-gray-600">Offline</span>
                  </div>
                  <span className="font-semibold text-gray-900">{friends.length - onlineCount}</span>
                </div>
              </div>
            </div>

            {/* Friends List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Friends</h3>

              {friends.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No friends yet</p>
                  <button 
                    onClick={() => setShowSearch(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add friends to start chatting
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {friends.map((friend) => (
                    <button
                      key={friend.identifier}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition text-left group"
                    >
                      <div className="relative">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                          {friend.username[0].toUpperCase()}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{friend.username}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {friend.isOnline ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              Online
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Offline
                            </>
                          )}
                        </p>
                      </div>
                      <MessageSquare className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-sm font-semibold mb-4 opacity-90">Today's Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/20">
                  <span className="text-sm opacity-90">Messages Sent</span>
                  <span className="text-xl font-bold">24</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/20">
                  <span className="text-sm opacity-90">Active Time</span>
                  <span className="text-xl font-bold">1h 42m</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm opacity-90">Response Rate</span>
                  <span className="text-xl font-bold text-emerald-300">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;