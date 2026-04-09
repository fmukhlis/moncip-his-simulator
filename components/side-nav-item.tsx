"use client"

import Link from "next/link"
import React from "react"

import { DataProps } from "@/lib/navigation-data"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./ui/sidebar"

export function SideNavItem({ url, icon, title }: Omit<DataProps, "items">) {
  const pathname = usePathname()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={pathname === url || pathname.startsWith(`${url}/`)} tooltip={title} asChild>
        <Link href={url}>
          {icon}
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SideNavSubItem({ url, title }: NonNullable<DataProps["items"]>[number]) {
  const pathname = usePathname()

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={pathname === url || pathname.startsWith(`${url}/`)} asChild>
        <Link href={url}>
          <span>{title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function CollapsibleSideNavItem({ url, icon, title, items }: Required<DataProps>) {
  const pathname = usePathname()

  return (
    <Collapsible
      asChild
      defaultOpen={(pathname === url || pathname.startsWith(`${url}/`)) ?? false}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={pathname === url || pathname.startsWith(`${url}/`)} tooltip={title}>
            {icon}
            <span>{title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((props) => (
              <SideNavSubItem key={props.url} {...props} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
