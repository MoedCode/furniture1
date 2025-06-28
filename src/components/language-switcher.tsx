"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("navbar.language-switcher");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "h-9 w-9 rounded-lg transition-all duration-200",
            "hover:bg-accent/80 hover:scale-105 border border-border/40 hover:border-border/80"
          )}
          aria-label="Switch language"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 p-1 border border-border/40 shadow-lg"
      >
        <DropdownMenuItem asChild>
          <Link 
            locale="en" 
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-accent/80 focus:bg-accent cursor-pointer w-full",
              locale === "en" && "bg-accent/60"
            )}
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs font-semibold capitalize bg-blue-100 text-blue-700">
                {t("en")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{t("en-fullname")}</span>
            {locale === "en" && <Check className="w-4 h-4 ml-auto text-primary" />}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link 
            locale="ar" 
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-accent/80 focus:bg-accent cursor-pointer w-full",
              locale === "ar" && "bg-accent/60"
            )}
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs font-semibold capitalize bg-green-100 text-green-700">
                {t("ar")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{t("ar-fullname")}</span>
            {locale === "ar" && <Check className="w-4 h-4 ml-auto text-primary" />}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
