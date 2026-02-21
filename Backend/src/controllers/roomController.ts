import { Response } from 'express';
import { Room, RoomInfo } from '../types';
import { AuthRequest } from '../middleware/auth';

export const rooms = new Map<string, Room>();

rooms.set('general', { name: 'General', users: new Set(), messages: [] });
rooms.set('random', { name: 'Random', users: new Set(), messages: [] });
rooms.set('tech', { name: 'Tech Talk', users: new Set(), messages: [] });

export const getRooms = (req: AuthRequest, res: Response): void => {
  const roomList: RoomInfo[] = Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    name: room.name,
    userCount: room.users.size,
  }));
  res.json({ success: true, rooms: roomList });
};

export const createRoom = (req: AuthRequest, res: Response): void => {
  const { roomId, roomName } = req.body;

  if (!roomId || !roomName) {
    res.status(400).json({ success: false, error: 'Room ID and name required' });
    return;
  }

  if (rooms.has(roomId)) {
    res.status(400).json({ success: false, error: 'Room already exists' });
    return;
  }

  rooms.set(roomId, { name: roomName, users: new Set(), messages: [] });
  res.json({ success: true, message: 'Room created', room: { id: roomId, name: roomName, userCount: 0 } });
};

export const addUserToRoom = (roomId: string, username: string): Room | null => {
  const room = rooms.get(roomId);
  if (room) {
    room.users.add(username);
    return room;
  }
  return null;
};

export const removeUserFromRoom = (roomId: string, username: string): Room | null => {
  const room = rooms.get(roomId);
  if (room) {
    room.users.delete(username);
    return room;
  }
  return null;
};