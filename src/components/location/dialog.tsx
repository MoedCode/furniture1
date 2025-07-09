"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Navigation, Check, X } from "lucide-react";
import { useLocationPicker } from "@/hooks/use-location-picker";
import { useEffect, useRef } from "react";
import { MapComponent } from "./map-component";

interface LocationPickerProps {
  onLocationChange: (
    location: {
      lat: number;
      lng: number;
      address?: string;
      coordinates?: string;
    } | null,
  ) => void;
  initialLocation?: { lat: number; lng: number };
  disabled?: boolean;
}

export function LocationPicker({
  onLocationChange,
  initialLocation,
  disabled,
}: LocationPickerProps) {
  const {
    selectedLocation,
    isMapOpen,
    locationConfirmed,
    openMap,
    closeMap,
    selectLocation,
    confirmLocation,
    getCurrentLocation,
    clearLocation,
  } = useLocationPicker(
    initialLocation
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : undefined,
  );

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedLocation && locationConfirmed) {
      console.log("Updating form with location:", selectedLocation);
      onLocationChange(selectedLocation);
    }
  }, [selectedLocation, locationConfirmed, onLocationChange]);

  const handleConfirmLocation = () => {
    const location = confirmLocation();
    if (location) {
      console.log("Location confirmed and dialog will close:", location);
    }
  };

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      console.log("Current location obtained:", location);
    } catch (error) {
      alert(error instanceof Error ? error.message : "حدث خطأ في تحديد الموقع");
    }
  };

  const handleClearLocation = () => {
    clearLocation();
    onLocationChange(null);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={openMap}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {selectedLocation ? "تغيير الموقع" : "اختر موقعك من الخريطة"}
          </Button>

          {selectedLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {selectedLocation && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              الإحداثيات: {selectedLocation.coordinates}
            </div>
            {selectedLocation.address && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm font-medium text-foreground mb-1">
                  العنوان:
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {selectedLocation.address}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isMapOpen} onOpenChange={(open) => !open && closeMap()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            اختر موقعك من الخريطة
          </DialogTitle>
        </DialogHeader>

        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <div className="space-y-4">
            {/* Real Map */}
            <div className="h-96 w-full rounded-md border">
              {isMapOpen && (
                <MapComponent
                  center={selectedLocation || { lat: 24.7136, lng: 46.6753 }}
                  onLocationSelect={selectLocation}
                  selectedLocation={
                    selectedLocation || { lat: 24.7136, lng: 46.6753 }
                  }
                />
              )}
            </div>

            {/* Coordinates display */}
            {selectedLocation && (
              <div className="text-sm text-muted-foreground text-center">
                الإحداثيات المحددة: {selectedLocation.coordinates}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                className="flex items-center gap-2 flex-1"
              >
                <Navigation className="h-4 w-4" />
                موقعي الحالي
              </Button>
              <Button
                onClick={handleConfirmLocation}
                className={`flex items-center gap-2 flex-1 ${locationConfirmed ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                disabled={!locationConfirmed}
              >
                <Check className="h-4 w-4" />
                استخدام هذا الموقع
              </Button>
            </div>

            {/* Cancel button */}
            <Button variant="outline" onClick={closeMap} className="w-full">
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
