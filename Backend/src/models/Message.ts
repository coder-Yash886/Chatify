import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  from: string;
  to: string;
  text: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
  fileUrl: String,
  fileName: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
MessageSchema.index({ from: 1, to: 1, timestamp: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);