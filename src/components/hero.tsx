import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { BadgeCheckIcon, ArrowRightIcon } from "lucide-react";
import type { HeroData } from "@/schemas/hero";
import { Link } from "@/i18n/navigation";

type Props = {
  data: HeroData
}

export async function Hero({ data }: Props) {
  const t = await getTranslations("hero");

  const normalizedImages = data.images.map((item) => ({
    ...item,
    image: item.image.replace(/\/+/g, "/").replace(/^http:/, "http:"),
  }));

  return (
    <section className="relative w-full py-10 md:py-16 overflow-hidden">
      <div className="container px-4 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-y-4 md:gap-y-16 w-full">
            <Badge
              variant="secondary"
              className="w-fit flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-secondary/20 
                text-secondary-foreground hover:bg-secondary/30 transition-colors animate-fade-in"
            >
              <BadgeCheckIcon className="w-3.5 h-3.5" />
              <span>{t("textBadge")}</span>
            </Badge>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text 
                text-transparent bg-gradient-to-r from-primary to-primary/80 animate-fade-in delay-100">
                {data.site_name}
              </h1>

              <p className="text-base sm:text-xl md:text-2xl font-medium animate-fade-in delay-200">
                {data.title}
              </p>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed 
                animate-fade-in delay-300 max-w-[90%] sm:max-w-[85%]">
                {data.subtitle}
              </p>
            </div>

             <div className="flex flex-col md:flex-row gap-4 w-full">
              <Link href="/order" className="w-full">
                <Button
                  className="min-w-full">
                  <span>{t("ctaText")}</span>
                  <ArrowRightIcon className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
              <Link href="tel:+1234567890" className="w-full">
                <Button
                  variant="outline"
                  className="min-w-full">
                  {t("contactText")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-fade-in-scale">
            {normalizedImages.length > 0 ? (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-70" />
                <Carousel
                  className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px]"
                  opts={{ align: "start", loop: true }}
                  aria-label="Hero images carousel"
                >
                  <CarouselContent>
                    {normalizedImages.map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px] 
                          overflow-hidden rounded-xl border border-primary/10 group">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.caption || `Hero image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                          />
                          {item.caption && (
                            <div className="absolute bottom-0 w-full p-3 sm:p-4 pt-6 sm:pt-8 text-start backdrop-blur-sm transform 
                              translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              <p className="font-medium text-sm sm:text-base">
                                {item.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="mt-4 sm:mt-5 flex justify-center gap-2">
                  {normalizedImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === 0 ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px] 
                flex items-center justify-center bg-muted rounded-xl border border-border">
                <p className="text-muted-foreground text-center text-sm sm:text-base">
                  No images available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
