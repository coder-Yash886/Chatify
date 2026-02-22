import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { users } from './authController';

const friendships = new Map<string, Set<string>>();
const onlineUsers = new Set<string>();

export const getFriends = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userFriends = friendships.get(req.user.identifier) || new Set();
  const friendsList = Array.from(userFriends).map((friendId) => {
    const user = users.get(friendId);
    return {
      username: user?.username || friendId,
      identifier: friendId,
      isOnline: onlineUsers.has(friendId),
      lastSeen: new Date(),
    };
  });

  res.json({
    success: true,
    friends: friendsList,
    onlineCount: friendsList.filter(f => f.isOnline).length,
  });
};

export const addFriend = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { friendEmail } = req.body;

  if (!friendEmail) {
    res.status(400).json({ success: false, error: 'Friend email required' });
    return;
  }

  if (friendEmail === req.user.identifier) {
    res.status(400).json({ success: false, error: 'Cannot add yourself as friend' });
    return;
  }

  if (!users.has(friendEmail)) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  if (!friendships.has(req.user.identifier)) {
    friendships.set(req.user.identifier, new Set());
  }
  if (!friendships.has(friendEmail)) {
    friendships.set(friendEmail, new Set());
  }

  friendships.get(req.user.identifier)!.add(friendEmail);
  friendships.get(friendEmail)!.add(req.user.identifier);

  res.json({
    success: true,
    message: 'Friend added successfully',
  });
};

export const setUserOnline = (identifier: string): void => {
  onlineUsers.add(identifier);
};

export const setUserOffline = (identifier: string): void => {
  onlineUsers.delete(identifier);
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};