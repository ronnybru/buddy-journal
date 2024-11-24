import * as z from "zod"

export const journalSchema = z.object({
  content: z.string().min(1, "Journal content cannot be empty"),
  visibility: z.enum(["OPEN", "ACCEPTED_FOLLOWERS"])
})

export type JournalFormData = z.infer<typeof journalSchema>
