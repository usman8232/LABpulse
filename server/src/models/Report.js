import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema(
  {
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    filters: { type: Schema.Types.Mixed, default: {} },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ReportModel = mongoose.model('Report', reportSchema);
