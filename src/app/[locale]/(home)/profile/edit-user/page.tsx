"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchWithAuth } from "@/api/hooks/api";
import { userSchema } from "@/schemas/user";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import useProfileData from "@/hooks/use-profile";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BackButton } from "@/components/back-button";

export default function EditUserPage() {
  const t = useTranslations("profile.editUser");
  const router = useRouter();

  const { userData, isLoading: isProfileLoading, error } = useProfileData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form schema based on userSchema but make most fields optional
  const updateUserSchema = z.object({
    username: z.string().min(2, t("usernameError")),
    password: z.string().min(6, t("passwordError")).optional().nullable(),
    email: z.string().email(t("emailError")),
    phone_number: z.string().min(10, t("phoneNumberError")).optional().nullable(),
    whatsapp_number: z.string().min(10, t("whatsappNumberError")).optional().nullable(),
    city: z.string().min(1, t("cityError")).optional().nullable(),
    postal_code: z.string().min(1, t("postalCodeError")).optional().nullable(),
    address: z.string().min(5, t("addressError")).optional().nullable(),
  });

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      password: null,
      email: "",
      phone_number: "",
      whatsapp_number: "",
      city: "",
      postal_code: "",
      address: "",
    },
  });

  // Fill form with current user data
  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        whatsapp_number: userData.whatsapp_number || "",
        city: userData.city || "",
        postal_code: userData.postal_code || "",
        address: userData.address || "",
        password: null, // Password field is empty by default
      });
    }
  }, [userData, form]);

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      setIsSubmitting(true);
      
      const dataToSubmit = { ...values };

      const updatedUser = await fetchWithAuth("/users", userSchema, {
        init: {
          method: "PUT",
          body: JSON.stringify(dataToSubmit),
        },
      });

      toast.success(t("updateSuccess", { username: updatedUser.username }));


      router.push("/profile");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(t("updateError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="container mx-auto h-screen flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive text-center">{error || t("error")}</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/profile")}
            >
              {t("backToProfile")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <BackButton />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-3xl font-black">{t("pageTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("usernameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("usernamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("emailLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("emailPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("passwordLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("passwordPlaceholder")}
                          type="password"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phoneNumberLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("phoneNumberPlaceholder")}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("whatsappNumberLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("whatsappNumberPlaceholder")}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-4" />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("cityLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("cityPlaceholder")}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postalCodeLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postalCodePlaceholder")}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("addressLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("addressPlaceholder")}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? t("saving") : t("saveButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}