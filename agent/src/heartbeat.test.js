import { describe, expect, it } from 'vitest';

import { agentConfig } from './config.js';

describe('agentConfig', () => {
  it('has a heartbeat interval', () => {
    expect(agentConfig.heartbeatMs).toBeGreaterThan(0);
  });
});
