import { MonitorIcon } from "lucide-react"

import { BotDialog } from "@/components/bot-dialog"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"

type Bot = {
  id: string
  name: string
  avatar: string
  job: string
  instructions: string | null
}

export function ChatHeader({
  name,
  avatar,
  bot,
}: {
  name: string
  avatar: string
  bot?: Bot
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      {bot ? (
        <h1 className="min-w-0 text-sm font-medium">
          {/* Keyed so another chat's bot starts the form fresh. */}
          <BotDialog
            key={bot.id}
            bot={{ ...bot, instructions: bot.instructions ?? "" }}
          >
            <ChatAvatar seed={avatar} className="size-5" />
            <span className="truncate">{name}</span>
          </BotDialog>
        </h1>
      ) : (
        <>
          <ChatAvatar seed={avatar} className="size-5" />
          <h1 className="truncate text-sm font-medium">{name}</h1>
        </>
      )}
      {/* No action yet. */}
      <Button variant="ghost" size="icon-sm" className="ml-auto">
        <MonitorIcon />
        <span className="sr-only">Desktop</span>
      </Button>
    </header>
  )
}
