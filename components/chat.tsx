"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"

export function Chat({ id }: { id: string }) {
  const [input, setInput] = useState("")
  // Keyed by chat id so each chat keeps its own in-memory messages.
  const { messages, sendMessage, status, stop } = useChat({ id })

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return
    sendMessage({ text: message.text })
    setInput("")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation>
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <MessageResponse key={`${message.id}-${i}`}>
                      {part.text}
                    </MessageResponse>
                  ) : null
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              placeholder="Say something..."
              onChange={(e) => setInput(e.currentTarget.value)}
            />
          </PromptInputBody>
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={!input.trim() && status === "ready"}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
