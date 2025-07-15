"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { fetchWithAuth } from "@/api/hooks/api";

export const SubmitReviewSchema = z.object({
  stars: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const ReviewSchema = z.object({
  user: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});
export function CreateReviewDialog() {
  const t = useTranslations("testimonials");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SubmitReviewSchema>>({
    resolver: zodResolver(SubmitReviewSchema),
    defaultValues: {
      stars: 5,
      comment: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SubmitReviewSchema>) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error(t("loginRequired") || "Please log in to submit an order");
    }
    startTransition(async () => {
      try {
        await fetchWithAuth("/rating", ReviewSchema, {
          init: {
            method: "POST",
            body: JSON.stringify(values),
          },
        });

        toast.success(t("feedbackSuccess"));
        setOpen(false);
        form.reset();
      } catch (err) {
        toast.error(t("feedbackFail"));
        console.error(err);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("leaveRating")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rateExperience")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("star")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("comment")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("comment")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("submitting") : t("submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
