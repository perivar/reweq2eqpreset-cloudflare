import { useState } from "react";
import { Link } from "@remix-run/react";
import { Command, Menu, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Theme, useTheme } from "remix-themes";

import useIsMounted from "~/hooks/useIsMounted";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function ResponsiveNavBar() {
  const [theme, setTheme] = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useIsMounted();

  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  const navBrand = t("title");

  const navItems = [
    {
      title: "Features",
      items: [
        {
          title: "Analytics",
          to: "#analytics",
          description: "View detailed analytics",
        },
        {
          title: "Security",
          to: "#security",
          description: "Keep your data safe",
        },
        {
          title: "Automation",
          to: "#automation",
          description: "Automate your workflow",
        },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Blog", to: "#blog", description: "Read our latest news" },
        {
          title: "Documentation",
          to: "#docs",
          description: "Learn how to use our product",
        },
        { title: "Help Center", to: "#help", description: "Get support" },
      ],
    },
    { title: "Pricing", to: "#pricing" },
    { title: "About", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="hidden md:flex">
          <Link to="/" className="mr-4 flex items-center space-x-2">
            <Command className="size-5" />
            <span className="font-bold">{navBrand}</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex} className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link to={subItem.to}>
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    {subItem.title}
                                  </div>
                                  <p className="text-sm leading-tight text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link to={item.to}>
                        <div className={navigationMenuTriggerStyle()}>
                          {item.title}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <Link to="/">
              <span className="font-bold">{navBrand}</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item, index) =>
                  item.items ? (
                    <div key={index} className="flex flex-col space-y-3">
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} to={subItem.to}>
                          <span className="ml-4">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link key={index} to={item.to}>
                      <h4 className="font-semibold">{item.title}</h4>
                    </Link>
                  )
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="ml-auto">
              {isMounted() &&
                (theme === "dark" ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                ))}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
