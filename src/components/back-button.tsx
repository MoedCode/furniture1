"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
}
