import { asyncHandler } from '../lib/async-handler.js';
import { generateReport, listReports } from '../services/report.service.js';

export const generateReportController = asyncHandler(async (req, res) => {
  const report = await generateReport(req.user.id, req.body.title, req.body.filters ?? {});
  res.status(201).json(report);
});

export const listReportsController = asyncHandler(async (_req, res) => {
  const reports = await listReports();
  res.json({ reports });
});
