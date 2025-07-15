import { z } from "zod"

export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
  coordinates: z.string().optional(),
})

export type LocationData = z.infer<typeof locationSchema>

export const formSchema = z.object({
  package: z.string().min(1, "Please select a package."),
  promo_code: z.string().optional(),
  from_address: z.string().min(1, "From address is required"),
  from_lat: z.number(),
  from_lng: z.number(),
  to_address: z.string().min(1, "To address is required"),
  to_lat: z.number(),
  to_lng: z.number(),
  transportation_date: z.string().min(1, "Transportation date is required"),
  transportation_date_time: z.string().min(1, "Transportation time is required"),
  rooms_number: z.number().min(1, "At least 1 room is required").max(10, "Maximum 10 rooms allowed"),
  phone_code: z.string().min(1, "Country code is required"),
  phone_number: z.string().min(8, "Phone number must be at least 8 digits"),
  belonging_description: z.string().min(10, "Description must be at least 10 characters"),
  total: z.number().min(0, "Total must be non-negative"),
  service_type: z.enum(["Intracity", "City-to-city"], {
    required_error: "Please select a service type.",
  }),
})

export type FormValues = z.infer<typeof formSchema>


export const countryCodeSchema = z.object({
  code: z.enum(["+966"]),
  flag: z.string(),
  country: z.string(),
})

export type CountryCode = z.infer<typeof countryCodeSchema>

// Time slot enum for type safety
export const timeSlotSchema = z.enum([
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
])

export type TimeSlot = z.infer<typeof timeSlotSchema>

// Service type enum for type safety
export const serviceTypeSchema = z.enum(["Intracity", "City-to-city"])
export type ServiceType = z.infer<typeof serviceTypeSchema>


