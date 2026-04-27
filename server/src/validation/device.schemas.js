import { z } from 'zod';

export const deviceRegistrationSchema = z.object({
  hostname: z.string().min(2),
  fingerprint: z.string().min(3),
  ipAddress: z.string().min(3),
  os: z.string().min(2),
});

export const registrationDecisionSchema = z.object({
  approved: z.boolean(),
});
