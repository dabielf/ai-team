import { SearchChats } from "@/components/search-chats"
import { getChats } from "@/queries/bots"

export async function NavSearch() {
  const chats = await getChats()

  return <SearchChats chats={chats} />
}
