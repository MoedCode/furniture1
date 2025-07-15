import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { fetchStatic } from "@/api/server-hooks/api";
import { SaudiRiyal } from "lucide-react";
import { packagesSchemas } from "@/schemas/package";


export async function PricingTable() {
  const data = await fetchStatic("/packages", packagesSchemas, { tags: ["packages"] });
  const t = await getTranslations("pricingTable");
  const features = data[0]?.features.map((f) => f.name) || [];
  return (
    <section className="w-full bg-background" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] rtl:text-right ltr:text-left">
                  {t("features_plans")}
                </TableHead>
                {data.map((plan) => (
                  <TableHead key={plan.name} className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <span>{plan.name}</span>
                      <Button variant="outline" className="w-full">
                        {t("ctaText")}
                      </Button>
                      <span className="text-xl font-bold inline-flex items-center">
                        {plan.price}
                        <SaudiRiyal />
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((featureName, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium p-4">
                    {featureName}
                  </TableCell>
                  {data.map((plan, planIndex) => (
                    <TableCell
                      key={`${planIndex}-${index}`}
                      className="text-center"
                    >
                      {plan.features[index]?.included ? (
                        <Check className="h-5 w-5 mx-auto text-background bg-primary/60 rounded-full" />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
