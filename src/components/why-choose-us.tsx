import Image from "next/image";
import { CheckCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchStatic } from "@/api/server-hooks/api";

const schema = z.strictObject({
  label: z.string().min(1),
  content: z.object({
    image: z.string().url().nullable(),
    paragraphs: z.array(z.string().min(1)),
  }),
});

const WhyChooseUsSchema = z.array(schema);

export async function WhyChooseUs() {
  const locale = await getLocale();
  const t = await getTranslations("whyChooseUs");
  const data = await fetchStatic("/why-choose-us", WhyChooseUsSchema, {
    tags: ["why-choose-us"],
  });

  const tabsData = data.map((item, index) => {
    return {
      label: item.label,
      number: index + 1,
      content: {
        image: item.content.image,
        title: item.label,
        points: item.content.paragraphs,
      },
    };
  });

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <Tabs
          dir={locale === "ar" ? "rtl" : "ltr"}
          defaultValue={tabsData[0]?.label || "tab-0"}
          className="w-full"
        >
          <div className="relative">
            <div className="overflow-x-auto w-full pb-4 mb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              <TabsList className="flex gap-4  h-auto p-1 bg-transparent">
                {tabsData.map((tab) => (
                  <TabsTrigger
                    key={tab.label}
                    value={tab.label}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "transition-all duration-200 ease-in-out border-muted",
                      "flex-1 sm:flex-initial whitespace-nowrap",
                    )}
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-primary font-semibold text-sm">
                      {tab.number}
                    </span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className="">
            {tabsData.map((tab) => (
              <TabsContent key={tab.label} value={tab.label} className="mt-0">
                <Card className="border-none shadow-lg bg-primary/5 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 flex flex-col items-center p-6 space-y-4 text-left">
                        <ul className="space-y-4 w-full">
                          {tab.content.points.map((point, index) => (
                            <li
                              key={index}
                              className="flex rtl:text-right gap-3"
                            >
                              <CheckCircle className="text-primary mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground break-words">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative h-48 sm:h-64 w-full max-w-md">
                        {tab.content.image ? (
                          <Image
                            src={tab.content.image}
                            alt={tab.content.title}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            {locale === "ar"
                              ? "لا توجد صورة"
                              : "No image available"}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
