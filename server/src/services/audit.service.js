import { AuditLogModel } from '../models/AuditLog.js';

export async function writeAuditLog(input) {
  await AuditLogModel.create({
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
  });
}
