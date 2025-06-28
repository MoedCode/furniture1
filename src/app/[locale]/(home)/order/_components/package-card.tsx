import type { PackageType } from "@/hooks/use-packages";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SaudiRiyal } from "lucide-react";

type Props = {
  pkg: PackageType;
  selected: boolean;
  onSelect: () => void;
  t: (key: string) => string;
};

export default function PackageCard({ pkg, selected, onSelect, t }: Props) {
  return (
    <Accordion type="single" data-name={pkg.id} collapsible onClick={onSelect}>
      <AccordionItem
        value="features"
        className={cn(
          "relative p-4 rounded-lg cursor-pointer !border transition-all",
          selected
            ? "border-primary bg-primary/5"
            : "hover:border-muted-foreground",
        )}
      >
        <AccordionTrigger className="gap-1">
          <h2 className="text-lg font-semibold">{pkg.name}</h2>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            {pkg.price}
            <SaudiRiyal size={15} />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="text-sm text-muted-foreground space-y-1">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full",
                    feature.included ? "bg-green-500" : "bg-gray-300",
                  )}
                />
                <span
                  className={cn(
                    feature.included
                      ? "text-foreground"
                      : "text-muted-foreground line-through",
                  )}
                >
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
