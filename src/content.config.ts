import { defineCollection, z } from 'astro:content';

const learn = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    readingTime: z.string(),
    category: z.string(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),
    readingTime: z.string(),
    category: z.string(),
  }),
});

export const collections = {
  learn,
  blog,
}; 