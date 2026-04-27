import { DeviceModel } from '../models/Device.js';
import { DeviceRegistrationModel } from '../models/DeviceRegistration.js';
import { HttpError } from '../lib/http-error.js';
import { writeAuditLog } from './audit.service.js';

export async function registerDevice(input) {
  let device = await DeviceModel.findOne({ fingerprint: input.fingerprint });
  if (!device) {
    device = await DeviceModel.create({
      hostname: input.hostname,
      fingerprint: input.fingerprint,
      ipAddress: input.ipAddress,
      os: input.os,
    });
  }

  const existingPendingRegistration = await DeviceRegistrationModel.findOne({
    deviceId: device.id,
    userId: input.userId,
    status: 'PENDING',
  });

  if (existingPendingRegistration) {
    return existingPendingRegistration;
  }

  const registration = await DeviceRegistrationModel.create({
    userId: input.userId,
    deviceId: device.id,
    status: 'PENDING',
  });

  await writeAuditLog({
    actorId: input.userId,
    action: 'DEVICE_REGISTERED',
    entityType: 'DeviceRegistration',
    entityId: registration.id,
    metadata: { deviceId: device.id },
  });

  return registration;
}

export async function approveRegistration(input) {
  const registration = await DeviceRegistrationModel.findById(input.registrationId);
  if (!registration) {
    throw new HttpError(404, 'Registration not found.');
  }

  registration.status = input.approved ? 'APPROVED' : 'REJECTED';
  registration.approvedBy = input.hostId;
  await registration.save();

  await writeAuditLog({
    actorId: input.hostId,
    action: input.approved ? 'DEVICE_APPROVED' : 'DEVICE_REJECTED',
    entityType: 'DeviceRegistration',
    entityId: registration.id,
    metadata: { deviceId: registration.deviceId.toString() },
  });

  return registration;
}

export async function getClientDevice(userId) {
  const registration = await DeviceRegistrationModel.findOne({ userId }).sort({ createdAt: -1 }).populate('deviceId');
  return registration;
}

export async function listRegistrations() {
  return DeviceRegistrationModel.find()
    .sort({ createdAt: -1 })
    .populate('userId', 'displayName email role')
    .populate('deviceId');
}

export async function listDevices() {
  return DeviceModel.find().sort({ updatedAt: -1 });
}

export async function getDeviceById(id) {
  const device = await DeviceModel.findById(id);
  if (!device) {
    throw new HttpError(404, 'Device not found.');
  }
  return device;
}
