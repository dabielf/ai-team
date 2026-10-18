"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import {
  bots,
  chatMembers,
  chats,
  insertBotSchema,
  type InsertBot,
} from "@/lib/db/schema"

export async function createBot(input: InsertBot) {
  const { userId } = await auth.protect()

  const parsed = insertBotSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Some fields are invalid." }
  }

  // A new bot comes with its direct chat; all three rows land or none do.
  const bot = await db.transaction(async (tx) => {
    const [bot] = await tx
      .insert(bots)
      .values({ ...parsed.data, userId })
      .returning({ id: bots.id })

    const [chat] = await tx
      .insert(chats)
      .values({ userId, kind: "direct" })
      .returning({ id: chats.id })

    await tx.insert(chatMembers).values({ chatId: chat.id, botId: bot.id })

    return bot
  })

  revalidatePath("/")
  return { id: bot.id }
}

export async function updateBot(id: string, input: InsertBot) {
  const { userId } = await auth.protect()

  const parsed = insertBotSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Some fields are invalid." }
  }

  const [bot] = await db
    .update(bots)
    .set(parsed.data)
    .where(and(eq(bots.id, id), eq(bots.userId, userId)))
    .returning({ id: bots.id })
  if (!bot) {
    return { error: "Bot not found." }
  }

  // The name and face show in the sidebar and every chat header.
  revalidatePath("/", "layout")
  return { id: bot.id }
}

export async function deleteBot(id: string) {
  const { userId } = await auth.protect()

  // Its direct chats go with it; group chats only lose it as a member.
  const bot = await db.transaction(async (tx) => {
    const direct = await tx
      .select({ id: chats.id })
      .from(chats)
      .innerJoin(chatMembers, eq(chatMembers.chatId, chats.id))
      .where(
        and(
          eq(chatMembers.botId, id),
          eq(chats.kind, "direct"),
          eq(chats.userId, userId)
        )
      )

    const [bot] = await tx
      .delete(bots)
      .where(and(eq(bots.id, id), eq(bots.userId, userId)))
      .returning({ id: bots.id })
    if (!bot) return undefined

    if (direct.length > 0) {
      await tx.delete(chats).where(
        inArray(
          chats.id,
          direct.map((chat) => chat.id)
        )
      )
    }
    return bot
  })
  if (!bot) {
    return { error: "Bot not found." }
  }

  // The chat being viewed is gone.
  revalidatePath("/", "layout")
  redirect("/")
}
