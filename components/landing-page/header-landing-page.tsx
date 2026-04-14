"use client"

import { ExternalLink, Hospital } from "lucide-react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import ThemeToggler from "../theme-toggler"
import { Button } from "../ui/button"
import GithubIcon from "../ui/github-icon"

export function HeaderLandingPage() {
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
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}
