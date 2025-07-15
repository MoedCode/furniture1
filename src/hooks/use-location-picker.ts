"use client";

import { useState, useCallback } from "react";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  coordinates?: string;
}

export function useLocationPicker(initialLocation?: LocationData) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null,
  );

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(!!initialLocation);

  const openMap = useCallback(() => {
    setIsMapOpen(true);
  }, []);

  const closeMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const selectLocation = useCallback(
    (coords: { lat: number; lng: number }, address?: string) => {
      const locationData: LocationData = {
        lat: coords.lat,
        lng: coords.lng,
        address,
        coordinates: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
      };

      setSelectedLocation(locationData);
      setLocationConfirmed(true);
    },
    [],
  );

  const confirmLocation = useCallback(() => {
    if (selectedLocation && locationConfirmed) {
      setIsMapOpen(false);
      return selectedLocation;
    }
    return null;
  }, [selectedLocation, locationConfirmed]);

  const getCurrentLocation = useCallback(() => {
    return new Promise<LocationData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("المتصفح لا يدعم تحديد الموقع"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          let address: string | undefined;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=ar,en`,
            );
            const data = await response.json();
            if (data && data.display_name) {
              address = data.display_name;
            }
          } catch (error) {
            console.error("Error getting address for current location:", error);
          }

          const locationData: LocationData = {
            lat: coords.lat,
            lng: coords.lng,
            address,
            coordinates: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          };

          console.log("Current location obtained:", locationData);
          setSelectedLocation(locationData);
          setLocationConfirmed(true);
          resolve(locationData);
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(new Error("لا يمكن الحصول على موقعك الحالي"));
        },
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
    setLocationConfirmed(false);
  }, []);

  return {
    selectedLocation,
    isMapOpen,
    locationConfirmed,
    openMap,
    closeMap,
    selectLocation,
    confirmLocation,
    getCurrentLocation,
    clearLocation,
  };
}
