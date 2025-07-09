import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  AlertTriangle,
  Server,
  Edit,
  Scale,
  CheckCircle,
} from "lucide-react";
import { z } from "zod";
import { fetchStatic } from "@/api/server-hooks/api";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام - شركة السلام لنقل الأثاث",
  description:
    "اطلع على الشروط والأحكام الخاصة باستخدام خدمات شركة السلام لنقل العفش داخل المملكة وبين المدن، بما يضمن الشفافية والوضوح في التعامل.",
  keywords: [
    "الشروط والأحكام",
    "استخدام الموقع",
    "شركة نقل عفش",
    "شركة السلام لنقل الأثاث",
    "حقوق العملاء",
    "التزامات المستخدم",
    "نقل عفش بالسعودية",
  ],
  openGraph: {
    title: "الشروط والأحكام - شركة السلام لنقل الأثاث",
    description:
      "تعرف على حقوقك والتزاماتك عند استخدام خدمات موقع شركة السلام لنقل العفش داخل المملكة.",
    siteName: "شركة السلام لنقل الأثاث",
    locale: "ar_SA",
    type: "website",
  },
};

const termsSchema = z.object({
  detail: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
});

const sectionIcons = {
  "Terms & Conditions": FileText,
  "Personal Responsibility": User,
  "Prohibited Activities": AlertTriangle,
  "Service Availability": Server,
  "Modifications to the Terms": Edit,
  "Governing Law": Scale,
} as const;

export default async function TermsConditions() {
  const data = await fetchStatic("/site_data/terms_conditions", termsSchema, {
    tags: ["terms-conditions"],
  });
  const t = await getTranslations("TermsConditions");

  const { detail } = data;

  if (!detail.length) {
    return (
      <div className="text-center py-20 text-gray-600">
        {t("noTermsAvailable")}
      </div>
    );
  }

  const [mainSection, ...otherSections] = detail;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            {t("pageTitle")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("pageSubtitle")}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="outline" className="text-sm">
              {t("lastUpdated")}: {new Date().toLocaleDateString()}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {t("location")}
            </Badge>
          </div>
        </div>

        {/* Introduction Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              {t("welcomeTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-card-foreground">
              {mainSection.content}
            </p>
          </CardContent>
        </Card>

        {/* Other Terms Sections */}
        <div className="space-y-6">
          {otherSections.map((section, index) => {
            const IconComponent =
              sectionIcons[section.title as keyof typeof sectionIcons] ||
              FileText;
            const isWarning = section.title === "Prohibited Activities";
            const isImportant =
              section.title === "Governing Law" ||
              section.title === "Modifications to the Terms";

            return (
              <Card
                key={index}
                className={`${isWarning ? "border-destructive/50" : isImportant ? "border-primary/50" : ""}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${
                      isWarning
                        ? "text-destructive"
                        : isImportant
                          ? "text-primary"
                          : "text-card-foreground"
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        isWarning
                          ? "text-destructive"
                          : isImportant
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-card-foreground">
                    {section.content}
                  </p>

                  {section.title === "Personal Responsibility" && (
                    <div className="mt-4 rounded-lg bg-primary/10 p-4">
                      <p className="text-sm font-medium text-primary-foreground">
                        {t("importantResponsibility")}
                      </p>
                    </div>
                  )}

                  {section.title === "Prohibited Activities" && (
                    <div className="mt-4 rounded-lg bg-destructive/10 p-4">
                      <p className="text-sm font-medium text-destructive">
                        {t("warningText")}
                      </p>
                    </div>
                  )}

                  {section.title === "Modifications to the Terms" && (
                    <div className="mt-4 rounded-lg bg-accent/20 p-4">
                      <p className="text-sm font-medium text-accent-foreground">
                        {t("bookmarkNote")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Acceptance Section */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-semibold text-primary">
                {t("byUsingServices")}
              </h3>
              <p className="text-primary-foreground">{t("acceptanceText")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
