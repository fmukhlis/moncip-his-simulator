import { Fragment } from "react"
import { DataProps } from "@/lib/navigation-data"
import { SideNavItem, CollapsibleSideNavItem } from "./side-nav-item"
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"

export function SideNav({ data, label }: { data: DataProps[]; label?: string }) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {data.map(({ icon, title, url, items }) => (
          <Fragment key={url}>
            {items ? (
              <CollapsibleSideNavItem {...{ icon, title, url, items }} />
            ) : (
              <SideNavItem {...{ icon, title, url }} />
            )}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
