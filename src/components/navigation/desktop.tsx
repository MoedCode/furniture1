"use client"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function DesktopNavbar({
  links,
}: {
  links: { title: string; href: string; icon?: React.ReactNode }[];
}) {
  return (
    <NavigationMenu className="hidden md:flex md:rtl:flex-row-reverse">
      <NavigationMenuList className="gap-x-2 md:flex md:rtl:flex-row-reverse">
        {links.map(({ href, title, icon }) => (
          <NavigationMenuItem key={title}>
            <NavigationMenuLink
              asChild
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-lg",
                "px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:text-accent-foreground hover:scale-105",
                "disabled:pointer-events-none disabled:opacity-50",
                "relative before:absolute before:inset-x-0 before:-bottom-1 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300",
                "hover:before:scale-x-100"
              )}
            >
              <Link href={href} className="flex flex-row rtl:flex-row-reverse w-full items-center gap-2">
                {icon && <span className="w-4 h-4">{icon}</span>}
                {title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
