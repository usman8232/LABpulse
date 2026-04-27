import { Router } from 'express';

import { loginController, meController, refreshController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, refreshSchema } from '../validation/auth.schemas.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), loginController);
authRouter.post('/refresh', validateBody(refreshSchema), refreshController);
authRouter.get('/me', requireAuth, meController);
