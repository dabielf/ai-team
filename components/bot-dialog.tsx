"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon, Trash2Icon } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { createBot, deleteBot, updateBot } from "@/actions/bot"
import { ChatAvatar } from "@/components/chat-avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { insertBotSchema, type InsertBot } from "@/lib/db/schema"

// Starting points that fill in the job and instructions.
const presets = [
  {
    job: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    job: "Code reviewer",
    instructions:
      "Point out bugs first, then readability. Suggest concrete fixes.",
  },
  {
    job: "Writing editor",
    instructions:
      "Tighten prose, keep my voice, and explain each change in one line.",
  },
  {
    job: "Tutor",
    instructions:
      "Teach step by step, check my understanding, and don't give answers away.",
  },
]

function emptyBot(): InsertBot {
  return { name: "", avatar: crypto.randomUUID(), job: "", instructions: "" }
}

// Pass open/onOpenChange to control it from elsewhere (no trigger rendered).
// Pass bot to edit it; children then become the trigger's content.
export function BotDialog(props: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  bot?: InsertBot & { id: string }
  children?: React.ReactNode
}) {
  const { bot } = props
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const controlled = props.open !== undefined
  const open = controlled ? props.open : uncontrolledOpen
  const setOpen = props.onOpenChange ?? setUncontrolledOpen
  const form = useForm<InsertBot>({
    resolver: zodResolver(insertBotSchema),
    defaultValues: bot ?? emptyBot(),
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })

  async function onSubmit(data: InsertBot) {
    const result = bot ? await updateBot(bot.id, data) : await createBot(data)
    if ("error" in result) {
      toast.add({
        title: bot ? "Couldn't save bot" : "Couldn't create bot",
        description: result.error,
      })
      return
    }
    toast.add({
      title: bot ? `${data.name} is saved` : `${data.name} is ready`,
    })
    setOpen(false)
    form.reset(bot ? data : emptyBot())
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled &&
        (bot ? (
          <DialogTrigger render={<Button variant="ghost" />}>
            {props.children}
          </DialogTrigger>
        ) : (
          <DialogTrigger render={<Button variant="secondary" />}>
            <PlusIcon data-icon="inline-start" />
            Create a new bot
          </DialogTrigger>
        ))}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{bot ? "Edit bot" : "New bot"}</DialogTitle>
          <DialogDescription>
            {bot
              ? "Change its face, name, or job."
              : "Give it a face, a name, and a job to do."}
          </DialogDescription>
        </DialogHeader>
        <form id="bot-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {!bot && (
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.job}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      form.setValue("job", preset.job, { shouldValidate: true })
                      form.setValue("instructions", preset.instructions)
                    }}
                  >
                    {preset.job}
                  </Button>
                ))}
              </div>
            )}
            <Field orientation="horizontal">
              <ChatAvatar seed={avatar} className="size-12 rounded-none" />
              <FieldContent>
                <FieldTitle>Face</FieldTitle>
                <FieldDescription>
                  Shuffle until you find one you like.
                </FieldDescription>
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue("avatar", crypto.randomUUID())}
              >
                <ShuffleIcon data-icon="inline-start" />
                Shuffle
              </Button>
            </Field>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bot-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="bot-name"
                    placeholder="Ada"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="job"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bot-job">Job</FieldLabel>
                  <Input
                    {...field}
                    id="bot-job"
                    placeholder="Research assistant"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="instructions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bot-instructions">
                    How it should work
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="bot-instructions"
                    placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          {bot && <DeleteBotButton bot={bot} />}
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            type="submit"
            form="bot-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Spinner data-icon="inline-start" />
            )}
            {bot ? "Save changes" : "Create bot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Asks first; on success the server action redirects home.
function DeleteBotButton({ bot }: { bot: InsertBot & { id: string } }) {
  const [isPending, startTransition] = React.useTransition()

  function onDelete() {
    startTransition(async () => {
      const result = await deleteBot(bot.id)
      if (result?.error) {
        toast.add({ title: "Couldn't delete bot", description: result.error })
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive" className="sm:mr-auto" />}
      >
        <Trash2Icon data-icon="inline-start" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {bot.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes {bot.name} and your chat with it. You can&apos;t undo
            this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={onDelete}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
