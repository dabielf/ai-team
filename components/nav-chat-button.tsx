"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { SidebarMenuButton } from "@/components/ui/sidebar"

// Client island of NavChats: reads the URL to highlight the open chat.
export function NavChatButton({
  chatId,
  tooltip,
  children,
}: {
  chatId: string
  tooltip?: string
  children: React.ReactNode
}) {
  const params = useParams<{ chatId?: string }>()

  return (
    <SidebarMenuButton
      size="lg"
      tooltip={tooltip}
      isActive={params.chatId === chatId}
      render={<Link href={`/chats/${chatId}`} />}
    >
      {children}
    </SidebarMenuButton>
  )
}
