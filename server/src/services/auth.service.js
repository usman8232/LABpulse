import bcrypt from 'bcrypt';

import { HttpError } from '../lib/http-error.js';
import { UserModel } from '../models/User.js';
import { createAccessToken, createRefreshToken } from './token.service.js';

export async function seedDefaultUsers() {
  const hostExists = await UserModel.findOne({ email: 'host@labpulse.local' });
  if (!hostExists) {
    await UserModel.create({
      email: 'host@labpulse.local',
      displayName: 'Default Host',
      role: 'HOST',
      passwordHash: await bcrypt.hash('Host12345!', 10),
    });
  }

  const clientExists = await UserModel.findOne({ email: 'client@labpulse.local' });
  if (!clientExists) {
    await UserModel.create({
      email: 'client@labpulse.local',
      displayName: 'Default Client',
      role: 'CLIENT',
      passwordHash: await bcrypt.hash('Client12345!', 10),
    });
  }
}

export async function loginUser(email, password) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  const authUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    accessToken: createAccessToken(authUser),
    refreshToken: createRefreshToken(authUser),
  };
}
