import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const settingsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/settings" }),
  schema: z.object({
    hero_title: z.string(),
    hero_subtitle: z.string(),
    about_text: z.string(),
  }),
});

const servicesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    icon: z.string(),
    features: z.array(z.string()),
    order: z.number().default(0),
  }),
});

const productsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    icon: z.string(),
    color: z.string(),
    features: z.array(z.string()),
    order: z.number().default(0),
  }),
});

export const collections = {
  settings: settingsCollection,
  services: servicesCollection,
  products: productsCollection,
};
