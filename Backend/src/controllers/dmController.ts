import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DirectMessage, Conversation } from '../types';

// In-memory storage
const conversations = new Map<string, Conversation>();
const directMessages = new Map<string, DirectMessage[]>();

const getConversationId = (user1: string, user2: string): string => {
  return [user1, user2].sort().join('_');
};

export const getConversations = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userConversations: any[] = [];
  
  conversations.forEach((conv, convId) => {
    if (conv.participants.includes(req.user!.identifier)) {
      const otherUser = conv.participants.find(p => p !== req.user!.identifier);
      userConversations.push({
        id: convId,
        otherUser,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
      });
    }
  });

  res.json({
    success: true,
    conversations: userConversations,
  });
};

export const getMessages = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const otherUserId = req.params.otherUserId as string;
  
  if (!otherUserId) {
    res.status(400).json({ success: false, error: 'User ID required' });
    return;
  }
  
  const convId = getConversationId(req.user.identifier, otherUserId);
  const messages = directMessages.get(convId) || [];
  
  messages.forEach(msg => {
    if (msg.to === req.user!.identifier) {
      msg.isRead = true;
    }
  });

  res.json({
    success: true,
    messages,
  });
};

export const sendDirectMessage = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { to, text, type = 'text', fileUrl, fileName } = req.body;

  if (!to || !text) {
    res.status(400).json({ success: false, error: 'Recipient and message required' });
    return;
  }

  const convId = getConversationId(req.user.identifier, to);
  
  const message: DirectMessage = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    from: req.user.identifier,
    to,
    text,
    timestamp: new Date(),
    isRead: false,
    type,
    fileUrl,
    fileName,
  };

  if (!directMessages.has(convId)) {
    directMessages.set(convId, []);
  }
  directMessages.get(convId)!.push(message);

  if (!conversations.has(convId)) {
    conversations.set(convId, {
      participants: [req.user.identifier, to] as [string, string],
      unreadCount: 0,
      messages: [],
    });
  }
  
  const conv = conversations.get(convId)!;
  conv.lastMessage = message;
  conv.unreadCount++;

  res.json({
    success: true,
    message,
  });
};

export const markAsRead = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const otherUserId = req.body.otherUserId as string;
  
  if (!otherUserId) {
    res.status(400).json({ success: false, error: 'User ID required' });
    return;
  }
  
  const convId = getConversationId(req.user.identifier, otherUserId);
  const messages = directMessages.get(convId) || [];
  
  messages.forEach(msg => {
    if (msg.to === req.user!.identifier) {
      msg.isRead = true;
    }
  });

  const conv = conversations.get(convId);
  if (conv) {
    conv.unreadCount = 0;
  }

  res.json({ success: true });
};