"use client"

import Link from "next/link"
import GithubIcon from "../ui/github-icon"

import { Button } from "../ui/button"
import { useTheme } from "next-themes"
import { ExternalLink, Hospital, Moon, Sun } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function HeaderLandingPage() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="w-full px-6">
        <div className="flex h-14 items-center">
          <Button size={"icon"} variant={"ghost"} className="size-10" asChild>
            <Link href={"/"}>
              <Hospital className="size-6" />
              <span className="sr-only">Moncip HIS-Simulator</span>
            </Link>
          </Button>
          <NavigationMenu className="mx-auto">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link
                    className="flex items-center py-5 !text-sm"
                    href="https://github.com/fmukhlis/moncip-lis"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="!size-4" />
                    <span className="sr-only whitespace-nowrap sm:not-sr-only">Moncip LIS</span>
                    <ExternalLink className="hidden size-3 sm:block" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link
                    className="flex items-center py-5 !text-sm"
                    href="https://github.com/fmukhlis/moncip-his-simulator"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="!size-4" />
                    <span className="sr-only whitespace-nowrap sm:not-sr-only">Moncip HIS-Simulator</span>
                    <ExternalLink className="hidden size-3 sm:block" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            className=""
            variant={"ghost"}
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark")
            }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
