import { describe, expect, it } from 'vitest';

import { roles } from '../src/domain/enums.js';

describe('roles', () => {
  it('includes HOST and CLIENT', () => {
    expect(roles).toContain('HOST');
    expect(roles).toContain('CLIENT');
  });
});
