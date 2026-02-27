"use client"

import Link from "next/link"
import React from "react"

import { usePathname } from "next/navigation"
import { BREADCRUMB_DATA } from "@/lib/navigation-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

export default function AppBreadcrumb() {
  const pathname = usePathname()

  const crumbs = BREADCRUMB_DATA[pathname] ?? []

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ title, url }, index) => {
          const isLast = index === crumbs.length - 1
          return isLast ? (
            <BreadcrumbItem key={title} className="hidden md:block">
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <React.Fragment key={title}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href={url ?? ""}>{title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
