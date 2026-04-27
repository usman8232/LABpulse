import { asyncHandler } from '../lib/async-handler.js';
import { loginUser } from '../services/auth.service.js';
import { verifyRefreshToken, createAccessToken } from '../services/token.service.js';

export const loginController = asyncHandler(async (req, res) => {
  const payload = await loginUser(req.body.email, req.body.password);
  res.json(payload);
});

export const meController = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const refreshController = asyncHandler(async (req, res) => {
  const user = verifyRefreshToken(req.body.refreshToken);
  const accessToken = createAccessToken(user);
  res.json({ accessToken, user });
});
