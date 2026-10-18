import { nanoid } from "nanoid"
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const bots = pgTable(
  "bots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    // Clerk user ID of the owner.
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    // Seed for the bot's generated face.
    avatar: text("avatar")
      .notNull()
      .$defaultFn(() => nanoid()),
    // What the bot is for, in a phrase.
    job: text("job").notNull(),
    // How it should go about the job.
    instructions: text("instructions"),
    // Third-party sandbox ID, created lazily.
    sandboxId: text("sandbox_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("bots_user_id_idx").on(table.userId)]
)

// What a user sends to create a bot. userId comes from the session, not the client.
export const insertBotSchema = createInsertSchema(bots, {
  name: (schema) => schema.trim().min(1, "Give your bot a name.").max(60),
  avatar: (schema) => schema.min(1),
  job: (schema) => schema.trim().min(1, "Say what the bot is for.").max(120),
  instructions: z.string().trim().max(4000).optional(),
}).pick({ name: true, avatar: true, job: true, instructions: true })

export type InsertBot = z.infer<typeof insertBotSchema>
