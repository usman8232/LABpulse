import mongoose, { Schema } from 'mongoose';

import { registrationStatuses } from '../domain/enums.js';

const deviceRegistrationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
    status: { type: String, enum: registrationStatuses, default: 'PENDING' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

export const DeviceRegistrationModel = mongoose.model('DeviceRegistration', deviceRegistrationSchema);
