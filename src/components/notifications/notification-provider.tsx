"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  type: "NEW_JOURNAL" | "FOLLOW_REQUEST" | "FOLLOW_ACCEPT"
  sender: {
    name: string
    image: string | null
  }
  journal?: {
    id: string
    title: string
  }
  createdAt: string
  isRead: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    if (session?.user) {
      const socketInstance = io({
        path: "/api/socket",
        addTrailingSlash: false,
      })

      socketInstance.on("connect", () => {
        socketInstance.emit("join", { userId: session.user.id })
      })

      socketInstance.on("notification", (notification: Notification) => {
        setNotifications(prev => [notification, ...prev])
        
        toast({
          title: "New Notification",
          description: getNotificationMessage(notification),
        })
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      })

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      })

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

function getNotificationMessage(notification: Notification): string {
  switch (notification.type) {
    case "NEW_JOURNAL":
      return `${notification.sender.name} posted a new journal`
    case "FOLLOW_REQUEST":
      return `${notification.sender.name} requested to follow you`
    case "FOLLOW_ACCEPT":
      return `${notification.sender.name} accepted your follow request`
    default:
      return "New notification"
  }
}
