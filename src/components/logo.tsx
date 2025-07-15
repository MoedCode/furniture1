import { fetchStatic } from "@/api/server-hooks/api";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { z } from "zod";
const logoSchema = z.object({
  url: z.string().url(),
});

type LogoData = z.infer<typeof logoSchema>;

export default async function Logo() {
  const data = await fetchStatic("/logo", logoSchema, { tags: ["logo"] });
  return (
    <Link href="/" className="font-bold text-xl">
      {/* Logo would be dynamically loaded */}
      <span className="sr-only">Company Logo</span>
      <div className="relative w-10 h-8">
        <Image
          src={data.url}
          alt="Company Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
