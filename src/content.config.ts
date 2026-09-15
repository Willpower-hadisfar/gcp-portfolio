// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    period: z.string(),
    tech: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Architecture', 'AI', 'Research']),
    summary: z.string(),
    subtitle: z.string().optional(),
    tech: z.array(z.string()).optional(),
    order: z.number().optional(),
    repoUrl: z.string().url().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
    relatedProject: z.string().optional(), // slug of a project in the `projects` collection
    image: z.string().optional(), // path under src/assets or a full URL; falls back to a generated accent banner when absent
    imageAlt: z.string().optional(),
  }),
});

export const collections = { experience, projects, writing };