import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AppDownload() {
  // This would come from a CMS or API
  const appData = {
    title: "Download Our App",
    description: "Get our services on the go with our mobile application",
    qrCodeAlt: "QR Code",
    appStoreText: "App Store",
    playStoreText: "Google Play",
    phoneImageAlt: "Mobile app screenshot",
  };

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative h-[500px] w-[250px]">
              <Image
                src="/placeholder.svg?height=500&width=250"
                alt={appData.phoneImageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {appData.title}
              </h2>
              <p className="text-muted-foreground md:text-xl">
                {appData.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex items-center gap-2" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                  <path d="M10 2c1 .5 2 2 2 5" />
                </svg>
                {appData.appStoreText}
              </Button>
              <Button className="flex items-center gap-2" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polygon points="3 2 3 22 21 12 3 2" />
                </svg>
                {appData.playStoreText}
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative h-[100px] w-[100px]">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt={appData.qrCodeAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
