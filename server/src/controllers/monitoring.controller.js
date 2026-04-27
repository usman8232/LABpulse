import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { HttpError } from '../lib/http-error.js';
import { getDeviceHistory, ingestHeartbeat, listAlerts, updateAlertStatus } from '../services/monitoring.service.js';

let gateway = null;

export function setMonitoringGateway(nextGateway) {
  gateway = nextGateway;
}

export const heartbeatController = asyncHandler(async (req, res) => {
  if (req.body.secret !== env.AGENT_SHARED_SECRET) {
    throw new HttpError(403, 'Invalid helper secret.');
  }

  const result = await ingestHeartbeat(req.body);
  gateway?.broadcastDeviceUpdate(result.device);
  for (const alertType of result.alerts) {
    gateway?.broadcastAlert({ deviceId: result.device.id, type: alertType });
  }
  res.status(202).json({ device: result.device, alerts: result.alerts });
});

export const listAlertsController = asyncHandler(async (_req, res) => {
  const alerts = await listAlerts();
  res.json({ alerts });
});

export const updateAlertController = asyncHandler(async (req, res) => {
  const status = req.path.endsWith('resolve') ? 'RESOLVED' : 'ACKNOWLEDGED';
  const alert = await updateAlertStatus(req.params.id, status);
  gateway?.broadcastAlert(alert);
  res.json({ alert });
});

export const deviceHistoryController = asyncHandler(async (req, res) => {
  const history = await getDeviceHistory(req.params.id);
  res.json({ history });
});
