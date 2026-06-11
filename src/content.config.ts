import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    codename: z.string(),
    sector: z.string(),
    engagement: z.string(),
    services: z.array(z.string()),
    order: z.number(),
    summary: z.string(),
    palette: z.array(z.object({
      name: z.string(),
      hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    })),
    type: z.object({ display: z.string(), text: z.string() }),
  }),
});

export const collections = { work };
