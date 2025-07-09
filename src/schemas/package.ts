import { z } from "zod";

export const packagesSchema = z.strictObject({
  name: z.string().min(1),
  id:z.string().min(1),
  price: z.string().min(1),
  features: z.array(
    z.object({
      name: z.string().min(1),
      included: z.boolean(),
    }),
  ),
});

export const packagesSchemas = z.array(packagesSchema);
