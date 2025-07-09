"use client";

import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";
import type { Control } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import CardLoader from "@/components/ui/card-loader";

import type { FormValues } from "@/schemas/order";
import { usePackages } from "@/hooks/use-packages";
import PackageCard from "./package-card";

type Props = {
  control: Control<FormValues>;
};

export function PackageSection({ control }: Props) {
  const t = useTranslations("movingForm");
  const locale = useLocale() as "ar" | "en";
  const { packages, loading, error } = usePackages(locale);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="text-lg sm:text-xl font-semibold">{t("packages.title")}</h2>
      </div>
      
      {loading ? (
        <CardLoader />
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <FormField
          control={control}
          name="package"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg.name}
                      pkg={pkg}
                      selected={field.value === pkg.id}
                      onSelect={() => field.onChange(pkg.id)}
                      t={t}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
