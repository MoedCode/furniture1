"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader, SectionTitle, Section } from "./section";
import CostCalculatorForm from "./cost-calculator-form";

export function CostCalculator() {
  const t = useTranslations("costCalculator");

  return (
    <Section className="w-full bg-muted/30 py-8 md:py-16" id="calculator">
      <SectionHeader>
        <SectionTitle>{t("title")}</SectionTitle>
      </SectionHeader>
      <div className="container px-4 md:px-6">
        <Card className="border shadow-lg overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <CostCalculatorForm />
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
