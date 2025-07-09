"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";

import type {  CountryCode, FormValues } from "@/schemas/order";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactSectionProps {
  control: Control<FormValues>;
}
export const COUNTRY_CODES_DATA: Omit<CountryCode, 'country'>[] = [
  { code: "+966", flag: "🇸🇦" },
];

export function ContactSection({ control }: ContactSectionProps) {
  const t = useTranslations("movingForm");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Phone className="h-5 w-5" />
        {t("contact.title")}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <FormField
            control={control}
            name="phone_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.countryCode")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES_DATA.map((country, index) => {
                        const countryKeys = ["saudiArabia", "uae", "qatar", "kuwait"];
                        return (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2">
            <FormField
              control={control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("contact.phoneNumberPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name="promo_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.promoCode")}</FormLabel>
              <FormControl>
                <Input placeholder={t("contact.promoCodePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}