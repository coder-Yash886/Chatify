import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import UserModel from '../models/User';

const onlineUsers = new Set<string>();

export const getFriends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await UserModel.findOne({ email: req.user.identifier });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const friendsList = await Promise.all(
      user.friends.map(async (friendEmail) => {
        const friend = await UserModel.findOne({ email: friendEmail });
        if (friend) {
          const isOnline = onlineUsers.has(friend.email);
          return {
            username: friend.username,
            identifier: friend.email,
            isOnline: isOnline, // Use real-time online status
          };
        }
        return null;
      })
    );

    const validFriends = friendsList.filter(f => f !== null);

    console.log(`👥 ${req.user.username} has ${validFriends.length} friends (${validFriends.filter(f => f?.isOnline).length} online)`);

    res.json({
      success: true,
      friends: validFriends,
      onlineCount: validFriends.filter(f => f?.isOnline).length,
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const addFriend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { friendEmail } = req.body;

    console.log(`🔍 Add friend request: ${req.user.identifier} → ${friendEmail}`);

    if (!friendEmail) {
      res.status(400).json({ success: false, error: 'Friend email required' });
      return;
    }

    if (friendEmail === req.user.identifier) {
      res.status(400).json({ success: false, error: 'Cannot add yourself as friend' });
      return;
    }

    const friendUser = await UserModel.findOne({ email: friendEmail });

    if (!friendUser) {
      console.log(`❌ User not found: ${friendEmail}`);
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const currentUser = await UserModel.findOne({ email: req.user.identifier });

    if (!currentUser) {
      res.status(404).json({ success: false, error: 'Current user not found' });
      return;
    }

    if (currentUser.friends.includes(friendEmail)) {
      console.log(`⚠️ Already friends: ${req.user.identifier} ↔ ${friendEmail}`);
      res.status(400).json({ success: false, error: 'Already friends' });
      return;
    }

    currentUser.friends.push(friendEmail);
    await currentUser.save();

    if (!friendUser.friends.includes(req.user.identifier)) {
      friendUser.friends.push(req.user.identifier);
      await friendUser.save();
    }

    console.log(`✅ Friendship created: ${req.user.identifier} ↔ ${friendEmail}`);

    res.json({
      success: true,
      message: 'Friend added successfully',
    });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const setUserOnline = (userId: string): void => {
  onlineUsers.add(userId);
  console.log(`🟢 User online: ${userId} (Total online: ${onlineUsers.size})`);
};

export const setUserOffline = (userId: string): void => {
  onlineUsers.delete(userId);
  console.log(`🔴 User offline: ${userId} (Total online: ${onlineUsers.size})`);
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};