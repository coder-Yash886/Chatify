// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Search, 
//   Bell, 
//   User, 
//   LogOut, 
//   MessageSquare, 
//   Users, 
//   Settings,
//   UserPlus,
//   TrendingUp,
//   Activity,
//   Clock,
//   CheckCircle,
//   Star
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { 
//   getFriends, 
//   getNotifications, 
//   searchUsers,
//   addFriend,
//   type Friend, 
//   type Notification,
//   type UserProfile 
// } from '../api/api';
// import { formatDistanceToNow, format, subDays } from 'date-fns';
// import DMChat from '../components/DMChat';

// const Dashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);
//   const [onlineCount, setOnlineCount] = useState(0);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Mock data for charts
//   const monthlyData = [
//     { month: 'Jan', messages: 0 },
//     { month: 'Feb', messages: 0 },
//     { month: 'Mar', messages: 0 },
//     { month: 'Apr', messages: 0 },
//     { month: 'May', messages: 0 },
//     { month: 'Jun', messages: 0 },
//     { month: 'Jul', messages: 0 },
//     { month: 'Aug', messages: 0 },
//     { month: 'Sep', messages: 0 },
//     { month: 'Oct', messages: 0 },
//     { month: 'Nov', messages: 0 },
//     { month: 'Dec', messages: 0 },
//   ];

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
//       console.error('Failed to load data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await searchUsers(searchQuery.trim());
//       setSearchResults(response.users);
//     } catch (error) {
//       console.error('Search failed:', error);
//     }
//   };

//   const handleAddFriend = async (email: string) => {
//     try {
//       await addFriend(email);
//       alert('Friend request sent!');
//       loadData();
//     } catch (error) {
//       console.error('Failed to add friend:', error);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   const handleStartChat = (userId: string) => {
//     setSelectedChat(userId);
//   };

//   // Calculate rating (mock)
//   const overallRating = 4.5;
//   const totalReviews = friends.length * 15;
//   const sinceLast = Math.floor(Math.random() * 100);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation Bar */}
//       <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo & Menu */}
//             <div className="flex items-center gap-8">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
//                   <MessageSquare className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-lg font-semibold text-gray-800">Chattify</span>
//               </div>
              
//               <div className="hidden md:flex items-center gap-1">
//                 <button className="px-4 py-2 text-teal-600 bg-teal-50 rounded-lg font-medium text-sm">
//                   Overview
//                 </button>
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
//                   Messages
//                 </button>
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
//                   Friends
//                 </button>
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
//                   Settings
//                 </button>
//               </div>
//             </div>

//             {/* Right Icons */}
//             <div className="flex items-center gap-3">
//               {/* Search */}
//               <div className="relative">
//                 <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
//                   <Search className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Notifications */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowNotifications(!showNotifications)}
//                   className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
//                 >
//                   <Bell className="w-5 h-5" />
//                   {unreadCount > 0 && (
//                     <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>
//               </div>

//               {/* Profile */}
//               <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
//                 <span className="text-sm font-medium text-gray-700 hidden md:block">
//                   Dr. {user?.username || 'User'}
//                 </span>
//                 <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   {user?.username?.[0]?.toUpperCase() || 'U'}
//                 </div>
//                 <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
//                   <LogOut className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {selectedChat ? (
//           <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-[calc(100vh-10rem)] shadow-sm">
//             <DMChat otherUserId={selectedChat} onBack={() => setSelectedChat(null)} />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//             {/* Left Column - Main Stats */}
//             <div className="lg:col-span-8 space-y-6">
//               {/* Overall Rating Card */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-semibold text-gray-600 mb-4">Overall Rating</h3>
//                 <div className="flex items-start gap-8">
//                   <div>
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-5xl font-bold text-gray-900">{overallRating}</span>
//                       <div className="flex text-yellow-400">
//                         {[...Array(5)].map((_, i) => (
//                           <Star 
//                             key={i} 
//                             className="w-5 h-5" 
//                             fill={i < Math.floor(overallRating) ? "currentColor" : "none"}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                     <p className="text-sm text-teal-600 mt-2">
//                       +{sinceLast} points from last month
//                     </p>
//                   </div>

//                   {/* Mini Chart */}
//                   <div className="flex-1">
//                     <div className="flex items-end h-24 gap-1">
//                       {monthlyData.slice(-8).map((data, i) => (
//                         <div key={i} className="flex-1 flex flex-col items-center">
//                           <div 
//                             className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
//                             style={{ height: `${(data.messages / 520) * 100}%` }}
//                           />
//                           <span className="text-xs text-gray-400 mt-1">{data.month}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Public Reviews Card */}
//                 <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//                   <h3 className="text-sm font-semibold text-gray-600 mb-4">Activity Stats</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Total Messages</span>
//                       <span className="text-2xl font-bold text-gray-900">{totalReviews}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-teal-600 flex items-center gap-1">
//                         <TrendingUp className="w-4 h-4" />
//                         This Month
//                       </span>
//                       <span className="text-lg font-semibold text-teal-600">+{monthlyData[monthlyData.length - 1].messages}</span>
//                     </div>
//                   </div>
                  
//                   {/* Activity Chart */}
//                   <div className="mt-6 flex items-end h-32 gap-1">
//                     {monthlyData.slice(-12).map((data, i) => {
//                       const isHighlight = i >= 8;
//                       return (
//                         <div key={i} className="flex-1 flex flex-col items-center">
//                           <div 
//                             className={`w-full rounded-t transition-all ${
//                               isHighlight 
//                                 ? 'bg-gradient-to-t from-teal-500 to-teal-400' 
//                                 : 'bg-gray-200'
//                             }`}
//                             style={{ height: `${(data.messages / 520) * 100}%` }}
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Connection Status */}
//                 <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border border-teal-200 p-6 shadow-sm">
//                   <h3 className="text-sm font-semibold text-teal-800 mb-6">Connection Status</h3>
//                   <div className="flex items-center justify-center mb-4">
//                     <div className="relative">
//                       <svg className="w-32 h-32 transform -rotate-90">
//                         <circle
//                           cx="64"
//                           cy="64"
//                           r="56"
//                           stroke="#d1fae5"
//                           strokeWidth="8"
//                           fill="none"
//                         />
//                         <circle
//                           cx="64"
//                           cy="64"
//                           r="56"
//                           stroke="#10b981"
//                           strokeWidth="8"
//                           fill="none"
//                           strokeDasharray={`${(onlineCount / friends.length || 0) * 351.86} 351.86`}
//                           className="transition-all duration-1000"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center">
//                           <CheckCircle className="w-10 h-10 text-white" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-2xl font-bold text-teal-900">Active!</p>
//                     <p className="text-sm text-teal-700 mt-1">
//                       <span className="font-bold">{Math.round((onlineCount / friends.length || 0) * 100)}%</span> of friends online
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Latest Reviews / Recent Activity */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
//                   <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
//                     View All
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {friends.slice(0, 3).map((friend, idx) => (
//                     <div key={friend.identifier} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
//                       <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//                         {friend.username[0].toUpperCase()}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <p className="font-semibold text-gray-900">{friend.username}</p>
//                           <div className="flex text-yellow-400">
//                             {[...Array(5)].map((_, i) => (
//                               <Star key={i} className="w-3 h-3" fill="currentColor" />
//                             ))}
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             {idx === 0 ? '2 hours ago' : idx === 1 ? '5 hours ago' : '1 day ago'}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 line-clamp-2">
//                           Great connection! Very responsive and helpful. Looking forward to more conversations.
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleStartChat(friend.identifier)}
//                         className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
//                       >
//                         <MessageSquare className="w-5 h-5" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Quick Stats */}
//             <div className="lg:col-span-4 space-y-6">
//               {/* Online Requests */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-semibold text-gray-600">Online Friends</h3>
//                   <button className="text-gray-400 hover:text-gray-600">
//                     <Settings className="w-4 h-4" />
//                   </button>
//                 </div>
                
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="relative">
//                     <svg className="w-40 h-40 transform -rotate-90">
//                       <circle
//                         cx="80"
//                         cy="80"
//                         r="70"
//                         stroke="#e5e7eb"
//                         strokeWidth="12"
//                         fill="none"
//                       />
//                       <circle
//                         cx="80"
//                         cy="80"
//                         r="70"
//                         stroke="url(#gradient)"
//                         strokeWidth="12"
//                         fill="none"
//                         strokeDasharray={`${(onlineCount / friends.length || 0) * 439.82} 439.82`}
//                         className="transition-all duration-1000"
//                       />
//                       <defs>
//                         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                           <stop offset="0%" stopColor="#3b82f6" />
//                           <stop offset="100%" stopColor="#06b6d4" />
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center">
//                       <p className="text-4xl font-bold text-gray-900">{onlineCount}</p>
//                       <p className="text-sm text-gray-500">of {friends.length}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                     <span className="text-gray-600">Online</span>
//                   </div>
//                   <span className="font-semibold">{onlineCount}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm mt-2">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
//                     <span className="text-gray-600">Offline</span>
//                   </div>
//                   <span className="font-semibold">{friends.length - onlineCount}</span>
//                 </div>
//               </div>

//               {/* Friends List */}
//               <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-semibold text-gray-600">Friends</h3>
//                   <button className="text-teal-600 hover:text-teal-700">
//                     <UserPlus className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {friends.length === 0 ? (
//                   <div className="text-center py-8 text-gray-400">
//                     <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                     <p className="text-sm">No friends yet</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3 max-h-96 overflow-y-auto">
//                     {friends.map((friend) => (
//                       <button
//                         key={friend.identifier}
//                         onClick={() => handleStartChat(friend.identifier)}
//                         className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition text-left"
//                       >
//                         <div className="relative">
//                           <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
//                             {friend.username[0].toUpperCase()}
//                           </div>
//                           {friend.isOnline && (
//                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                           )}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-900 truncate">{friend.username}</p>
//                           <p className="text-xs text-gray-500">
//                             {friend.isOnline ? (
//                               <span className="text-green-600">Online</span>
//                             ) : (
//                               'Offline'
//                             )}
//                           </p>
//                         </div>
//                         <MessageSquare className="w-4 h-4 text-gray-400" />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Activity Summary */}
//               <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
//                 <h3 className="text-sm font-semibold text-blue-900 mb-4">Today's Activity</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-blue-700">Messages Sent</span>
//                     <span className="font-bold text-blue-900">0</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-blue-700">Active Time</span>
//                     <span className="font-bold text-blue-900">0 hour</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-blue-700">Response Rate</span>
//                     <span className="font-bold text-green-600">0%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



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


