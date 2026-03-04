import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { users } from './authController';

interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  statusMessage?: string;
  createdAt: string;
  lastSeen: string;
}

const profiles = new Map<string, UserProfile>();

// ================= GET PROFILE =================
export const getProfile = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userId = (req.params.userId as string) || req.user.identifier;
  let profile = profiles.get(userId);

  if (!profile) {
    const user = users?.get(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    profile = {
      username: user.username,
      email: user.email,
      status: 'offline',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };

    profiles.set(userId, profile);
  }

  res.json({
    success: true,
    profile,
  });
};

// ================= UPDATE PROFILE =================
export const updateProfile = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { avatar, bio, statusMessage } = req.body;
  let profile = profiles.get(req.user.identifier);

  if (!profile) {
    const user = users?.get(req.user.identifier);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    profile = {
      username: user.username,
      email: user.email,
      status: 'online',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
  }

  if (avatar !== undefined) profile.avatar = avatar;
  if (bio !== undefined) profile.bio = bio;
  if (statusMessage !== undefined) profile.statusMessage = statusMessage;

  profiles.set(req.user.identifier, profile);

  res.json({
    success: true,
    profile,
  });
};

// ================= UPDATE STATUS =================
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

  if (!profile) {
    const user = users?.get(req.user.identifier);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    profile = {
      username: user.username,
      email: user.email,
      status: 'online',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
  }

  profile.status = status;
  profile.lastSeen = new Date().toISOString();

  profiles.set(req.user.identifier, profile);

  res.json({
    success: true,
    status,
  });
};

// ================= SEARCH USERS =================
export const searchUsers = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const query = (req.query.query as string)?.toLowerCase();

  if (!query) {
    res.json({ success: true, users: [] });
    return;
  }

  if (!users || typeof users.forEach !== 'function') {
    console.error("❌ USERS MAP NOT INITIALIZED");
    res.json({ success: true, users: [] });
    return;
  }

  const results: UserProfile[] = [];

  users.forEach((user, key) => {
    if (!user) return;

    // Skip self
    if (user.email === req.user!.identifier) return;

    if (
      user.username?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    ) {
      let profile = profiles.get(user.email);

      if (!profile) {
        profile = {
          username: user.username,
          email: user.email,
          status: 'offline',
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
        };
      }

      results.push(profile);
    }
  });

  console.log(`🔍 Search "${query}" → ${results.length} users found`);

  res.json({
    success: true,
    users: results,
  });
};