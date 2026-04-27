import { agentConfig } from './config.js';
import { sendHeartbeat } from './heartbeat.js';

async function tick() {
  try {
    const result = await sendHeartbeat();
    console.log(`[LABPulse agent] heartbeat accepted for ${result.device.hostname}`);
  } catch (error) {
    console.error('[LABPulse agent] heartbeat failed', error);
  }
}

void tick();
setInterval(() => {
  void tick();
}, agentConfig.heartbeatMs);
