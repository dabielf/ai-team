"use client"

import { useChat } from "@ai-sdk/react"
import type { TriggerChatTransport } from "@trigger.dev/sdk/chat"
import {
  useLoadTranscript,
  useTriggerChatTransport,
} from "@trigger.dev/sdk/chat/react"
import type { UIMessage } from "ai"
import { useState } from "react"

import {
  loadTranscript,
  mintChatAccessToken,
  startChatSession,
} from "@/actions/chat"
import type { chatAgent } from "@/trigger/chat"

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
  const transport = useTriggerChatTransport<typeof chatAgent>({
    task: "chat",
    accessToken: ({ chatId }) => mintChatAccessToken(chatId),
    startSession: ({ chatId, clientData }) =>
      startChatSession({ chatId, clientData }),
  })
  const { messages, isLoading } = useLoadTranscript(id, loadTranscript, {
    transport,
  })

  // useChat reads its initial messages once, so mount it after the load.
  if (isLoading) return null
  return (
    <ChatView
      key={id}
      id={id}
      initialMessages={messages}
      transport={transport}
    />
  )
}

function ChatView({
  id,
  initialMessages,
  transport,
}: {
  id: string
  initialMessages: UIMessage[]
  transport: TriggerChatTransport
}) {
  const [input, setInput] = useState("")
  const {
    messages,
    sendMessage,
    status,
    stop: stopLocal,
  } = useChat({
    id,
    messages: initialMessages,
    transport,
    // Reconnect to an answer still streaming when the page loaded.
    resume: initialMessages.length > 0,
  })

  // useChat's stop doesn't reach the agent after a resume.
  const stop = () => {
    stopLocal()
    transport.stopGeneration(id)
  }

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
