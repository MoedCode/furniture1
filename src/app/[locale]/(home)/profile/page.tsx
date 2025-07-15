"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileHeader } from "./_components/profile-header";
import { PersonalInfo } from "./_components/personal-info";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getContactFields, getDisplayName } from "@/lib/utils";
import useProfileData from "@/hooks/use-profile";
import { Order } from "./_components/order";

const LoadingState = () => {
  const t = useTranslations("profile");

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">{t("loading")}</p>
    </div>
  );
};

const ErrorState = ({
  error,
  onRetry,
}: { error: string; onRetry: () => void }) => {
  const t = useTranslations("profile");

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center py-8 space-y-4">
      <p className="text-destructive text-center">{error}</p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        {t("error.retryButton")}
      </Button>
    </div>
  );
};

export default function ProfilePage() {
  const t = useTranslations("profile");

  const { userData, profileData, isLoading, error, refetch } = useProfileData();


  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !userData || !profileData) {
    return <ErrorState error={error || t("error.noData")} onRetry={refetch} />;
  }

  const displayName = getDisplayName(userData, profileData);
  const contactFields = getContactFields(userData, t);

  return (
    <div
      className="container mx-auto h-full flex flex-col w-full py-8"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-black">
            {t("pageTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <ProfileHeader
            name={displayName}
            email={userData.email}
            profileImage={profileData.image || undefined}
          />
          <Separator className="w-full" />
          <PersonalInfo fields={contactFields} />
          <Separator className="w-full" />
          <Order />
        </CardContent>
      </Card>
    </div>
  );
}
