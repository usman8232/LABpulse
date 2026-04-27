import mongoose, { Schema } from 'mongoose';

const deviceSchema = new Schema(
  {
    hostname: { type: String, required: true, trim: true },
    os: { type: String, required: true, trim: true },
    ipAddress: { type: String, required: true, trim: true },
    fingerprint: { type: String, required: true, unique: true, trim: true },
    lastSeenAt: { type: Date },
    isOnline: { type: Boolean, default: false },
    uptimeSeconds: { type: Number, default: 0 },
    cpuUsage: { type: Number, default: 0 },
    ramUsage: { type: Number, default: 0 },
    diskUsage: { type: Number, default: 0 },
    currentAlertState: { type: String, enum: ['HEALTHY', 'WARNING', 'CRITICAL'], default: 'HEALTHY' },
  },
  { timestamps: true },
);

export const DeviceModel = mongoose.model('Device', deviceSchema);
