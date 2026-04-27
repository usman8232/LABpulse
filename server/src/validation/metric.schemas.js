import { z } from 'zod';

export const heartbeatSchema = z.object({
  secret: z.string().min(1),
  fingerprint: z.string().min(3),
  hostname: z.string().min(2),
  os: z.string().min(2),
  ipAddress: z.string().min(3),
  cpuUsage: z.number().min(0).max(100),
  ramUsage: z.number().min(0).max(100),
  diskUsage: z.number().min(0).max(100),
  uptimeSeconds: z.number().min(0),
});
