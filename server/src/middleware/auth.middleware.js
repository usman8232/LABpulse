import { HttpError } from '../lib/http-error.js';
import { verifyAccessToken } from '../services/token.service.js';

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Authentication required.'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  req.user = verifyAccessToken(token);
  next();
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      next(new HttpError(401, 'Authentication required.'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new HttpError(403, 'You do not have permission for this action.'));
      return;
    }

    next();
  };
}
