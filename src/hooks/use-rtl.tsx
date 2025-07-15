import { useLocale } from "next-intl";

export function UseRTL() {
  const locale = useLocale();
  return locale === "ar";
}
