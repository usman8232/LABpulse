import { AlertModel } from '../models/Alert.js';
import { DeviceModel } from '../models/Device.js';
import { DeviceRegistrationModel } from '../models/DeviceRegistration.js';
import { MetricSnapshotModel } from '../models/MetricSnapshot.js';
import { HttpError } from '../lib/http-error.js';
import { writeAuditLog } from './audit.service.js';

const CPU_THRESHOLD = 85;
const RAM_THRESHOLD = 90;
const DISK_THRESHOLD = 90;

export async function ingestHeartbeat(input) {
  const device = await DeviceModel.findOne({ fingerprint: input.fingerprint });
  if (!device) {
    throw new HttpError(404, 'Device not registered.');
  }

  const approvedRegistration = await DeviceRegistrationModel.findOne({
    deviceId: device.id,
    status: 'APPROVED',
  });

  if (!approvedRegistration) {
    throw new HttpError(403, 'Device has not been approved by a Host.');
  }

  device.hostname = input.hostname;
  device.os = input.os;
  device.ipAddress = input.ipAddress;
  device.cpuUsage = input.cpuUsage;
  device.ramUsage = input.ramUsage;
  device.diskUsage = input.diskUsage;
  device.uptimeSeconds = input.uptimeSeconds;
  device.lastSeenAt = new Date();
  device.isOnline = true;
  device.currentAlertState = computeAlertState(input);
  await device.save();

  const snapshot = await MetricSnapshotModel.create({
    deviceId: device._id,
    cpuUsage: input.cpuUsage,
    ramUsage: input.ramUsage,
    diskUsage: input.diskUsage,
    uptimeSeconds: input.uptimeSeconds,
  });

  const alerts = await evaluateAlerts(device._id, input);

  await writeAuditLog({
    action: 'HEARTBEAT_RECEIVED',
    entityType: 'Device',
    entityId: device.id,
    metadata: {
      cpuUsage: input.cpuUsage,
      ramUsage: input.ramUsage,
      diskUsage: input.diskUsage,
    },
  });

  return { device, snapshot, alerts };
}

function computeAlertState(metrics) {
  if (metrics.cpuUsage >= CPU_THRESHOLD || metrics.ramUsage >= RAM_THRESHOLD || metrics.diskUsage >= DISK_THRESHOLD) {
    return 'CRITICAL';
  }
  if (metrics.cpuUsage >= 70 || metrics.ramUsage >= 75 || metrics.diskUsage >= 80) {
    return 'WARNING';
  }
  return 'HEALTHY';
}

async function evaluateAlerts(deviceId, metrics) {
  const triggeredAlerts = [];

  const checks = [
    { condition: metrics.cpuUsage >= CPU_THRESHOLD, type: 'HIGH_CPU', message: 'CPU usage crossed the critical threshold.' },
    { condition: metrics.ramUsage >= RAM_THRESHOLD, type: 'HIGH_RAM', message: 'RAM usage crossed the critical threshold.' },
    { condition: metrics.diskUsage >= DISK_THRESHOLD, type: 'LOW_DISK', message: 'Disk usage crossed the critical threshold.' },
  ];

  for (const check of checks) {
    if (!check.condition) {
      continue;
    }

    const existing = await AlertModel.findOne({
      deviceId,
      type: check.type,
      status: { $in: ['NEW', 'ACKNOWLEDGED'] },
    });

    if (!existing) {
      await AlertModel.create({
        deviceId,
        type: check.type,
        message: check.message,
      });
      triggeredAlerts.push(check.type);
    }
  }

  return triggeredAlerts;
}

export async function markStaleDevicesAsOffline() {
  const staleCutoff = new Date(Date.now() - 90 * 1000);
  const staleDevices = await DeviceModel.find({
    lastSeenAt: { $lt: staleCutoff },
    isOnline: true,
  });

  for (const device of staleDevices) {
    device.isOnline = false;
    device.currentAlertState = 'CRITICAL';
    await device.save();

    const existing = await AlertModel.findOne({
      deviceId: device._id,
      type: 'OFFLINE',
      status: { $in: ['NEW', 'ACKNOWLEDGED'] },
    });

    if (!existing) {
      await AlertModel.create({
        deviceId: device._id,
        type: 'OFFLINE',
        message: 'Device has gone offline or stopped reporting.',
      });
    }
  }
}

export async function getDeviceHistory(deviceId) {
  return MetricSnapshotModel.find({ deviceId }).sort({ recordedAt: -1 }).limit(120);
}

export async function listAlerts() {
  return AlertModel.find().sort({ triggeredAt: -1 }).populate('deviceId');
}

export async function updateAlertStatus(alertId, status) {
  const alert = await AlertModel.findById(alertId);
  if (!alert) {
    throw new HttpError(404, 'Alert not found.');
  }

  alert.status = status;
  if (status === 'RESOLVED') {
    alert.resolvedAt = new Date();
  }
  await alert.save();
  return alert;
}
