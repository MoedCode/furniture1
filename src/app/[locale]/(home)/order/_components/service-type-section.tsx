"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Truck } from "lucide-react";

import type { FormValues } from "@/schemas/order";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type ServiceTypeSectionProps = {
  control: Control<FormValues>;
};

export function ServiceTypeSection({ control }: ServiceTypeSectionProps) {
  const t = useTranslations("movingForm");

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold">{t("serviceType.title")}</h2>
      </div>

      <FormField
        control={control}
        name="service_type"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex md:flex-row flex-col  rtl:justify-end rtl:text-right w-full md:px-8 gap-8"
              >
                <div className="flex rtl:flex-row-reverse items-center gap-2">
                  <RadioGroupItem value="City-to-city" id="city-to-city" />
                  <Label htmlFor="city-to-city">
                    <h3 className="font-semibold text-sm sm:text-base">{t("serviceType.cityToCity.title")}</h3>
                  </Label>
                </div>
                <div className="flex rtl:flex-row-reverse items-center gap-2">
                  <RadioGroupItem value="Intracity" id="intracity" />
                  <Label htmlFor="intracity">
                    <h3 className="font-semibold text-sm sm:text-base">{t("serviceType.intracity.title")}</h3>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}