import { Router } from 'express';

import {
  decideRegistrationController,
  getClientDeviceController,
  getDeviceController,
  listDevicesController,
  listRegistrationsController,
  registerDeviceController,
} from '../controllers/device.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.js';
import { deviceRegistrationSchema, registrationDecisionSchema } from '../validation/device.schemas.js';

export const deviceRouter = Router();

deviceRouter.post('/register', requireAuth, requireRole('CLIENT'), validateBody(deviceRegistrationSchema), registerDeviceController);
deviceRouter.get('/my-device', requireAuth, requireRole('CLIENT'), getClientDeviceController);
deviceRouter.get('/registrations', requireAuth, requireRole('HOST'), listRegistrationsController);
deviceRouter.patch(
  '/registrations/:id/decision',
  requireAuth,
  requireRole('HOST'),
  validateBody(registrationDecisionSchema),
  decideRegistrationController,
);
deviceRouter.get('/', requireAuth, requireRole('HOST'), listDevicesController);
deviceRouter.get('/:id', requireAuth, requireRole('HOST'), getDeviceController);
