"use client";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AuthButtons } from "./auth-buttons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function MobileNavbar({
  links,
}: {
  links: { href: string; title: string; icon: React.ReactNode }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg hover:bg-accent/80 transition-colors duration-200"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] border-l border-border/40 py-6"
        >
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-6 py-4">
              <ul className="space-y-2">
                {links.map(({ href, title, icon }) => (
                  <li key={title}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-accent/80 hover:text-accent-foreground hover:translate-x-1",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                        "text-sm font-medium w-full text-left",
                      )}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        {icon}
                      </span>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-6 pt-4 border-t border-border/40 w-full mt-auto">
              <AuthButtons className="flex flex-col space-y-2" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
