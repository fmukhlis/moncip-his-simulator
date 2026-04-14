import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { DataProps } from "@/lib/navigation-data"
import { NavUser } from "./nav-user"
import PatientCardSidebar from "./patient-card-sidebar"

import { PatientSidebarHeader } from "./patient-sidebar-header"
import { SideNav } from "./side-nav"

export function PatientContextSidebar({
  DATA,
  ...props
}: React.ComponentProps<typeof Sidebar> & { DATA: Record<"patientWorkspace", DataProps[]> }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PatientSidebarHeader />
        <PatientCardSidebar />
      </SidebarHeader>
      <SidebarContent>
        <SideNav data={DATA.patientWorkspace} label="Patient Workspace" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
