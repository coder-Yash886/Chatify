import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import UserModel from "../models/User";

interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: "online" | "offline" | "away" | "busy";
  statusMessage?: string;
  createdAt: string;
  lastSeen: string;
}

const profiles = new Map<string, UserProfile>();

// ================= GET PROFILE =================
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const userId = (req.params.userId as string) || req.user.identifier;

    let profile = profiles.get(userId);

    if (!profile) {
      const user = await UserModel.findOne({ email: userId });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      profile = {
        username: user.username,
        email: user.email,
        status: "offline",
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      };

      profiles.set(userId, profile);
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const { avatar, bio, statusMessage } = req.body;

    let profile = profiles.get(req.user.identifier);

    if (!profile) {
      const user = await UserModel.findOne({ email: req.user.identifier });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      profile = {
        username: user.username,
        email: user.email,
        status: "online",
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
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= UPDATE STATUS =================
export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const { status } = req.body;

    if (!["online", "offline", "away", "busy"].includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status" });
      return;
    }

    let profile = profiles.get(req.user.identifier);

    if (!profile) {
      const user = await UserModel.findOne({ email: req.user.identifier });

      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      profile = {
        username: user.username,
        email: user.email,
        status: "online",
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
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ================= SEARCH USERS =================
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }

    const query = (req.query.query as string)?.toLowerCase();

    if (!query) {
      res.json({ success: true, users: [] });
      return;
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    const results: UserProfile[] = [];

    users.forEach((user) => {
      if (user.email === req.user!.identifier) return;

      let profile = profiles.get(user.email);

      if (!profile) {
        profile = {
          username: user.username,
          email: user.email,
          status: "offline",
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
        };
      }

      results.push(profile);
    });

    res.json({
      success: true,
      users: results,
    });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};