"use client"

import Link from "next/link"
import React from "react"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

export default function AppBreadcrumb({
  breadcrumbData,
}: {
  breadcrumbData: {
    [k: string]: {
      url: string
      title: string
    }[]
  }
}) {
  const pathname = usePathname()

  const crumbs = breadcrumbData[pathname] ?? []

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
