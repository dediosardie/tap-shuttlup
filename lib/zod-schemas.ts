import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/),
  full_name: z.string().min(2).max(120),
  position: z.string().max(120),
  company: z.string().max(120),
  bio: z.string().max(400),
  website: z.string().url().optional().or(z.literal("")),
});

export const cardSchema = z.object({
  uid: z.string().min(3).max(64),
  profile_id: z.string().uuid(),
  mode: z.enum(["personal", "corporate", "driver", "fleet", "investor"]),
});

export const tapEventSchema = z.object({
  shortcode: z.string().min(3).max(32),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
