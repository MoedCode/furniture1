"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import type {  FormValues } from "@/schemas/order";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { TIME_SLOTS } from "@/data";

interface DateTimeSectionProps {
  control: Control<FormValues>;
}

export function DateTimeSection({ control }: DateTimeSectionProps) {
  const t = useTranslations("movingForm");
  const locale = useLocale();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <CalendarIcon className="h-5 w-5" />
          {t("dateTime.movingDate")}
        </div>
        <div>
          <FormField
            control={control}
            name="transportation_date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP", {
                            locale: locale === "ar" ? ar : enUS,
                          })
                        ) : (
                          t("dateTime.pickDate")
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          setIsDatePickerOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5" />
          {t("dateTime.preferredTime")}
        </div>
        <div>
          <FormField
            control={control}
            name="transportation_date_time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("dateTime.selectTime")} />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {t(`timeSlots.${time}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}