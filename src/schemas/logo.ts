import { z } from "zod";

export const logoSchema = z.object({
  url: z.string().url(),
});

export type LogoType = z.infer<typeof logoSchema>;
