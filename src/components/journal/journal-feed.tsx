"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { JournalCard } from "@/components/journal/journal-card"

interface Journal {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
  likes: { userId: string }[]
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }>
}

export function JournalFeed() {
  const { data: session } = useSession()
  const [journals, setJournals] = useState<Journal[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreJournals()
    }
  }, [inView])

  const loadMoreJournals = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/journals?page=${page}&limit=10`)
      const data = await response.json()
      
      setJournals(prev => [...prev, ...data.journals])
      setHasMore(data.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error("Failed to load journals:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) return null

  return (
    <div className="space-y-6">
      {journals.map((journal) => (
        <JournalCard
          key={journal.id}
          journal={journal}
          currentUserId={session.user.id}
        />
      ))}
      
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          {loading ? "Loading..." : "Load more"}
        </div>
      )}
      
      {!hasMore && journals.length > 0 && (
        <p className="text-center text-muted-foreground">
          No more journals to load
        </p>
      )}
      
      {!loading && journals.length === 0 && (
        <p className="text-center text-muted-foreground">
          No journals found. Create your first journal or follow someone!
        </p>
      )}
    </div>
  )
}
