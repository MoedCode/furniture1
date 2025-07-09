"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Users, Plus, Minus } from "lucide-react";

import type {  FormValues } from "@/schemas/order";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface RoomsSectionProps {
  control: Control<FormValues>;
}

export function RoomsSection({ control }: RoomsSectionProps) {
  const t = useTranslations("movingForm");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Users className="h-5 w-5" />
        {t("rooms.title")}
      </div>
      <div>
        <FormField
          control={control}
          name="rooms_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-4 max-w-sm mx-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                    disabled={field.value <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl sm:text-3xl font-bold">{field.value}</div>
                    <div className="text-sm text-muted-foreground">{t("rooms.rooms")}</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => field.onChange(Math.min(10, field.value + 1))}
                    disabled={field.value >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}