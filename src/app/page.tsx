import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JournalFeed } from "@/components/journal/journal-feed"

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Feed</h1>
        <Button asChild>
          <Link href="/journal/new">New Journal</Link>
        </Button>
      </div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <JournalFeed />
      </Suspense>
    </div>
  )
}
