import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { users } from './authController';

interface Friendship {
  user1: string;
  user2: string;
  createdAt: string;
}

const friendships = new Map<string, Friendship>();
const onlineUsers = new Set<string>();

const getFriendshipId = (user1: string, user2: string): string => {
  return [user1, user2].sort().join('_');
};



// ================= GET FRIENDS =================

export const getFriends = (req: AuthRequest, res: Response): void => {

  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userFriends: any[] = [];

  friendships.forEach((friendship) => {

    if (
      friendship.user1 === req.user!.identifier ||
      friendship.user2 === req.user!.identifier
    ) {

      const friendId =
        friendship.user1 === req.user!.identifier
          ? friendship.user2
          : friendship.user1;

      const friend = users.get(friendId);

      userFriends.push({
        username: friend?.username || friendId.split('@')[0],
        identifier: friendId,
        isOnline: onlineUsers.has(friendId),
      });
    }
  });

  console.log(`👥 ${req.user.username} has ${userFriends.length} friends`);

  res.json({
    success: true,
    friends: userFriends,
    onlineCount: userFriends.filter((f) => f.isOnline).length,
  });
};



// ================= ADD FRIEND =================

export const addFriend = (req: AuthRequest, res: Response): void => {

  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { friendEmail } = req.body;

  console.log(`🔍 Add friend: ${req.user.identifier} → ${friendEmail}`);

  if (!friendEmail) {
    res.status(400).json({ success: false, error: 'Friend email required' });
    return;
  }

  if (friendEmail === req.user.identifier) {
    res.status(400).json({ success: false, error: 'Cannot add yourself' });
    return;
  }

  const friend = users.get(friendEmail);

  if (!friend) {
    console.log(`❌ User not found: ${friendEmail}`);
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }

  const friendshipId = getFriendshipId(req.user.identifier, friendEmail);

  if (friendships.has(friendshipId)) {
    console.log(`⚠️ Already friends`);
    res.status(400).json({ success: false, error: 'Already friends' });
    return;
  }

  friendships.set(friendshipId, {
    user1: req.user.identifier,
    user2: friendEmail,
    createdAt: new Date().toISOString(),
  });

  console.log(`✅ Friendship created: ${req.user.identifier} ↔ ${friendEmail}`);

  res.json({
    success: true,
    message: 'Friend added successfully',
  });
};



// ================= ONLINE STATUS =================

export const setUserOnline = (userId: string): void => {
  onlineUsers.add(userId);
  console.log(`🟢 ${userId} online`);
};

export const setUserOffline = (userId: string): void => {
  onlineUsers.delete(userId);
  console.log(`🔴 ${userId} offline`);
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};