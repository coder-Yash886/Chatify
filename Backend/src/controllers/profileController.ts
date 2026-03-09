import { Response } from 'express';
   import { AuthRequest } from '../middleware/auth';
   import UserModel from '../models/User';

   export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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

       res.json({
         success: true,
         profile: {
           username: user.username,
           email: user.email,
           profilePicture: user.profilePicture || '',
           bio: user.bio || '',
           status: user.status || 'Hey there! I am using Chatty',
           createdAt: user.createdAt,
         },
       });
     } catch (error) {
       console.error('Get profile error:', error);
       res.status(500).json({ success: false, error: 'Server error' });
     }
   };

   export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
     try {
       const { userId } = req.params;
       const user = await UserModel.findOne({ email: userId });

       if (!user) {
         res.status(404).json({ success: false, error: 'User not found' });
         return;
       }

       res.json({
         success: true,
         profile: {
           username: user.username,
           email: user.email,
           profilePicture: user.profilePicture || '',
           bio: user.bio || '',
           status: user.status || 'Hey there! I am using Chatty',
         },
       });
     } catch (error) {
       console.error('Get user profile error:', error);
       res.status(500).json({ success: false, error: 'Server error' });
     }
   };

   export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
     try {
       if (!req.user) {
         res.status(401).json({ success: false, error: 'Not authenticated' });
         return;
       }

       const { username, bio, status, profilePicture } = req.body;
       const user = await UserModel.findOne({ email: req.user.identifier });

       if (!user) {
         res.status(404).json({ success: false, error: 'User not found' });
         return;
       }

       if (username && username.trim()) user.username = username.trim();
       if (bio !== undefined) user.bio = bio.trim().substring(0, 200);
       if (status !== undefined) user.status = status.trim().substring(0, 100);
       if (profilePicture !== undefined) {
         if (profilePicture && profilePicture.length > 7000000) {
           res.status(400).json({ success: false, error: 'Profile picture too large' });
           return;
         }
         user.profilePicture = profilePicture;
       }

       await user.save();

       res.json({
         success: true,
         profile: {
           username: user.username,
           email: user.email,
           profilePicture: user.profilePicture || '',
           bio: user.bio || '',
           status: user.status || '',
         },
       });
     } catch (error) {
       console.error('Update profile error:', error);
       res.status(500).json({ success: false, error: 'Server error' });
     }
   };

   export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
     try {
       if (!req.user) {
         res.status(401).json({ success: false, error: 'Not authenticated' });
         return;
       }

       const { status } = req.body;
       const user = await UserModel.findOne({ email: req.user.identifier });

       if (!user) {
         res.status(404).json({ success: false, error: 'User not found' });
         return;
       }

       user.status = status?.trim().substring(0, 100) || 'Hey there! I am using Chatty';
       await user.save();

       res.json({ success: true, status: user.status });
     } catch (error) {
       console.error('Update status error:', error);
       res.status(500).json({ success: false, error: 'Server error' });
     }
   };