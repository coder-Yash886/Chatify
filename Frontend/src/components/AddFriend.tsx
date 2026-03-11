import React, { useState } from "react";
import axios from "axios";

interface AddFriendProps {
  onClose: () => void;
  onFriendAdded: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ onClose, onFriendAdded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter an email");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/friends/add", { email: email.trim() });
      onFriendAdded();
      onClose();
    } catch {
      setError("Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Friend</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-white/70 hover:bg-white/5 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Friend email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-indigo-500"
              placeholder="name@example.com"
            />
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/0 px-4 py-3 font-semibold text-white/80 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFriend;


