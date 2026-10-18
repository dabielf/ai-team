import Image from "next/image"
import { Avatar, Style } from "@dicebear/core"
import gaze from "@dicebear/styles/gaze.json"

import { cn } from "@/lib/utils"

const style = new Style(gaze)

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: {
  seed: string
  animated?: boolean
  className?: string
}) {
  const src = new Avatar(style, {
    seed,
    tags: [animated ? "animation" : "!animation"],
  }).toDataUri()

  return (
    <Image
      src={src}
      alt=""
      width={32}
      height={32}
      unoptimized
      className={cn("size-8 shrink-0 rounded-full", className)}
    />
  )
}
