"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { FileQuestion, Heart, Home, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
};
export default function BottomBar() {
  const t = useTranslations("bottombar");

  const navItems = [
    { title: t("home"), href: "/", icon: Home },
    { title: t("cart"), href: "/cart", icon: ShoppingCart },
    { title: t("about"), href: "#about", icon: FileQuestion },
    { title: t("profile"), href: "/profile", icon: User },
  ];
  const pathname = usePathname();
  return (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-background border-t border-primary py-2 z-50">
      <div className="grid grid-cols-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center ${
              pathname === `/${item.href}` ? "text-primary" : "text-gray-600"
            } hover:text-primary`}
          >
            <item.icon className="text-xl" />
            {/* <span className="text-xs mt-1">{item.title}</span> */}
          </Link>
        ))}
      </div>
    </div>
  );
}
