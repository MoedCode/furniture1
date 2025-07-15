"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchWithAuth } from "@/api/hooks/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

// Define schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  phone_number: z
    .string()
    .min(8, { message: "Phone number must be at least 8 digits" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  enquiry: z.enum(["inquiry", "feedback", "support", "other"], {
    required_error: "Please select an enquiry type",
  }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const responseSchema = z.object({
  detail: z.string().optional(),
});

export function ContactForm() {
  const t = useTranslations("contactForm");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      email: "",
      enquiry: "inquiry",
      message: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: ContactFormValues) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error(t("loginRequired") || "Please log in to submit an order");
      router.push("/login");
    }
    startTransition(async () => {
      try {
        await fetchWithAuth("/order", responseSchema, {
          init: {
            method: "POST",
            body: JSON.stringify(values),
          },
        });
        toast.success(t("successMessage"));

        form.reset();
      } catch (error) {
        toast.error(
          t("errorMessage") || "An error occurred while submitting the form.",
        );
      }
    });
  };

  return (
    <section className="w-full py-12 md:py-24 bg-muted/30" id="contact">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
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
                  <FormLabel>{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("phonePlaceholder")} {...field} />
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
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
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
              name="enquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("enquiryType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectEnquiryType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inquiry">{t("inquiry")}</SelectItem>
                      <SelectItem value="feedback">{t("feedback")}</SelectItem>
                      <SelectItem value="support">{t("support")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={t("messagePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("sending")}
                  </>
                ) : (
                  t("send")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
