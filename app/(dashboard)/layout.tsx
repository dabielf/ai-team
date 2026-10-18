import { cookies } from "next/headers"

import { AppSidebar } from "@/components/app-sidebar"
import { NavChats } from "@/components/nav-chats"
import { NavSearch } from "@/components/nav-search"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The sidebar writes this cookie on every toggle (see SidebarProvider).
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar search={<NavSearch />}>
        <NavChats />
      </AppSidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
