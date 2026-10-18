"use client"

import * as React from "react"
import { UserButton } from "@clerk/nextjs"
import { PlusIcon, UsersIcon } from "lucide-react"

import { BotDialog } from "@/components/bot-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// children: the sidebar content, rendered on the server (see NavChats).
// search: the search button, rendered on the server (see NavSearch).
export function AppSidebar({
  search,
  children,
}: {
  search?: React.ReactNode
  children?: React.ReactNode
}) {
  const [botDialogOpen, setBotDialogOpen] = React.useState(false)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="items-end">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" />}
              >
                <PlusIcon />
                <span className="sr-only">New</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setBotDialogOpen(true)}>
                    <PlusIcon />
                    Create new bot
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UsersIcon />
                    Create group chat
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <BotDialog open={botDialogOpen} onOpenChange={setBotDialogOpen} />
          </SidebarMenuItem>
        </SidebarMenu>
        {search}
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
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
                    "justify-start group-data-[collapsible=icon]:justify-center"
                  ),
                  userButtonBox: "flex-row-reverse gap-3",
                  userButtonAvatarBox: "size-6",
                  userButtonOuterIdentifier:
                    "truncate p-0 text-sm group-data-[collapsible=icon]:hidden",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
