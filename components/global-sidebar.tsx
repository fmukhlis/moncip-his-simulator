import { NavUser } from "@/components/nav-user"
import { SidebarLogo } from "@/components/sidebar-logo"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { DATA } from "@/lib/navigation-data"
import { SideNav } from "./side-nav"

export function GlobalSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SideNav data={DATA.main} />
        <SideNav data={DATA.operations} label="Operations" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
