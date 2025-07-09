import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SpecialOffer() {
  // This would come from a CMS or API
  const offerData = {
    title: "Special Offer",
    description:
      "Dynamic description of the special offer that is currently available. This would be loaded from a CMS or API.",
    imageAlt: "Special offer image",
    ctaText: "Learn More",
  };

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex justify-center">
            <Card className="overflow-hidden">
              <div className="relative h-[300px] w-[400px]">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt={offerData.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {offerData.title}
              </h2>
              <p className="text-muted-foreground md:text-xl">
                {offerData.description}
              </p>
            </div>
            <div>
              <Button size="lg">{offerData.ctaText}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
