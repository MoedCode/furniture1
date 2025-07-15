"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  center: { lat: number; lng: number };
  onLocationSelect: (
    coords: { lat: number; lng: number },
    address?: string,
  ) => void;
  selectedLocation: { lat: number; lng: number };
}

export function MapComponent({
  center,
  onLocationSelect,
  selectedLocation,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [tempLocation, setTempLocation] = useState<{
    lat: number;
    lng: number;
  }>(selectedLocation);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>("");

  // Function to get address from coordinates
  const getAddressFromCoords = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      setIsLoadingAddress(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar,en`,
      );
      const data = await response.json();

      if (data && data.display_name) {
        console.log("Address found:", data.display_name);
        return data.display_name;
      } else {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      }
    } catch (error) {
      console.error("Error getting address:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        // Wait a bit for CSS to load
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Import Leaflet
        const L = (await import("leaflet")).default;

        // Fix marker icons
        // @ts-ignore
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Create map
        // @ts-ignore
        const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add initial marker
        const marker = L.marker([
          selectedLocation.lat,
          selectedLocation.lng,
        ]).addTo(map);
        markerRef.current = marker;

        // Handle map clicks
        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;
          console.log("Map clicked at:", { lat, lng });

          // Update marker position
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }

          // Update temp location
          setTempLocation({ lat, lng });

          // Get address for the new location
          const address = await getAddressFromCoords(lat, lng);
          setCurrentAddress(address);

          // Show confirm button
          setShowConfirmButton(true);
        });

        // Invalidate size after a short delay
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      mapInstanceRef.current.setView([
        selectedLocation.lat,
        selectedLocation.lng,
      ]);
      setTempLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const handleConfirmLocation = () => {
    console.log("Location confirmed on map:", tempLocation);
    console.log("Address confirmed:", currentAddress);
    onLocationSelect(tempLocation, currentAddress);
    setShowConfirmButton(false);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-md" />

      {/* Confirm button that appears on the map */}
      {showConfirmButton && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-3 max-w-sm">
            {/* Address display */}
            <div className="mb-3 text-sm">
              <div className="font-medium text-gray-700 mb-1">العنوان:</div>
              {isLoadingAddress ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader className="h-4 w-4 animate-spin" />
                  جاري تحديد العنوان...
                </div>
              ) : (
                <div className="text-gray-600 text-xs leading-relaxed">
                  {currentAddress}
                </div>
              )}
            </div>

            {/* Confirm button */}
            <Button
              onClick={handleConfirmLocation}
              className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
              disabled={isLoadingAddress}
            >
              <Check className="h-4 w-4" />
              تأكيد هذا الموقع
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-2 right-2 bg-white/90 px-3 py-2 rounded shadow-md z-[1000] text-sm">
        انقر على الخريطة لتحديد موقعك
      </div>
    </div>
  );
}
