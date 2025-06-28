"use client";

import { costCalculator, type CostCalculator } from "@/schemas/cost-calculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { usePackages } from "@/hooks/use-packages";
import { useRouter } from "@/i18n/navigation";

export default function CostCalculatorForm() {
  const locale = useLocale();
  const { packages, loading } = usePackages(locale);

  const form = useForm<CostCalculator>({
    resolver: zodResolver(costCalculator),
    defaultValues: {
      packageType: packages[0]?.id,
      rooms: 1,
    },
  });

  // Watch form values for reactivity
  const packageType = useWatch({ control: form.control, name: "packageType" });
  const rooms = useWatch({ control: form.control, name: "rooms" });

  const price = useMemo(() => {
    return (
      Number.parseInt(packages.find((p) => p.id === packageType)?.price!) *
      rooms
    );
  }, [packageType, rooms, packages.find]);

  const router = useRouter();

  function onSubmit(data: CostCalculator) {
    console.log({ ...data });
    router.push(`/order?pkg=${data.packageType}&rooms=${data.rooms}`);
  }

  useEffect(() => {
    if (loading) return;
    form.reset({ packageType: packages[0].id, rooms: 1 });
  }, [loading, form, packages]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        <div className={cn("space-y-6 md:space-y-8", "md:col-span-5")}>
          <PackageSelector form={form} />
          <RoomSelector form={form} />
        </div>
        <div className={cn("md:col-span-3")}>
          <PriceDisplay price={price} />
        </div>
        <div className={cn("md:col-span-4")}>
          <ActionButton />
        </div>
      </form>
    </Form>
  );
}

function PackageSelector({ form }: { form: UseFormReturn<CostCalculator> }) {
  const t = useTranslations("costCalculator");
  const locale = useLocale();
  const { packages } = usePackages(locale);
  return (
    <FormField
      control={form.control}
      name="packageType"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium">
            {t("selectPackage")}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger id="package">
                <SelectValue placeholder={t("selectPackage")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {packages.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function RoomSelector({ form }: { form: UseFormReturn<CostCalculator> }) {
  const t = useTranslations("costCalculator");

  const handleRoomChange = (value: number) => {
    if (value >= 1) {
      form.setValue("rooms", value);
    }
  };

  return (
    <FormField
      control={form.control}
      name="rooms"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-medium">{t("rooms")}</FormLabel>
          <div dir="ltr" className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleRoomChange(field.value - 1)}
              disabled={field.value <= 1}
              className={cn("rounded-r-none border-r-0")}
            >
              <MinusCircle className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <FormControl>
              <Input
                id="rooms"
                type="number"
                min="1"
                value={field.value}
                onChange={(e) =>
                  handleRoomChange(parseInt(e.target.value) || 1)
                }
                className={cn(
                  "rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                )}
              />
            </FormControl>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleRoomChange(field.value + 1)}
              className={cn("rounded-l-none border-l-0")}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function PriceDisplay({ price }: { price: number }) {
  const t = useTranslations("costCalculator");

  return (
    <div className="bg-[var(--primary)]/5 rounded-lg p-6 flex flex-col items-center justify-center space-y-2">
      <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
        {t("estimatedPrice")}
      </h2>
      <span className="text-3xl font-bold text-[var(--primary)]">
        {price} {t("riyals")}
      </span>
      <h4 className="text-xs text-[var(--muted-foreground)]">
        {t("taxIncluded")}
      </h4>
    </div>
  );
}

function ActionButton() {
  const t = useTranslations("costCalculator");

  return (
    <div className="flex flex-col space-y-4">
      <Button type="submit" size="lg" className="w-full hover:cursor-pointer">
        {t("completeOrder")}
      </Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">
        {t("noObligationEstimate")}
      </p>
    </div>
  );
}
