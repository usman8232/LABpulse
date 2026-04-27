import { asyncHandler } from '../lib/async-handler.js';
import {
  approveRegistration,
  getClientDevice,
  getDeviceById,
  listDevices,
  listRegistrations,
  registerDevice,
} from '../services/device.service.js';

export const registerDeviceController = asyncHandler(async (req, res) => {
  const registration = await registerDevice({
    userId: req.user.id,
    ...req.body,
  });
  res.status(201).json({ registration });
});

export const getClientDeviceController = asyncHandler(async (req, res) => {
  const registration = await getClientDevice(req.user.id);
  res.json({ registration });
});

export const listRegistrationsController = asyncHandler(async (_req, res) => {
  const registrations = await listRegistrations();
  res.json({ registrations });
});

export const decideRegistrationController = asyncHandler(async (req, res) => {
  const registration = await approveRegistration({
    registrationId: req.params.id,
    hostId: req.user.id,
    approved: req.body.approved,
  });
  res.json({ registration });
});

export const listDevicesController = asyncHandler(async (_req, res) => {
  const devices = await listDevices();
  res.json({ devices });
});

export const getDeviceController = asyncHandler(async (req, res) => {
  const device = await getDeviceById(req.params.id);
  res.json({ device });
});
