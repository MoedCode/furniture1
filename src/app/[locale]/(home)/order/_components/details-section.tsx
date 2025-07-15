"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "next-intl";

import type {  FormValues } from "@/schemas/order";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DetailsSectionProps {
  control: Control<FormValues>;
}

export function DetailsSection({ control }: DetailsSectionProps) {
  const t = useTranslations("movingForm");

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold text-foreground">
        {t("details.movingDetails")}
      </div>
      <div className="space-y-4">
        <FormField
          control={control}
          name="belonging_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("details.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("details.descriptionPlaceholder")}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("details.descriptionHelper")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}