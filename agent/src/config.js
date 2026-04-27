import dotenv from 'dotenv';

dotenv.config();

export const agentConfig = {
  serverUrl: process.env.LABPULSE_SERVER_URL ?? 'http://localhost:4000/api/monitoring/heartbeat',
  secret: process.env.LABPULSE_AGENT_SECRET ?? 'change-me-agent',
  hostname: process.env.LABPULSE_DEVICE_HOSTNAME ?? 'LAB-PC-01',
  fingerprint: process.env.LABPULSE_DEVICE_FINGERPRINT ?? 'device-fingerprint-01',
  os: process.env.LABPULSE_DEVICE_OS ?? 'Windows 11',
  ipAddress: process.env.LABPULSE_DEVICE_IP ?? '192.168.0.15',
  heartbeatMs: Number(process.env.LABPULSE_HEARTBEAT_MS ?? 30000),
};
