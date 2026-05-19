import { z } from 'zod';

/**
 * Media row, joined into sections by media_id at the page-level loader.
 * Section components receive resolved Media objects so they do not need
 * to know about IDs or storage paths.
 */
export const MediaSchema = z.object({
  id: z.string().uuid(),
  business_id: z.string().uuid(),
  storage_path: z.string(),
  url: z.string(),
  blur_data_url: z.string().nullable().optional(),
  alt: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  type: z.enum(['image', 'video']).default('image'),
  created_at: z.string().optional()
});

export type Media = z.infer<typeof MediaSchema>;
