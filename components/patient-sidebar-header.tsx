import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function PatientSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pl-0" asChild>
          <Link href={"/auth/search-patients"} className="flex items-center !gap-0">
            <div className="text-sidebar-foreground flex aspect-square size-8 items-center justify-center">
              <ArrowLeft />
            </div>
            <div className="mb-0.5 grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Search Patients</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
