"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { UserNav } from "@/components/user-nav"
import { useSession } from "next-auth/react"

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAuthPage = pathname === "/login" || pathname === "/register"
  
  if (isAuthPage) return null

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Buddy Journal
          </Link>
          {session && (
            <nav className="flex items-center gap-4">
              <Link href="/journal">Journals</Link>
              <Link href="/following">Following</Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <NotificationDropdown />
              <UserNav />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
