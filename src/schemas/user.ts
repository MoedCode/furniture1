import { z } from "zod";

export const profileSchema = z.object({
  id: z.string().min(1),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  phone_number: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  email: z.string().min(1),
  is_staff: z.boolean().optional(),
  is_superuser: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type UserData = z.infer<typeof userSchema>;
export type ProfileData = z.infer<typeof profileSchema>;

export type ProfileField = {
  label: string;
  value: string;
};


