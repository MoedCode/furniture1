import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { z } from "zod";
import { getTranslations } from "next-intl/server";
import { fetchStatic } from "@/api/server-hooks/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CreateReviewDialog } from "./review-dialog";
export const RatingSchema = z.object({
  user: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const RatingsSchema = z.array(RatingSchema);

export async function Testimonials() {
  const t = await getTranslations("testimonials");

  const data = await fetchStatic("/rating", RatingsSchema, {
    tags: ["ratings"],
  });

  const renderRating = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? "text-orange-300" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>
        {data.length === 0 ? (
          <p className="text-center text-sm md:text-base text-muted-foreground">
            {t("noRatings")}
          </p>
        ) : (
          <Carousel className="w-full flex flex-col">
            <CarouselContent className="p-4">
              {data.map((rating, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 h-full">
                    <CardContent className="pt-6 flex flex-col h-full">
                      <h3 className="text-xl font-bold mb-2">{rating.user}</h3>
                      <p className="text-muted-foreground mb-4 flex-grow">
                        {rating.comment}
                      </p>
                      <div className="flex">{renderRating(rating.stars)}</div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
      <CreateReviewDialog />
    </section>
  );
}
