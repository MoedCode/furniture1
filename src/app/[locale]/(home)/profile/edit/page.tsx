"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UploadCloud, ArrowLeft } from "lucide-react";
import { fetchMediaWithAuth } from "@/api/hooks/api";
import useProfileData from "@/hooks/use-profile";
import { getApiUrl } from "@/lib/utils";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  image: z.custom<File>().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const profileUpdateSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  image: z.string().optional().nullable(),
});

export default function EditProfilePage() {
  const { userData, profileData, isLoading, refetch } = useProfileData();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("profile.edit");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (userData && profileData) {
      form.reset({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: userData.email,
      });
      
      if (profileData.image) {
        setPreviewImage(profileData.image);
      }
    }
  }, [userData, profileData, form]);

  if (isLoading) {
    return (
      <div className="container mx-auto h-screen flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!userData || !profileData) {
    router.push("/login");
    return null;
  }

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        
        if (values.first_name) {
          formData.append("first_name", values.first_name);
        }
        
        if (values.last_name) {
          formData.append("last_name", values.last_name);
        }
        
        if (values.email) {
          formData.append("email", values.email);
        }
        
        if (values.image) {
          formData.append("image", values.image);
        }

        // For file uploads, create a fetch request directly to bypass Content-Type issues
        const apiUrl = getApiUrl("/profile");
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }
        
        const response = await fetch(apiUrl, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        
        const responseData = await response.json();
        const updatedProfile = profileUpdateSchema.parse(responseData);

        toast.success(t("updateSuccess") || "Profile updated successfully");
        await refetch();
        router.push("/profile");
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error(t("updateError") || "Failed to update profile");
      }
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set form value - store the actual File object, not FileList
      form.setValue("image", file);
      
      // Set preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="container mx-auto h-full flex flex-col w-full py-8"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/profile")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-3xl font-black">
              {t("pageTitle")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={previewImage || "/user.png"}
                      alt={userData.username}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {userData.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <UploadCloud className="h-5 w-5" />
                    <span className="sr-only">{t("uploadImage")}</span>
                  </label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isPending}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{t("imageHelp")}</p>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("firstNameLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("firstNamePlaceholder") || "First Name"} {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("lastNameLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("lastNamePlaceholder") || "Last Name"} {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  disabled={isPending}
                >
                  {t("cancelButton") || "Cancel"}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("saving") || "Saving..."}
                    </>
                  ) : (
                    t("saveButton") || "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}