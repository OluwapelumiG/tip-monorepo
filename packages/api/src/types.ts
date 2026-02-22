import { z } from "zod";

export const RoleSchema = z.enum(["admin", "freelancer", "customer", "employer", "worker"]);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  role: RoleSchema,
  createdAt: z.date().or(z.string().transform(v => new Date(v))),
  updatedAt: z.date().or(z.string().transform(v => new Date(v))),
});

export type User = z.infer<typeof UserSchema>;

export const SessionSchema = z.object({
  user: UserSchema,
  session: z.object({
    id: z.string(),
    expiresAt: z.date().or(z.string().transform(v => new Date(v))),
    token: z.string(),
    createdAt: z.date().or(z.string().transform(v => new Date(v))),
    updatedAt: z.date().or(z.string().transform(v => new Date(v))),
    userId: z.string(),
  }),
});

export type Session = z.infer<typeof SessionSchema>;
