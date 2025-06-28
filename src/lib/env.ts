import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CACHE_INVALIDATION_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z
      .string()
      .min(1)
      .refine((t) => !t.endsWith("/")),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
