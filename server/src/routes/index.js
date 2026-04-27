import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { deviceRouter } from './device.routes.js';
import { monitoringRouter } from './monitoring.routes.js';
import { reportRouter } from './report.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/devices', deviceRouter);
apiRouter.use('/monitoring', monitoringRouter);
apiRouter.use('/reports', reportRouter);
