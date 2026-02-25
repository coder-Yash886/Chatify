import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  isRead: boolean;
  reactions: { emoji: string; userId: string }[];
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message[]>();

export const getConversations = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const userConversations: Conversation[] = [];
  
  conversations.forEach((conv) => {
    if (conv.participants.includes(req.user!.identifier)) {
      const convMessages = messages.get(conv.id) || [];
      userConversations.push({
        ...conv,
        messages: convMessages.slice(-1),
      });
    }
  });

  userConversations.sort((a, b) => {
    const aTime = new Date(a.lastMessage?.timestamp || a.createdAt).getTime();
    const bTime = new Date(b.lastMessage?.timestamp || b.createdAt).getTime();
    return bTime - aTime;
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

  const conversationId = req.params.conversationId as string;
  
  if (!conversationId) {
    res.status(400).json({ success: false, error: 'Conversation ID required' });
    return;
  }
  
  const conversation = conversations.get(conversationId);

  if (!conversation || !conversation.participants.includes(req.user.identifier)) {
    res.status(404).json({ success: false, error: 'Conversation not found' });
    return;
  }

  const convMessages = messages.get(conversationId) || [];

  res.json({
    success: true,
    messages: convMessages,
  });
};

export const sendMessage = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { conversationId, content, type = 'text', fileUrl, fileName } = req.body;
  
  if (!conversationId) {
    res.status(400).json({ success: false, error: 'Conversation ID required' });
    return;
  }
  
  const conversation = conversations.get(conversationId);

  if (!conversation || !conversation.participants.includes(req.user.identifier)) {
    res.status(404).json({ success: false, error: 'Conversation not found' });
    return;
  }

  const message: Message = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    conversationId,
    senderId: req.user.identifier,
    senderName: req.user.username,
    content,
    type,
    fileUrl,
    fileName,
    timestamp: new Date().toISOString(),
    isRead: false,
    reactions: [],
  };

  if (!messages.has(conversationId)) {
    messages.set(conversationId, []);
  }

  messages.get(conversationId)!.push(message);
  conversation.lastMessage = message;
  conversation.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message,
  });
};

export const createConversation = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { participants, type = 'direct', name, avatar } = req.body;

  if (!participants || !Array.isArray(participants)) {
    res.status(400).json({ success: false, error: 'Participants required' });
    return;
  }

  if (type === 'direct' && participants.length === 1) {
    const existingConv = Array.from(conversations.values()).find(
      (conv) =>
        conv.type === 'direct' &&
        conv.participants.length === 2 &&
        conv.participants.includes(req.user!.identifier) &&
        conv.participants.includes(participants[0])
    );

    if (existingConv) {
      res.json({
        success: true,
        conversation: existingConv,
      });
      return;
    }
  }

  const conversationId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const allParticipants = [req.user.identifier, ...participants];

  const conversation: Conversation = {
    id: conversationId,
    type,
    participants: allParticipants,
    name,
    avatar,
    unreadCount: 0,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  conversations.set(conversationId, conversation);
  messages.set(conversationId, []);

  res.json({
    success: true,
    conversation,
  });
};

export const markAsRead = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { conversationId } = req.body;
  
  if (!conversationId) {
    res.status(400).json({ success: false, error: 'Conversation ID required' });
    return;
  }
  
  const conversation = conversations.get(conversationId);

  if (!conversation || !conversation.participants.includes(req.user.identifier)) {
    res.status(404).json({ success: false, error: 'Conversation not found' });
    return;
  }

  const convMessages = messages.get(conversationId) || [];
  convMessages.forEach((msg) => {
    if (msg.senderId !== req.user!.identifier) {
      msg.isRead = true;
    }
  });

  conversation.unreadCount = 0;

  res.json({ success: true });
};

export const addReaction = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { conversationId, messageId, emoji } = req.body;
  
  if (!conversationId || !messageId || !emoji) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }
  
  const convMessages = messages.get(conversationId) || [];
  const message = convMessages.find((m) => m.id === messageId);

  if (!message) {
    res.status(404).json({ success: false, error: 'Message not found' });
    return;
  }

  const existingReaction = message.reactions.findIndex(
    (r) => r.userId === req.user!.identifier
  );

  if (existingReaction >= 0) {
    message.reactions[existingReaction].emoji = emoji;
  } else {
    message.reactions.push({
      emoji,
      userId: req.user.identifier,
    });
  }

  res.json({
    success: true,
    reactions: message.reactions,
  });
};

export const deleteMessage = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const { conversationId, messageId } = req.body;
  
  if (!conversationId || !messageId) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }
  
  const convMessages = messages.get(conversationId) || [];
  const messageIndex = convMessages.findIndex((m) => m.id === messageId);

  if (messageIndex < 0) {
    res.status(404).json({ success: false, error: 'Message not found' });
    return;
  }

  const message = convMessages[messageIndex];

  if (message.senderId !== req.user.identifier) {
    res.status(403).json({ success: false, error: 'Not authorized' });
    return;
  }

  convMessages.splice(messageIndex, 1);

  res.json({ success: true });
};