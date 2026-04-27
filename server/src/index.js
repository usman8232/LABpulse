import { createServer } from 'http';

import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { seedDefaultUsers } from './services/auth.service.js';
import { markStaleDevicesAsOffline } from './services/monitoring.service.js';
import { RealtimeGateway } from './realtime/gateway.js';
import { setMonitoringGateway } from './controllers/monitoring.controller.js';

async function bootstrap() {
  await connectDatabase();
  await seedDefaultUsers();

  const app = createApp();
  const server = createServer(app);
  const realtimeGateway = new RealtimeGateway(server);
  setMonitoringGateway(realtimeGateway);

  setInterval(() => {
    void markStaleDevicesAsOffline();
  }, 30_000);

  server.listen(env.SERVER_PORT, () => {
    logger.info(`LABPulse server listening on port ${env.SERVER_PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
