"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { formSchema, type FormValues, type ServiceType } from "@/schemas/order";
import { usePriceCalculation } from "@/hooks/use-price-calculation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ServiceTypeSection } from "./service-type-section";
import { PackageSection } from "./package-section";
import { AddressSection } from "./address-section";
import { DateTimeSection } from "./datetime-section";
import { RoomsSection } from "./rooms-section";
import { ContactSection } from "./contact-section";
import { DetailsSection } from "./details-section";
import { PriceSummary } from "./price-summary";
import { ImageUploadSection } from "./image-upload-section";
import { fetchMediaWithAuth, fetchWithAuth } from "@/api/hooks/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

const createOrderSchema = z.strictObject({
  detail: z.string().min(1),
  id: z.string().min(1),
});

const orderImagesSchema = z.object({
  detail: z.string().min(1),
  images: z.array(
    z.object({
      id: z.string(),
      image_url: z.string().url(),
    }),
  ),
});

export function ComprehensiveMovingForm() {
  const [isPending, startTransition] = useTransition();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const t = useTranslations("movingForm");
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_type: "Intracity" as ServiceType,
      package: searchParams.get("pkg") ?? "",
      from_address: "",
      from_lat: 24.7136,
      from_lng: 46.6753,
      to_address: "",
      to_lat: 24.7136,
      to_lng: 46.6753,
      transportation_date: "",
      transportation_date_time: "",
      rooms_number: Number.parseInt(searchParams.get("rooms") ?? "1"),
      phone_code: "+966",
      phone_number: "",
      belonging_description: "",
      total: 0,
      promo_code: "",
    },
  });

  const packageId = useWatch({ control: form.control, name: "package" });
  const serviceType = useWatch({
    control: form.control,
    name: "service_type",
  }) as ServiceType;
  const numberOfRooms = useWatch({
    control: form.control,
    name: "rooms_number",
  });
  const promoCode = useWatch({ control: form.control, name: "promo_code" });

  const { estimatedPrice } = usePriceCalculation({
    packageId,
    serviceType,
    numberOfRooms,
    promo_code: promoCode,
    locale,
  });

  useEffect(() => {
    form.setValue("total", estimatedPrice);
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error(t("loginRequired"));
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [estimatedPrice, form, locale, t, router]);

  const onSubmit = form.handleSubmit(async (values) => {   
    startTransition(async () => {
      try {
        const orderResponse = await fetchWithAuth("/order", createOrderSchema, {
          init: {
            method: "POST",
            body: JSON.stringify(values),
          },
        });

        console.log("Order created:", orderResponse);
        toast.success(t("orderSuccess") || "Order created successfully!");

        if (selectedImages.length > 0) {
          const formData = new FormData();
          formData.append("order_id", orderResponse.id);

          for (const image of selectedImages) {
            formData.append("order_images", image);
          }

          const imageResponse = await fetchMediaWithAuth(
            "/order/images",
            orderImagesSchema,
            {
              init: {
                method: "POST",
                body: formData,
              },
            },
          );

          toast.success(t("imagesSuccess"));
        }

        form.reset();
        setSelectedImages([]);
      } catch (error: unknown) {
        console.error("Order error:", error);
        let errorMessage =
          t("orderError") || "Failed to create order. Please try again.";
        if (error instanceof Error) {
          if (error.message.includes("HTTP error")) {
            errorMessage = t("serverError") || `Server error: ${error.message}`;
          } else if (error.message.includes("Invalid response format")) {
            errorMessage = t("invalidResponse") || "Invalid server response.";
          }
        }
        toast.error(errorMessage);
      }
    });
  });

  return (
    <div
      className="min-h-screen bg-muted/30 py-4 sm:py-8"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8">
                <ServiceTypeSection control={form.control} />
                <PackageSection control={form.control} />
                <AddressSection
                  control={form.control}
                  serviceType={serviceType}
                />
                <DateTimeSection control={form.control} />
                <RoomsSection control={form.control} />
                <ContactSection control={form.control} />
                <DetailsSection control={form.control} />
                <ImageUploadSection
                  onImagesChange={setSelectedImages}
                  disabled={isPending}
                />
                <PriceSummary
                  packageId={packageId}
                  estimatedPrice={estimatedPrice}
                />

                <div className="pt-6 border-t">
                  <Button
                    disabled={isPending}
                    type="submit"
                    size="lg"
                    className="w-full transition-all duration-200 hover:shadow-md"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <span>{t("submit.button")}</span>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {t("submit.agreement")}
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
