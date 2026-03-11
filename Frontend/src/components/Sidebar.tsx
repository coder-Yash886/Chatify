import React, { useEffect, useState } from "react";
import axios from "axios";
import AddFriend from "./AddFriend";

interface Friend {
  _id: string;
  username: string;
  email: string;
}

const Sidebar: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/friends");
      setFriends(res.data);
    } catch {
      console.log("Failed to fetch friends");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFriends();
  }, []);

  return (
    <div className="w-80 h-screen bg-gray-100 border-r flex flex-col">

      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold">Friends</h2>
        <button
          onClick={() => setShowAddFriend(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          +
        </button>
      </div>

      {/* Friend List */}
      <div className="flex-1 overflow-y-auto">
        {friends.length === 0 ? (
          <p className="p-4 text-gray-500">No friends yet</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="p-4 border-b hover:bg-gray-200 cursor-pointer"
            >
              <p className="font-medium">{friend.username}</p>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showAddFriend && (
        <AddFriend
          onClose={() => setShowAddFriend(false)}
          onFriendAdded={fetchFriends}
        />
      )}
    </div>
  );
};

export default Sidebar;