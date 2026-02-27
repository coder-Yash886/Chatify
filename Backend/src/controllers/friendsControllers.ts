import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface Friendship {
  user1: string;
  user2: string;
  createdAt: string;
}

// In-memory storage
const friendships = new Map<string, Friendship>();
const onlineUsers = new Set<string>();

// Helper to create friendship ID
const getFriendshipId = (user1: string, user2: string): string => {
  return [user1, user2].sort().join('_');
};

export const getFriends = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userFriends: any[] = [];
  
  friendships.forEach((friendship) => {
    if (friendship.user1 === req.user!.identifier || friendship.user2 === req.user!.identifier) {
      const friendId = friendship.user1 === req.user!.identifier 
        ? friendship.user2 
        : friendship.user1;
      
      userFriends.push({
        username: friendId.split('@')[0],
        identifier: friendId,
        isOnline: onlineUsers.has(friendId),
      });
    }
  });

  res.json({
    success: true,
    friends: userFriends,
    onlineCount: userFriends.filter(f => f.isOnline).length,
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

  const friendshipId = getFriendshipId(req.user.identifier, friendEmail);

  if (friendships.has(friendshipId)) {
    res.status(400).json({ success: false, error: 'Already friends' });
    return;
  }

  const friendship: Friendship = {
    user1: req.user.identifier,
    user2: friendEmail,
    createdAt: new Date().toISOString(),
  };

  friendships.set(friendshipId, friendship);

  console.log(`✅ Friendship created: ${req.user.identifier} ↔ ${friendEmail}`);

  res.json({
    success: true,
    message: 'Friend added successfully',
    friendship,
  });
};

export const setUserOnline = (userId: string): void => {
  onlineUsers.add(userId);
  console.log(`🟢 User online: ${userId}`);
};

export const setUserOffline = (userId: string): void => {
  onlineUsers.delete(userId);
  console.log(`🔴 User offline: ${userId}`);
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};