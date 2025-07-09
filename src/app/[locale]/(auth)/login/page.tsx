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
import { fetchWithoutAuth } from "@/api/hooks/api";
import { toast } from "sonner";
import { useTransition, useEffect } from "react";
import { Loader2 } from "lucide-react";

const useFormSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(2, { message: t("usernameError") }),
    password: z.string().min(6, { message: t("passwordError") }),
  });

const authTokenSchema = z.object({
  Authorization: z.string().optional(),
  access: z.string(),
  refresh: z.string(),
  detail: z.string(),
});

export default function SignIn() {
  const t = useTranslations("SignInPage");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const formSchema = useFormSchema(t);


  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.info(t("alreadyLoggedIn") || "You are already logged in!");
      router.push("/profile");
    }
  }, [router, t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const tokens = await fetchWithoutAuth("/login", authTokenSchema, {
          init: {
            method: "POST",
            body: JSON.stringify(values),
          },
        });
        localStorage.setItem("token", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);

        toast.success(t("loginSuccess"));
        router.push("/profile");
      } catch (error) {
        console.error("Login error:", error);
        toast.error(t("loginError"));
      }
    }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 items-center justify-center">
          <h2 className="text-xl md:text-3xl md:font-bold font-semibold">
            {t("title")}
          </h2>
          <p>{t("subtitle")}</p>
        </div>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t("usernameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("usernamePlaceholder")}
                    type="text"
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
              <FormItem className="space-y-2">
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("passwordPlaceholder")}
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : t("submitButton")}
          </Button>
        </div>
        <p className="text-accent-foreground text-center text-sm">
          {t("noAccount")}
          <Button asChild variant="link" className="px-2">
            <Link href="/register">{t("createAccount")}</Link>
          </Button>
        </p>
      </form>
    </Form>
  );
}
