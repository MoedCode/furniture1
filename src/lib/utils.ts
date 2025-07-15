import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";
import type { ProfileField, ProfileData, UserData } from "@/schemas/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl(path: string) {
  if (!path.startsWith("/")) throw new Error("Path must start with /");
  return env.NEXT_PUBLIC_API_URL + path;
}

export const getDisplayName = (
  userData: UserData,
  profileData: ProfileData,
): string => {
  if (profileData.first_name) {
    return `${profileData.first_name} ${profileData.last_name || ""}`.trim();
  }
  return userData.username;
};

export const getContactFields = (
  userData: UserData,
  t: (key: string) => string,
): ProfileField[] => {
  const fields: ProfileField[] = [];

  if (userData.phone_number) {
    fields.push({
      label: t("sections.personalInfo.fields.phoneNumber"),
      value: userData.phone_number,
    });
  }

  if (userData.whatsapp_number) {
    fields.push({
      label: t("sections.personalInfo.fields.whatsappNumber"),
      value: userData.whatsapp_number,
    });
  }

  if (userData.address) {
    fields.push({
      label: t("sections.personalInfo.fields.address"),
      value: userData.address,
    });
  }

  if (userData.city) {
    fields.push({
      label: t("sections.personalInfo.fields.city"),
      value: userData.city,
    });
  }

  if (userData.postal_code) {
    fields.push({
      label: t("sections.personalInfo.fields.postalCode"),
      value: userData.postal_code,
    });
  }

  return fields;
};
