
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  friends: string[];
  profilePicture?: string; 
  bio?: string;
  isVerifield: Boolean;
  status?: string; 
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
    default: '', // Base64 image string or URL
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
  isVerifield:{
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