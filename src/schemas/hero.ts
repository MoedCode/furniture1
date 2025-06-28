import { z } from "zod";

export const heroSchema = z.strictObject({
  description: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  site_name: z.string(),
  images: z.array(
    z.object({
      image: z.string(),
      caption: z.string().optional(),
    }),
  ),
});


export type HeroData = z.infer<typeof heroSchema>;
