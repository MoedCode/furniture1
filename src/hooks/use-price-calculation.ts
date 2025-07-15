"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { ServiceType } from "@/schemas/order";
import { usePackages, type PackageType } from "@/hooks/use-packages";
import { getApiUrl } from "@/lib/utils";

type Props = {
  packageId: string;
  serviceType: ServiceType;
  promo_code?: string;
  numberOfRooms: number;
  locale?: string;
};

const promoCodeSchema = z.strictObject({
  id: z.string().min(1),
  code: z.string().min(1),
  value: z.number().nonnegative(),
});

type PromoType = z.infer<typeof promoCodeSchema>;

async function getPromoCode(code: string) {
  const res = await fetch(
    getApiUrl(`/promo_code/?code=${code}`),
  )
  const data = await res.json();
  const validatedData = promoCodeSchema.safeParse(data);
  if (!validatedData.success) throw new Error("Failed to fetch data");
  return validatedData.data;
}


function calculateRoomPrice(numberOfRooms: number): number {
  return Math.max(0, numberOfRooms) * 100; // Ensure non-negative
}

function applyServiceTypeMultiplier(total: number, serviceType: ServiceType): number {
  return serviceType === "City-to-city" ? total * 1.5 : total;
}
function calculatePriceAfterDiscount({
  basePrice,
  roomPrice,
  serviceType,
  promoValue,
}: {
  basePrice: number;
  roomPrice: number;
  serviceType: ServiceType;
  promoValue?: number;
}): number {
  if (Number.isNaN(basePrice) || basePrice <= 0) return 0;

  let total = basePrice + roomPrice;
  total = applyServiceTypeMultiplier(total, serviceType);

  if (promoValue && promoValue >= 0 && promoValue <= 1) {
    total *= 1 - promoValue;
  }

  return Math.round(Math.max(0, total));
}



export function usePriceCalculation({
  packageId,
  serviceType,
  numberOfRooms,
  promo_code,
  locale,
}: Props) {
   // @ts-ignore
  const { packages } = usePackages(locale);

  const [promo, setPromo] = useState<PromoType | null>(null);

  const [isPromoLoading, setIsPromoLoading] = useState(false);

  useEffect(() => {
    if (!promo_code) {
      setPromo(null);
      setIsPromoLoading(false);
      return;
    }
    setIsPromoLoading(true);
    getPromoCode(promo_code)
      .then(setPromo)
      .catch((err) => {
        console.error("Promo error:", err.message);
        setPromo(null);
      })
      .finally(() => {
        setIsPromoLoading(false);
      });

  }, [promo_code]);

  const estimatedPrice = useMemo(() => {

    const selectedPackage = packages.find(

      (pkg: PackageType) => pkg.id === packageId,

    );

    if (!selectedPackage) return 0;

    const basePrice = Number.parseFloat(
      selectedPackage.price.replace(/[^\d.]/g, ""),
    );
    const roomPrice = calculateRoomPrice(numberOfRooms);

    return calculatePriceAfterDiscount({
      basePrice,
      roomPrice,
      serviceType,
      promoValue: promo?.value,
    });

  }, [packageId, serviceType, numberOfRooms, packages, promo]);

  return {
    estimatedPrice,
    promo,
    packages,
    isPromoLoading,
  };

}
