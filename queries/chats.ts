import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { and, asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chatMembers, chats } from "@/lib/db/schema"

// One of the signed-in user's chats with its first bot, or undefined when the
// chat doesn't exist or belongs to someone else.
export const getChat = cache(async (chatId: string) => {
  const { userId } = await auth.protect()

  const row = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, userId)),
    with: {
      members: {
        orderBy: asc(chatMembers.joinedAt),
        limit: 1,
        with: {
          bot: {
            columns: {
              id: true,
              name: true,
              avatar: true,
              job: true,
              instructions: true,
            },
          },
        },
      },
    },
  })
  if (!row) return undefined

  const { members, ...chat } = row
  // Group chats aren't handled yet: show the first bot.
  return { ...chat, bot: members[0]?.bot }
})
