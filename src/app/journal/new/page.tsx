import { JournalForm } from "@/components/journal/journal-form"

export default function NewJournalPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Journal</h1>
      <JournalForm />
    </div>
  )
}
