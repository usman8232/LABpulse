import { Router } from 'express';

import {
  deviceHistoryController,
  heartbeatController,
  listAlertsController,
  updateAlertController,
} from '../controllers/monitoring.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.js';
import { heartbeatSchema } from '../validation/metric.schemas.js';

export const monitoringRouter = Router();

monitoringRouter.post('/heartbeat', validateBody(heartbeatSchema), heartbeatController);
monitoringRouter.get('/alerts', requireAuth, requireRole('HOST'), listAlertsController);
monitoringRouter.patch('/alerts/:id/acknowledge', requireAuth, requireRole('HOST'), updateAlertController);
monitoringRouter.patch('/alerts/:id/resolve', requireAuth, requireRole('HOST'), updateAlertController);
monitoringRouter.get('/devices/:id/history', requireAuth, requireRole('HOST'), deviceHistoryController);
