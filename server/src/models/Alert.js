import mongoose, { Schema } from 'mongoose';

import { alertStatuses, alertTypes } from '../domain/enums.js';

const alertSchema = new Schema(
  {
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
    type: { type: String, enum: alertTypes, required: true },
    status: { type: String, enum: alertStatuses, default: 'NEW' },
    message: { type: String, required: true, trim: true },
    triggeredAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
);

export const AlertModel = mongoose.model('Alert', alertSchema);
