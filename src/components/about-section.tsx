import { getTranslations } from "next-intl/server";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "./section";

export async function AboutSection({description}: {description: string}) {
  const t = await getTranslations("aboutUs");

  return (
    <Section className="w-full py-12 md:py-24 bg-background" id="about">
      <SectionHeader>
        <SectionTitle>{t("title")}</SectionTitle>
        <SectionDescription className="px-2">{description}</SectionDescription>
      </SectionHeader>
    </Section>
  );
}
