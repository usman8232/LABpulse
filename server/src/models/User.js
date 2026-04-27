import mongoose, { Schema } from 'mongoose';

import { roles } from '../domain/enums.js';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    displayName: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model('User', userSchema);
