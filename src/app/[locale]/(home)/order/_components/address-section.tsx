"use client";

import type { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import type { FormValues, ServiceType } from "@/schemas/order";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LocationPicker } from "@/components/location/dialog";

interface AddressSectionProps {
  control: Control<FormValues>;
  serviceType: ServiceType;
}

type LocationData = {
  lat: number;
  lng: number;
  address?: string;
  coordinates?: string;
} | null;

export function AddressSection({ control, serviceType }: AddressSectionProps) {
  const t = useTranslations("movingForm");
  const { setValue, getValues } = useFormContext<FormValues>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MapPin className="h-5 w-5" />
          {t("addresses.fromAddress")}
        </div>
        <div>
          <FormField
            control={control}
            name="from_address"
            render={({ field }) => {
              const handleFromLocationChange = useCallback(
                (location: LocationData) => {
                  if (location) {
                    setValue("from_address", location.address || "");
                    setValue("from_lat", location.lat);
                    setValue("from_lng", location.lng);
                  }
                },
                [] // Remove setValue from dependencies to avoid the warning
              );

              // Get current values for initial location
              const currentValues = getValues();
              const initialLocation = {
                lat: currentValues.from_lat || 24.7136,
                lng: currentValues.from_lng || 46.6753,
                address: field.value || "",
              };

              return (
                <FormItem>
                  <FormControl>
                    <LocationPicker
                      onLocationChange={handleFromLocationChange}
                      initialLocation={initialLocation}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MapPin className="h-5 w-5" />
          {t("addresses.toAddress")}
        </div>
        <div>
          <FormField
            control={control}
            name="to_address"
            render={({ field }) => {
              const handleToLocationChange = useCallback(
                (location: LocationData) => {
                  if (location) {
                    setValue("to_address", location.address || "");
                    setValue("to_lat", location.lat);
                    setValue("to_lng", location.lng);
                  }
                },
                [] // Remove setValue from dependencies to avoid the warning
              );

              // Get current values for initial location
              const currentValues = getValues();
              const initialLocation = {
                lat: currentValues.to_lat || 24.7136,
                lng: currentValues.to_lng || 46.6753,
                address: field.value || "",
              };

              return (
                <FormItem>
                  <FormControl>
                    <LocationPicker
                      onLocationChange={handleToLocationChange}
                      initialLocation={initialLocation}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}