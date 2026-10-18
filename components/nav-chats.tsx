import Link from "next/link"
import { formatDistanceToNowStrict } from "date-fns"

import { ChatAvatar } from "@/components/chat-avatar"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getChats } from "@/queries/bots"

export async function NavChats() {
  const chats = await getChats()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                size="lg"
                tooltip={chat.name ?? chat.bot?.name}
                render={<Link href={`/chats/${chat.id}`} />}
              >
                <ChatAvatar seed={chat.bot?.avatar ?? chat.id} />
                <div className="grid flex-1 text-left leading-tight">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium">
                      {chat.name ?? chat.bot?.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNowStrict(chat.lastMessageAt)}
                    </span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {chat.lastMessagePreview}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
