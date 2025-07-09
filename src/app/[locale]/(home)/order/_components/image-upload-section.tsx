"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";

type Props = {
  onImagesChange: (images: File[]) => void;
  disabled?: boolean;
};

export function ImageUploadSection({ onImagesChange, disabled }: Props) {
  const t = useTranslations("movingForm");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 15) {
      toast.error(
        t("imageLimitError") || "You can upload a maximum of 15 images.",
      );
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    onImagesChange(newImages);

    // Reset input value to allow re-uploading the same files
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    onImagesChange(newImages);
  };

  return (
    <FormItem>
      <FormLabel className="text-sm font-medium">{t("imagesLabel")}</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={disabled || selectedImages.length >= 15}
            className="cursor-pointer"
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {t("imagesHint") || "Upload up to 15 images (JPEG, PNG)."}
          </p>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
