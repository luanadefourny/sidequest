import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.email(),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'one uppercase')
    .regex(/[a-z]/, 'one lowercase')
    .regex(/[0-9]/, 'one digit')
    .regex(/[^A-Za-z0-9]/, 'one symbol')
    .max(24),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthday: z.coerce.date(),
});

const loginSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'one uppercase')
    .regex(/[a-z]/, 'one lowercase')
    .regex(/[0-9]/, 'one digit')
    .regex(/[^A-Za-z0-9]/, 'one symbol')
    .max(24),
});

export { registerSchema, loginSchema }