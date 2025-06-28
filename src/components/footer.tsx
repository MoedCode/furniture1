import {
  Mail,
  MapPin,
  FileText,
  Calculator,
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchStatic } from "@/api/server-hooks/api";
import { z } from "zod";

const siteInfoSchema = z.object({
  detail: z.object({
    info: z.object({
      name: z.string().nullable(),
      email: z.string().nullable(),
      location: z
        .object({
          url: z.string(),
          address: z.string(),
        })
        .nullable(),
      commercial_record_number: z.string().nullable(),
      tax_number: z.string().nullable(),
    }),
    specials: z.object({
      whatsapp: z.string().nullable(),
      facebook: z.string().nullable(),
      instagram: z.string().nullable(),
      tiktok: z.string().nullable(),
    }),
  }),
});

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = await getLocale();
  const isRtl = locale === "ar";

  const data = await fetchStatic("/site_data/footer", siteInfoSchema, {
    tags: ["footer"],
  });

  const info = data.detail.info;

  const contactInfo = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: isRtl ? "البريد الخاص بنا" : "Our Email",
      value: info.email || "-",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: isRtl ? "عنواننا" : "Location",
      value: info.location ? (
        <a
          href={info.location.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {info.location.address}
        </a>
      ) : (
        "-"
      ),
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: isRtl ? "السجل التجاري" : "Commercial Registration",
      value: info.commercial_record_number || "-",
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      label: isRtl ? "الرقم الضريبي" : "Tax Number",
      value: info.tax_number || "-",
    },
  ];

  const legalLinks = [
    {
      label: isRtl ? "من نحن" : "About Us",
      href: "#about",
    },
    {
      label: isRtl ? "مقالات" : "Articles",
      href: "#articles",
    },
    {
      label: isRtl ? "سياسة الخصوصية" : "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: isRtl ? "الشروط ولاحكام" : "Terms & Conditions",
      href: "/terms-conditions",
    },
  ];

  const rawSocialLinks = [
    {
      name: "WhatsApp",
      href: data.detail.specials.whatsapp,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      name: "Facebook",
      href: data.detail.specials.facebook,
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      name: "Instagram",
      href: data.detail.specials.instagram,
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      name: "TikTok",
      href: data.detail.specials.tiktok,
      icon: <Music2 className="h-4 w-4" />,
    },
  ];

  const socialLinks = rawSocialLinks.filter(
    (link) => typeof link.href === "string" && link.href.trim() !== "",
  );

  return (
    <footer className="w-full flex-col justify-between p-6 border-t">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 pb-2">
        {/* Left Column - Logo and Social */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-xl">{data.detail.info.name}</h3>
          <div className="flex space-x-4">
            {socialLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{link.name}</span>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    {link.icon}
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </div>

        {/* Center Column - Legal Links */}
        <div className="flex flex-col space-y-4">
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Column - Contact Info */}
        <div className="flex flex-col space-y-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center w-full py-2">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {info.name ?? "Lockers"}.{" "}
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
