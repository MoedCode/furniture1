"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import LogoutButton from "./logout";

type Props = {
  name: string;
  email: string;
  profileImage?: string;
};

export function ProfileHeader({ name, email, profileImage }: Props) {
  const t = useTranslations("profile");
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
          <AvatarImage src={profileImage} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 break-all sm:break-normal">
            {email}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Link href="/profile/edit">
            <Button variant="outline" className="w-full sm:w-auto px-6">
              {t("actions.edit")}
            </Button>
          </Link>
          <Link href="/profile/edit-user">
            <Button className="w-full sm:w-auto px-6">
              {t("editUser.pageTitle")}
            </Button>
          </Link>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
