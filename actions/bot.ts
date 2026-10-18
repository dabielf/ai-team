"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { bots, insertBotSchema, type InsertBot } from "@/lib/db/schema"

export async function createBot(input: InsertBot) {
  const { userId } = await auth.protect()

  const parsed = insertBotSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Some fields are invalid." }
  }

  const [bot] = await db
    .insert(bots)
    .values({ ...parsed.data, userId })
    .returning({ id: bots.id })

  revalidatePath("/")
  return { id: bot.id }
}
