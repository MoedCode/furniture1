import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import Logo from "./logo";
import DesktopNavbar from "./navigation/desktop";
import MobileNavbar from "./navigation/mobile";
import { AuthButtons } from "./navigation/auth-buttons";
import { ContactIcon, Home, LucideFileQuestion } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Navbar() {
  const t = await getTranslations("navbar");
  // const [isScrolled, setIsScrolled] = useState(false);
  //
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 0);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const navItems = [
    { title: t("home"), href: "/", icon: <Home className="w-4 h-4" /> },
    { title: t("about"), href: "/#faq", icon: <LucideFileQuestion className="w-4 h-4" />},
    { title: t("contact"), href: "/#contact", icon: <ContactIcon className="w-4 h-4" />},
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-center w-full transition-all duration-300 ease-in-out px-6 md:px-0",
        "bg-background/80 backdrop-blur-md border-b border-border/40",
        // isScrolled && "bg-background/95 shadow-sm border-border/80"
      )}
    >
      <div className="container flex h-16 md:h-18 items-center justify-between">
        <div className="flex items-center lg:gap-8">
          <Logo />
          <DesktopNavbar links={navItems} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="hidden md:block">
            <AuthButtons />
          </div>
          <LanguageSwitcher />
          <MobileNavbar links={navItems}/>
        </div>
      </div>
    </header>
  );
}
