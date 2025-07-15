"use client";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, MapPin, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/api/hooks/api";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export const orderSchema = z.strictObject({
  id: z.string().min(1),
  user: z.string().min(1),
  package: z.string().min(1),
  promo_code: z.string().min(1).nullable(),
  from_address: z.string().min(1),
  from_lat: z.string().regex(/^-?\d+(\.\d+)?$/), // Decimal string
  from_lng: z.string().regex(/^-?\d+(\.\d+)?$/),
  to_address: z.string().min(1),
  to_lat: z.string().regex(/^-?\d+(\.\d+)?$/),
  to_lng: z.string().regex(/^-?\d+(\.\d+)?$/),
  transportation_date: z.string().min(1),
  transportation_date_time: z.string().min(1),
  rooms_number: z.number().int().min(1),
  phone_code: z.string().min(1),
  phone_number: z.string().min(1),
  belonging_description: z.string().min(1),
  service_type: z.enum(["Intracity", "City-to-city"]), // Adjust if more types
  total: z.number().min(0),
  order_state: z.string().min(1),
  order_state_comment: z.string().nullable(),
  images: z.array(z.string()),
});

type OrderData = z.infer<typeof orderSchema>;

export function Order() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("profile.order");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Format date based on locale
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "PPP", { locale: isRtl ? ar : enUS });
    } catch (e) {
      return date;
    }
  };

  // Determine status color based on order state
  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "completed" || lowerStatus === "مكتمل")
      return "bg-green-100 text-green-800 border-green-200";
    if (lowerStatus === "in progress" || lowerStatus === "قيد التنفيذ")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (lowerStatus === "pending" || lowerStatus === "قيد الانتظار")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (lowerStatus === "cancelled" || lowerStatus === "ملغي")
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const orderResponse = await fetchWithAuth("/order", orderSchema, {
          init: { method: "GET" },
        });
        setOrderData(orderResponse);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : t("error.failedToLoad");
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [t]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("loading")}</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !orderData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error || t("error.noData")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/40 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle
          className={cn("text-xl font-semibold flex items-center gap-2")}
        >
          <Package className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col gap-6">
          {/* Order Status Banner */}
          <div className="w-full">
            <Badge
              variant="outline"
              className={cn(
                "w-full justify-center py-2 text-base font-medium border rounded-md",
                getStatusColor(orderData.order_state),
              )}
            >
              {orderData.order_state}
            </Badge>
            {orderData.order_state_comment && (
              <p className="mt-2 text-sm text-center text-muted-foreground">
                {orderData.order_state_comment}
              </p>
            )}
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("fields.orderId")}
              </p>
              <p className="text-base font-medium">{orderData.id}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  {t("fields.date")}
                </p>
              </div>
              <p className="text-base">
                {formatDate(orderData.transportation_date)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("fields.serviceType")}
              </p>
              <p className="text-base capitalize">
                {t(`serviceTypes.${orderData.service_type.toLowerCase()}`)}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("fields.rooms")}
              </p>
              <p className="text-base">
                {orderData.rooms_number} {t("rooms")}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("fields.total")}
              </p>
              <p className="text-base font-semibold text-primary">
                {orderData.total} {t("currency")}
              </p>
            </div>

            <div className="sm:col-span-2 border rounded-md p-3 bg-muted/10">
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  {t("fields.fromAddress")}
                </p>
              </div>
              <p className="text-base">{orderData.from_address}</p>
            </div>

            <div className="sm:col-span-2 border rounded-md p-3 bg-muted/10">
              <div className="flex items-center gap-1 mb-1">
                <Truck className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  {t("fields.toAddress")}
                </p>
              </div>
              <p className="text-base">{orderData.to_address}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                {t("fields.description")}
              </p>
              <p className="text-base mt-1">
                {orderData.belonging_description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
