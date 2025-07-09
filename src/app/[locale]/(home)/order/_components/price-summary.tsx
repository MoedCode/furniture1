"use client";

import { useTranslations } from "next-intl";

import { SaudiRiyal } from "lucide-react";

type Props = {
  packageId: string;
  estimatedPrice: number;
}

export function PriceSummary({
  packageId,
  estimatedPrice
}: Props) {
  const t = useTranslations("movingForm");

  if (!packageId) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-center mb-4">{t("pricing.title")}</h3>
        <div className="text-center space-y-4">
          <div className="text-base sm:text-lg text-muted-foreground">
            {t("pricing.selectPackage")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-4">{t("pricing.title")}</h3>
      <div className="space-y-4">
        <div className="text-center space-y-4">
          <div className="text-3xl sm:text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <span>
            {estimatedPrice.toLocaleString()} 
            </span>
            <SaudiRiyal className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h2 className="text-xs sm:text-sm text-muted-foreground">
            {t("pricing.disclaimer")}
          </h2>
        </div>
      </div>
    </div>
  );
}
