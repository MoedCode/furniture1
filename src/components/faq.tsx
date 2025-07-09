import { fetchStatic } from "@/api/server-hooks/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

const faqSchema = z.object({
  details: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

export async function Faq() {
  const t = await getTranslations("faq");
  const data = await fetchStatic("/common-questions", faqSchema, {
    tags: ["faq"],
  });

  return (
    <section className="w-full py-12 md:py-24 bg-background" id="faq">
      <div className="container px-4 md:px-6">
        <div
          className={
            "flex flex-col items-center justify-center space-y-4 text-center mb-10"
          }
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {data.details.map(({ question, answer }, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
