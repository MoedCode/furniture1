
"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";


export default function LogoutButton() {
  const t = useTranslations("profile");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      router.push("/");
    });
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="destructive" 
      disabled={isPending}
      className="w-full"
    >
      {isPending ? t("logout.loggingOut") : t("logout.action")}
    </Button>
  );
}
