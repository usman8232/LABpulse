import { agentConfig } from './config.js';
import { collectDeviceMetrics } from './device-info.js';

export async function sendHeartbeat() {
  const payload = {
    secret: agentConfig.secret,
    ...(await collectDeviceMetrics()),
  };

  const response = await fetch(agentConfig.serverUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Heartbeat failed: ${response.status} ${text}`);
  }

  return response.json();
}
