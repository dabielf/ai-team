"use client"

import { UserButton } from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "w-full",
                  userButtonTrigger: cn(
                    sidebarMenuButtonVariants({ size: "lg" }),
                    "justify-start"
                  ),
                  userButtonBox: "flex-row-reverse gap-3",
                  userButtonAvatarBox: "size-6",
                  userButtonOuterIdentifier: "truncate p-0 text-sm",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
