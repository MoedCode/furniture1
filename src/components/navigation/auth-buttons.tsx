"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LogIn, User, UserPlus } from "lucide-react";
import { Unauthenticated } from "../auth/unauthenticated";
import { Authenticated } from "../auth/authenticated";
import { Link } from "@/i18n/navigation";

export function AuthButtons({ className = "" }: { className?: string }) {
  const t = useTranslations("navbar");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Unauthenticated>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Link href="/login">
            <Button
              className="min-w-full">
              <LogIn className="w-4 h-4 mr-2" />
              {t("login")}
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant={"secondary"}
              className="min-w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              {t("signup")}
            </Button>
          </Link>
        </div>
      </Unauthenticated>
      <Authenticated>
        <Button
          size="icon"
          className={cn(
            "h-9 w-9 rounded-lg transition-all duration-200",
            "hover:bg-accent/80 hover:scale-105 border border-border/40 hover:border-border/80",
          )}
          aria-label="Profile"
          asChild
        >
          <Link href="/profile">
            <User className="h-4 w-4" />
          </Link>
        </Button>
      </Authenticated>
    </div>
  );
}
