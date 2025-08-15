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
  profilePicture: z.string(),
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

const editUserDataSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  profilePicture: z.string().optional(),
  birthday: z.coerce.date().optional(),
});

const editUserCredentialsSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  email: z.email().optional(),
});

const editUserPasswordSchema = z.object({
  newPassword: z.string()
    .min(8)
    .regex(/[A-Z]/, 'one uppercase')
    .regex(/[a-z]/, 'one lowercase')
    .regex(/[0-9]/, 'one digit')
    .regex(/[^A-Za-z0-9]/, 'one symbol')
    .max(24),
});

export { 
  registerSchema, 
  loginSchema, 
  editUserDataSchema, 
  editUserCredentialsSchema, 
  editUserPasswordSchema, 
}