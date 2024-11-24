"use client"

import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { UserCard } from "@/components/follow/user-card"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  followers: any[]
}

export function UserSearch() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setUsers([])
      return
    }

    const searchUsers = async () => {
      try {
        const response = await fetch(`/api/users/search?q=${debouncedQuery}`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Failed to search users:", error)
      }
    }

    searchUsers()
  }, [debouncedQuery])

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            followStatus={user.followers[0]?.status}
          />
        ))}
        
        {query.length >= 3 && users.length === 0 && (
          <p className="text-center text-muted-foreground">
            No users found
          </p>
        )}
      </div>
    </div>
  )
}
