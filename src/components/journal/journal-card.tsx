"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

interface JournalCardProps {
  journal: {
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
    comments: Comment[]
  }
  currentUserId: string
}

export function JournalCard({ journal, currentUserId }: JournalCardProps) {
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(
    journal.likes.some((like) => like.userId === currentUserId)
  )
  const [likeCount, setLikeCount] = useState(journal._count.likes)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>(journal.comments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/journals/${journal.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      })

      if (!response.ok) throw new Error()

      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status",
      })
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/journals/${journal.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) throw new Error()

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={journal.author.image || undefined} />
          <AvatarFallback>
            {journal.author.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{journal.author.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(journal.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: journal.content }}
        />
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isLiked && "fill-current text-red-500"
              )}
            />
            {likeCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            {comments.length}
          </Button>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback>
                      {comment.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-medium text-sm">
                        {comment.user.name}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
