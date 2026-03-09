import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  friends: string[];
  profilePicture?: string;
  bio?: string;
  status?: string;
  isVerified?: boolean; 
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: [String],
    default: [],
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
    maxlength: 200,
  },
  status: {
    type: String,
    default: 'Hey there! I am using Chatty',
    maxlength: 100,
  },
  isVerified: {
    type: Boolean,
    default: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
