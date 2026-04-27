import { ZodError } from 'zod';

import { HttpError } from '../lib/http-error.js';
import { logger } from '../lib/logger.js';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed.',
      issues: error.flatten(),
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  logger.error(error);
  res.status(500).json({ message: 'Something went wrong.' });
}
