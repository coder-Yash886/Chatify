import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface AddFriendProps {
  onClose: () => void;
  onFriendAdded?: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({
  onClose,
  onFriendAdded,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddFriend = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/friends/add",
        { email }
      );

      setMessage("✅ Friend request !");
      setEmail("");

      onFriendAdded?.();

      // Auto close after 2 sec (optional)
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err: any) {
      setError(
        err?.response?.data?.message || "❌ Failed to add friend"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add Friend</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          <input
            type="email"
            placeholder="Enter friend's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {message && (
            <div className="text-green-600 text-sm font-medium">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleAddFriend}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Sending Request..." : "Send Friend Request"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddFriend;