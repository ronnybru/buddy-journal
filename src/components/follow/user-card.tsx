"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface UserCardProps {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  followStatus?: "PENDING" | "ACCEPTED" | "DECLINED" | null
}

export function UserCard({ user, followStatus }: UserCardProps) {
  const { toast } = useToast()
  const [status, setStatus] = useState(followStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) throw new Error()

      setStatus("PENDING")
      toast({
        title: "Success",
        description: "Follow request sent",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send follow request",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfollow = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/follow/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error()

      setStatus(null)
      toast({
        title: "Success",
        description: "Unfollowed successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unfollow",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        {status === "ACCEPTED" ? (
          <Button
            variant="outline"
            onClick={handleUnfollow}
            disabled={isLoading}
          >
            Unfollow
          </Button>
        ) : status === "PENDING" ? (
          <Button variant="outline" disabled>
            Pending
          </Button>
        ) : (
          <Button
            onClick={handleFollow}
            disabled={isLoading}
          >
            Follow
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
