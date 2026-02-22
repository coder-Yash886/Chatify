import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'friend_accepted' | 'room_invite';
  from: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const notifications = new Map<string, Notification[]>();

export const getNotifications = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userNotifications = notifications.get(req.user.identifier) || [];
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  res.json({
    success: true,
    notifications: userNotifications,
    unreadCount,
  });
};

export const markAsRead = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { notificationId } = req.body;
  const userNotifications = notifications.get(req.user.identifier) || [];
  
  const notification = userNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }

  res.json({ success: true, message: 'Notification marked as read' });
};

export const createNotification = (
  userId: string,
  type: Notification['type'],
  from: string,
  content: string
): void => {
  if (!notifications.has(userId)) {
    notifications.set(userId, []);
  }

  const notification: Notification = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    from,
    content,
    timestamp: new Date(),
    isRead: false,
  };

  notifications.get(userId)!.unshift(notification);
  
  if (notifications.get(userId)!.length > 50) {
    notifications.get(userId)!.pop();
  }
};