import type { CountryCode, TimeSlot } from "@/schemas/order";

export const COUNTRY_CODES_DATA: Omit<CountryCode, 'country'>[] = [
  { code: "+966", flag: "🇸🇦" },
];

export const TIME_SLOTS: TimeSlot[] = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];