import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { chatMembers, chats } from "@/lib/db/schema"

// The signed-in user's chats, latest activity first, each with its first bot.
// cache: the sidebar list and the search dialog share one query per request.
export const getChats = cache(async () => {
  const { userId } = await auth.protect()

  const rows = await db.query.chats.findMany({
    where: eq(chats.userId, userId),
    orderBy: desc(chats.lastMessageAt),
    with: {
      members: {
        orderBy: asc(chatMembers.joinedAt),
        limit: 1,
        with: {
          bot: { columns: { id: true, name: true, avatar: true } },
        },
      },
    },
  })

  return rows.map(({ members, ...chat }) => ({
    ...chat,
    // Group chats aren't handled yet: show the first bot.
    bot: members[0]?.bot,
  }))
})
