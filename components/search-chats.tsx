"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import type { getChats } from "@/queries/bots"

type Chat = Awaited<ReturnType<typeof getChats>>[number]

export function SearchChats({ chats }: { chats: Chat[] }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  // Cmd+K (macOS) or Ctrl+K toggles the dialog.
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      {/* Looks like an Input (its classes), keeps the ghost button hover. */}
      <Button
        variant="ghost"
        className="w-full justify-start border-input bg-transparent px-2.5 font-normal text-muted-foreground group-data-[collapsible=icon]:hidden dark:bg-input/30"
        onClick={() => setOpen(true)}
      >
        <SearchIcon data-icon="inline-start" />
        Search
        <KbdGroup className="ml-auto">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      {/* Collapsed sidebar: same ghost icon button as "New". */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden group-data-[collapsible=icon]:flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="sr-only">Search</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search chats"
        description="Search your chats by name."
      >
        <Command>
          <CommandInput placeholder="Search chats..." />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup heading="Chats">
              {chats.map((chat) => {
                const name = chat.name ?? chat.bot?.name ?? ""
                return (
                  <CommandItem
                    key={chat.id}
                    value={`${name} ${chat.id}`}
                    onSelect={() => {
                      setOpen(false)
                      router.push(`/chats/${chat.id}`)
                    }}
                  >
                    <ChatAvatar
                      seed={chat.bot?.avatar ?? chat.id}
                      className="size-6"
                    />
                    <span className="truncate">{name}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
