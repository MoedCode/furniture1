import { Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
          <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full bg-muted opacity-50" />
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-background shadow-lg">
              <Truck className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="absolute -left-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-lg font-bold text-destructive-foreground shadow-lg">
              404
            </div>
          </div>

          <h1 className="mb-4 font-heading bg-gradient-to-r leading-[1.3] from-foreground to-muted-foreground bg-clip-text text-center text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl md:text-4xl">
            الصفحة غير موجودة
          </h1>

          <div className="mb-8 max-w-md text-center text-muted-foreground">
            <p>
              عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون
              أُزيلت أو تم تغيير رابطها أو أنها غير متاحة مؤقتًا.
            </p>
          </div>

          <Button size="lg" className="animate-bounce shadow-md" asChild>
            <Link href="/">
              <Truck className="ml-2 h-5 w-5" />
              الرجوع إلى الصفحة الرئيسية
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
};

export default NotFoundPage;

