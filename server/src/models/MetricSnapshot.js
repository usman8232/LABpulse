import mongoose, { Schema } from 'mongoose';

const metricSnapshotSchema = new Schema(
  {
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true, index: true },
    cpuUsage: { type: Number, required: true },
    ramUsage: { type: Number, required: true },
    diskUsage: { type: Number, required: true },
    uptimeSeconds: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export const MetricSnapshotModel = mongoose.model('MetricSnapshot', metricSnapshotSchema);
