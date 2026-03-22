import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
  category: z.string().optional(),
});

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const demoConfigSchema = z.object({
  slug: z.string().min(1),
  businessName: z.string().min(1),
  ownerName: z.string().optional(),
  phone: z.string().min(1),
  suburb: z.string().min(1),
  serviceArea: z.string().default("Brisbane"),
  tagline: z.string().optional(),
  services: z.array(serviceSchema).min(1),
  reviews: z.array(reviewSchema).min(1),
  credentials: z.array(z.string()),
  suburbs: z.array(z.string()),
  createdAt: z.string().optional(),
  colors: z.object({
    primary: z.string().default("#102a43"),
    accent: z.string().default("#f59e0b"),
    highlight: z.string().default("#f59e0b"),
  }).optional(),
  logoUrl: z.string().optional(),
  stats: z.object({
    jobsCompleted: z.number().default(500),
    happyClients: z.number().default(200),
    googleRating: z.number().default(49),
  }).optional(),
  about: z.object({
    bio: z.string().optional(),
    hometown: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    passion: z.string().optional(),
  }).optional(),
});

export type Review = z.infer<typeof reviewSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type DemoConfig = z.infer<typeof demoConfigSchema>;
