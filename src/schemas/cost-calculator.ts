import { z } from "zod";

export const costCalculator = z.object({
  packageType: z.string({
    required_error: "Please select a package type.",
  }),
  rooms: z
    .number({
      required_error: "Please enter the number of rooms.",
    })
    .int()
    .min(1, "Must have at least 1 room."),
});

export type CostCalculator = z.infer<typeof costCalculator>;
