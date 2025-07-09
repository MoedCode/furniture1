import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { fetchStatic } from "@/api/server-hooks/api";
import { AlertTriangle, FileText, Lock, Mail, Shield, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata : Metadata = {
  title: "سياسة الخصوصية - شركة السلام لنقل الأثاث",
  description:
    "تعرف على سياسة الخصوصية الخاصة بشركة السلام لنقل الأثاث، وكيفية تعاملنا مع بيانات العملاء وضمان سرية المعلومات.",
  keywords: [
    "سياسة الخصوصية",
    "خصوصية العملاء",
    "حماية البيانات",
    "شركة نقل عفش",
    "شركة السلام لنقل الأثاث",
    "خصوصية موقع السلام",
    "بيانات العملاء",
  ],
  openGraph: {
    title: "سياسة الخصوصية - شركة السلام لنقل الأثاث",
    description:
      "نوضح في هذه الصفحة كيفية جمع واستخدام وحماية بيانات العملاء لدى شركة السلام.",
    siteName: "شركة السلام لنقل الأثاث",
    locale: "ar_SA",
    type: "website",
  },
};

const PrivacyPolicySchema = z.object({
  detail: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    introduction: z.string().min(1),
    who_we_are: z.string().min(1),
    right_to_modify: z.string().min(1),
    privacy_is_your_right: z.string().min(1),
    data_processing: z.string().min(1),
    your_rights: z.array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    ),
    what_data_do_we_process: z.string().min(1),
    processing_activities: z.string().min(1),
    transferring_information: z.string().min(1),
    fraud_prevention: z.string().min(1),
    mergers_acquisitions: z.string().min(1),
    who_we_work_with: z.string().min(1),
    authorities_legal: z.string().min(1),
    data_retention: z.string().min(1),
    cookies_policy: z.string().min(1),
  }),
});
export default async function PrivacyPolicy() {
  
  const data = await fetchStatic(
      "/site_data/privacy-policy",
      PrivacyPolicySchema,
      { tags: ["privacy-policy"] },
    );
  
  const detail = data.detail
  const t = await getTranslations("PrivacyPolicy")
  return (
          <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/20 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">{detail.title}</h1>
          <p className="text-lg text-muted-foreground">{detail.subtitle}</p>
          <div className="mt-4">
            <Badge variant="outline" className="text-sm">
              {t("lastUpdated")}: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t("introduction")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-card-foreground">{detail.introduction}</p>
          </CardContent>
        </Card>

        {/* Who We Are */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("whoWeAre")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-card-foreground">{detail.who_we_are}</p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t("yourRights")}
            </CardTitle>
            <CardDescription>
              {t("yourRightsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {detail.your_rights.map((right, index) => (
                <div key={index} className="rounded-lg border border-border p-4 bg-card">
                  <h4 className="mb-2 font-semibold text-card-foreground">{right.name}</h4>
                  <p className="text-sm text-muted-foreground">{right.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Processing Sections */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("privacyIsYourRight")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.privacy_is_your_right}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dataProcessing")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.data_processing}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("whatDataDoWeProcess")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.what_data_do_we_process}</p>
              <Separator className="my-4" />
              <p className="leading-relaxed text-card-foreground">{detail.processing_activities}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("informationSharing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">{t("transferringInformation")}</h4>
                <p className="text-card-foreground">{detail.transferring_information}</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 font-semibold text-foreground">{t("whoWeWorkWith")}</h4>
                <p className="text-card-foreground">{detail.who_we_work_with}</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 font-semibold text-foreground">{t("mergersAcquisitions")}</h4>
                <p className="text-card-foreground">{detail.mergers_acquisitions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                {t("securityLegalCompliance")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">{t("fraudPrevention")}</h4>
                <p className="text-card-foreground">{detail.fraud_prevention}</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2 font-semibold text-foreground">{t("legalAuthorities")}</h4>
                <p className="text-card-foreground">{detail.authorities_legal}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dataRetention")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.data_retention}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("cookiesPolicy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.cookies_policy}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("rightToModify")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{detail.right_to_modify}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
