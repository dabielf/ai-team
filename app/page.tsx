import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { PlusIcon } from "lucide-react"

import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default async function Page() {
  await auth.protect()

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <header className="flex items-center justify-end gap-2">
        <UserButton />
      </header>
      <Empty>
        <EmptyHeader>
          <ChatAvatar seed={crypto.randomUUID()} />
          <EmptyTitle>Meet your first bot</EmptyTitle>
          <EmptyDescription>
            Every bot gets its own personality, memory, and face. Spin one up
            and start the conversation.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="secondary">
            <PlusIcon data-icon="inline-start" />
            Create a new bot
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
