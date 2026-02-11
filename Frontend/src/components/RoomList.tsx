import React, { useEffect, useState } from 'react';
import { Users, Hash } from 'lucide-react';
import { getRooms } from '../services/api';
import { Room } from '../types';
import { useWebSocket } from '../context/WebSocketContext';

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentRoom, joinRoom } = useWebSocket();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.rooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => joinRoom(room.id)}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg
            transition-all duration-200
            ${currentRoom === room.id
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5" />
            <span className="font-medium">{room.name}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4" />
            <span>{room.userCount}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RoomList;