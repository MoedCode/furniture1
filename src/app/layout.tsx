import keywords from "@/keywords";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شركة السلام لنقل العفش بالرياض - خدمات احترافية وآمنة",
  description:
    "السلام افضل شركة نقل عفش بالمملكة وبين المدن انطلقت في عام 2023 لتصبح الرائدة في نقل الاثاث بالسعودية، نقدم خدمات متكاملة تشمل نقل وتخزين العفش، الفك والتركيب، وتغليف الاثاث باحترافية، مع ضمانات شاملة وحرص دائم على راحة العميل.",
  keywords: keywords,
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
    locale: "ar_SA",
    type: "website",
  },
};

export default function BaseLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
