import { Router } from 'express';

import { generateReportController, listReportsController } from '../controllers/report.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.js';
import { reportCreateSchema } from '../validation/report.schemas.js';

export const reportRouter = Router();

reportRouter.get('/', requireAuth, requireRole('HOST'), listReportsController);
reportRouter.post('/generate', requireAuth, requireRole('HOST'), validateBody(reportCreateSchema), generateReportController);
