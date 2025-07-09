import "../globals.css";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Providers } from "@/providers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { cn } from "@/lib/utils";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "شركة السلام لنقل الأثاث",
  description:
    "شركة متخصصة في نقل الأثاث داخل وخارج المدينة بأمان وسرعة. احجز الآن خدماتنا لنقل أثاث منزلك أو مكتبك بسهولة وراحة.",
  keywords: [
    "نقل أثاث",
    "شركة نقل أثاث",
    "نقل عفش",
    "الرياض",
    "الدمام",
    "نقل عفش آمن",
    "خدمات النقل",
    "فك وتركيب الأثاث",
  ],
  authors: [{ name: "شركة السلام", url: "https://www.el-salam.net" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "شركة السلام لنقل الأثاث",
    description:
      "خدمة احترافية لنقل الأثاث داخل وخارج المدينة. نضمن لك الراحة والأمان.",
    url: "https://www.el-salam.net",
    siteName: "شركة السلام",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className={cn("antialiased", cairo.variable)}>
        <Providers>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
