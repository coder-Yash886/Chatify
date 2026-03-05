import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface DirectMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

const messages = new Map<string, DirectMessage[]>();

const getConversationId = (user1: string, user2: string): string => {
  return [user1, user2].sort().join('_');
};

export const getConversations = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userConversations: any[] = [];
  
  messages.forEach((msgs, convId) => {
    const participants = convId.split('_');
    if (participants.includes(req.user!.identifier)) {
      const otherUser = participants.find(p => p !== req.user!.identifier);
      const lastMessage = msgs[msgs.length - 1];
      
      userConversations.push({
        id: convId,
        otherUser,
        lastMessage,
        unreadCount: msgs.filter(m => !m.isRead && m.to === req.user!.identifier).length,
      });
    }
  });

  res.json({
    success: true,
    conversations: userConversations,
  });
};

export const getDirectMessages = (req: AuthRequest, res: Response): void => {
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
  const convMessages = messages.get(convId) || [];

  console.log(`📨 Loading messages: ${convId} (${convMessages.length} messages)`);

  res.json({
    success: true,
    messages: convMessages,
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
    text: text.trim(),
    timestamp: new Date().toISOString(),
    isRead: false,
    type,
    fileUrl,
    fileName,
  };

  if (!messages.has(convId)) {
    messages.set(convId, []);
  }
  
  messages.get(convId)!.push(message);

  console.log(`✅ Message: ${req.user.identifier} → ${to}: "${text}"`);

  res.json({
    success: true,
    message,
  });
};

export const markDMAsRead = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { otherUserId } = req.body;
  
  if (!otherUserId) {
    res.status(400).json({ success: false, error: 'User ID required' });
    return;
  }
  
  const convId = getConversationId(req.user.identifier, otherUserId);
  const convMessages = messages.get(convId) || [];
  
  convMessages.forEach((msg) => {
    if (msg.to === req.user!.identifier) {
      msg.isRead = true;
    }
  });

  res.json({ success: true });
};