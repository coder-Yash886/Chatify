import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import MessageModel from '../models/Message';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const userEmail = req.user.identifier;

    const messages = await MessageModel.find({
      $or: [{ from: userEmail }, { to: userEmail }],
    }).sort({ timestamp: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.from === userEmail ? msg.to : msg.from;
      
      if (!conversationsMap.has(otherUser)) {
        conversationsMap.set(otherUser, {
          id: [userEmail, otherUser].sort().join('_'),
          otherUser,
          lastMessage: {
            text: msg.text,
            timestamp: msg.timestamp,
          },
          unreadCount: 0,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getDirectMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const otherUserId = req.params.otherUserId as string;

    if (!otherUserId) {
      res.status(400).json({ success: false, error: 'User ID required' });
      return;
    }

    const userEmail = req.user.identifier;

    const messages = await MessageModel.find({
      $or: [
        { from: userEmail, to: otherUserId },
        { from: otherUserId, to: userEmail },
      ],
    }).sort({ timestamp: 1 });

    console.log(`📨 Messages: ${userEmail} ↔ ${otherUserId}: ${messages.length} msgs`);

    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      from: msg.from,
      to: msg.to,
      text: msg.text,
      timestamp: msg.timestamp.toISOString(),
      isRead: msg.isRead,
      type: msg.type,
      fileUrl: msg.fileUrl,
      fileName: msg.fileName,
    }));

    res.json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const sendDirectMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { to, text, type = 'text', fileUrl, fileName } = req.body;

    if (!to || !text) {
      res.status(400).json({ success: false, error: 'Recipient and message required' });
      return;
    }

    const newMessage = await MessageModel.create({
      from: req.user.identifier,
      to,
      text: text.trim(),
      type,
      fileUrl,
      fileName,
      isRead: false,
    });

    console.log(`✅ Message: ${req.user.identifier} → ${to}: "${text}"`);

    res.json({
      success: true,
      message: {
        id: newMessage._id.toString(),
        from: newMessage.from,
        to: newMessage.to,
        text: newMessage.text,
        timestamp: newMessage.timestamp.toISOString(),
        isRead: newMessage.isRead,
        type: newMessage.type,
        fileUrl: newMessage.fileUrl,
        fileName: newMessage.fileName,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const markDMAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({ success: false, error: 'User ID required' });
      return;
    }

    const result = await MessageModel.updateMany(
      {
        from: otherUserId,
        to: req.user.identifier,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    console.log(`✅ Marked ${result.modifiedCount} messages as read from ${otherUserId}`);

    res.json({ 
      success: true,
      markedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};