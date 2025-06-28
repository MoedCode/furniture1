import * as React from "react";
import { cn } from "@/lib/utils";

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("w-full flex flex-col", className)}
    {...props}
  />
));
Section.displayName = "Section";

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "rtl:text-3xl ltr:text-2xl tracking-tighter sm:text-4xl md:text-5xl font-black rtl:leading-tight font-heading text-foreground text-center",
      className,
    )}
    {...props}
  />
));
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-lg font-body text-muted-foreground max-w-3xl text-center",
      className,
    )}
    {...props}
  />
));
SectionDescription.displayName = "SectionDescription";

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center gap-2 mb-8",
      className,
    )}
    {...props}
  />
));
SectionHeader.displayName = "SectionHeader";

const SectionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center pt-0 mt-4", className)}
    {...props}
  />
));
SectionFooter.displayName = "SectionFooter";

export {
  Section,
  SectionTitle,
  SectionDescription,
  SectionHeader,
  SectionFooter,
};
