import { fetchStatic } from "@/api/server-hooks/api";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { z } from "zod";
import { Button } from "./ui/button";
import { Section, SectionHeader, SectionTitle } from "./section";
import { Link } from "@/i18n/navigation";

const ServiceSchema = z.strictObject({
  id: z.string().min(1),
  paragraph: z.string().min(1),
  image: z.string().min(1),
});
export const Services = z.array(ServiceSchema);

export async function ServicesShowcase() {
  const data = await fetchStatic("/blogs", Services, { tags: ["blogs"] });
  const t = await getTranslations("servicesShowcase");

  return (
    <Section className="w-full py-8 md:py-16 lg:py-24" id="services">
      <SectionHeader>
        <SectionTitle>{t("title")}</SectionTitle>
      </SectionHeader>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {data.map((service) => (
            <Link key={service.id} href={`/blog/${service.id}`}>
              <Card
                className="overflow-hidden flex flex-col shadow-lg h-full transition-all duration-200 hover:shadow-xl py-0"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.paragraph}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={false}
                  />
                </div>

                <CardContent className="flex flex-col gap-2 justify-between flex-1 p-2">
                  <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                    {service.paragraph}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto mt-auto"
                  >
                    {t("read-more")}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
