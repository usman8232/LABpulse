import { DeviceModel } from '../models/Device.js';
import { AlertModel } from '../models/Alert.js';
import { ReportModel } from '../models/Report.js';
import { MetricSnapshotModel } from '../models/MetricSnapshot.js';

export async function generateReport(userId, title, filters) {
  const [deviceCount, alertCount, recentMetrics] = await Promise.all([
    DeviceModel.countDocuments(),
    AlertModel.countDocuments(),
    MetricSnapshotModel.find().sort({ recordedAt: -1 }).limit(20),
  ]);

  const report = await ReportModel.create({
    generatedBy: userId,
    title,
    filters,
  });

  return {
    report,
    summary: {
      deviceCount,
      alertCount,
      averageCpu:
        recentMetrics.length > 0
          ? recentMetrics.reduce((acc, item) => acc + item.cpuUsage, 0) / recentMetrics.length
          : 0,
      averageRam:
        recentMetrics.length > 0
          ? recentMetrics.reduce((acc, item) => acc + item.ramUsage, 0) / recentMetrics.length
          : 0,
    },
  };
}

export async function listReports() {
  return ReportModel.find().sort({ generatedAt: -1 }).populate('generatedBy', 'displayName email');
}
