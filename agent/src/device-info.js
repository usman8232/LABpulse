import os from 'os';

import { agentConfig } from './config.js';

function usagePercentage(used, total) {
  return Number(((used / total) * 100).toFixed(1));
}

export async function collectDeviceMetrics() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const cpus = os.cpus();
  const cpuLoad = cpus.length > 0 ? Math.min(100, Math.round((os.loadavg()[0] / cpus.length) * 100)) : 0;

  return {
    hostname: agentConfig.hostname || os.hostname(),
    fingerprint: agentConfig.fingerprint,
    os: agentConfig.os || `${os.platform()} ${os.release()}`,
    ipAddress: agentConfig.ipAddress,
    cpuUsage: cpuLoad,
    ramUsage: usagePercentage(usedMemory, totalMemory),
    diskUsage: 55,
    uptimeSeconds: Math.round(os.uptime()),
  };
}
