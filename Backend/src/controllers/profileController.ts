import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserProfile } from '../types';
import { users } from './authController';

// In-memory storage
const profiles = new Map<string, UserProfile>();

export const getProfile = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

//   const { userId } = req.params;
//   const profile = profiles.get(userId || req.user.identifier);
      
  const userId = (req.params.userId as string) || req.user.identifier;
  const profile = profiles.get(userId);

  if (!profile) {
    res.status(404).json({ success: false, error: 'Profile not found' });
    return;
  }

  res.json({
    success: true,
    profile,
  });
};

export const updateProfile = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { avatar, bio, status, statusMessage } = req.body;

  let profile = profiles.get(req.user.identifier);
  
  if (!profile) {
    const user = users.get(req.user.identifier);
    profile = {
      username: req.user.username,
      email: req.user.identifier,
      status: 'online',
      createdAt: new Date(),
      lastSeen: new Date(),
    };
  }

  if (avatar !== undefined) profile.avatar = avatar;
  if (bio !== undefined) profile.bio = bio;
  if (status !== undefined) profile.status = status;
  if (statusMessage !== undefined) profile.statusMessage = statusMessage;

  profiles.set(req.user.identifier, profile);

  res.json({
    success: true,
    profile,
  });
};

export const updateStatus = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { status } = req.body;

  if (!['online', 'offline', 'away', 'busy'].includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status' });
    return;
  }

  let profile = profiles.get(req.user.identifier);
  
  if (profile) {
    profile.status = status;
    profile.lastSeen = new Date();
    profiles.set(req.user.identifier, profile);
  }

  res.json({ success: true, status });
};

export const searchUsers = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ success: false, error: 'Search query required' });
    return;
  }

  const searchQuery = query.toLowerCase();
  const results: UserProfile[] = [];

  profiles.forEach((profile, userId) => {
    if (
      userId !== req.user!.identifier &&
      (profile.username.toLowerCase().includes(searchQuery) ||
       profile.email.toLowerCase().includes(searchQuery))
    ) {
      results.push(profile);
    }
  });

  res.json({
    success: true,
    users: results,
  });
};