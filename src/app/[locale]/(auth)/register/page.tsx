"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useEffect, useTransition } from "react";
import { getApiUrl } from "@/lib/utils";

const useFormSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(2, { message: t("usernameError") }),
    password: z.string().min(6, { message: t("passwordError") }),
    email: z.string().email({ message: t("emailError") }),
    phone_number: z
      .string()
      .startsWith("+966", { message: t("phoneNumberError") })
      .min(10, { message: t("phoneNumberError") }),
    whatsapp_number: z.string().min(10, { message: t("whatsappNumberError") }),
    city: z.string().min(1, { message: t("cityError") }),
    postal_code: z.string().min(4, { message: t("postalCodeError") }),
    address: z.string().min(5, { message: t("addressError") }),
  });

const registerResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  phone_number: z.string(),
  whatsapp_number: z.string(),
  city: z.string(),
  postal_code: z.string(),
  address: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  is_staff: z.boolean(),
  is_superuser: z.boolean(),
  is_active: z.boolean(),
});

export default function Register() {
  const t = useTranslations("RegisterPage");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formSchema = useFormSchema(t);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.info(t("alreadyLoggedIn"));
      router.push("/profile");
    }
  }, [router, t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone_number: "+966",
      whatsapp_number: "+966",
      city: "Riyadh",
      postal_code: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch(getApiUrl("/register"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400 && data) {
            const validationErrors = data;
            const fields = [
              "username",
              "email",
              "phone_number",
              "whatsapp_number",
              "postal_code"
            ] as const;
            fields.forEach((field) => {
              if (validationErrors[field]) {
                form.setError(field, {
                  type: "server",
                  message: validationErrors[field], // Use raw server message
                });
              }
            });
            toast.error(t("registrationError"));
          } else {
            toast.error(t("serverError"));
          }
          return;
        }

        // Validate successful response
        const validatedData = registerResponseSchema.safeParse(data);
        if (!validatedData.success) {
          throw new Error("Invalid response format");
        }

        console.log("Registration response:", validatedData.data);
        toast.success(t("registerSuccess"));
        router.push("/login");
      } catch (error) {
        console.error("Register error:", error);
        toast.error(t("serverError"));
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 md:py-0 md:px-0">
      <div className="w-full max-w-2xl space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">{t("title")}</h2>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("usernameLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("usernamePlaceholder")}
                        type="text"
                        disabled={isPending}
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
                        disabled={isPending}
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
                        type="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phoneNumberLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("phoneNumberPlaceholder")}
                        type="tel"
                        disabled={isPending}
                        {...field}
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
                        type="tel"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("cityLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("cityPlaceholder")}
                        type="text"
                        disabled={isPending}
                        {...field}
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
                        type="text"
                        disabled={isPending}
                        {...field}
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("addressLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("addressPlaceholder")}
                        type="text"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("submitting") : t("submitButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("haveAccount")}
              <Button asChild variant="link" className="px-2">
                <Link href="/login">{t("signIn")}</Link>
              </Button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
