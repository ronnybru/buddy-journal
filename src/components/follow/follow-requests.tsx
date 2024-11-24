"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface FollowRequest {
  id: string
  follower: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

export function FollowRequests() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<FollowRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/follow/requests")
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (userId: string, status: "ACCEPTED" | "DECLINED") => {
    try {
      const response = await fetch(`/api/follow/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error()

      setRequests((prev) => 
        prev.filter((request) => request.follower.id !== userId)
      )

      toast({
        title: "Success",
        description: `Follow request ${status.toLowerCase()}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process request",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (requests.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No pending follow requests
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={request.follower.image || undefined} />
                <AvatarFallback>
                  {request.follower.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.follower.name}</p>
                <p className="text-sm text-muted-foreground">
                  {request.follower.email}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleRequest(request.follower.id, "ACCEPTED")}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRequest(request.follower.id, "DECLINED")}
              >
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
