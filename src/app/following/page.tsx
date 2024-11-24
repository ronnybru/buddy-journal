import { Suspense } from "react"
import { UserSearch } from "@/components/follow/user-search"
import { FollowRequests } from "@/components/follow/follow-requests"

export default function FollowingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Find Users</h2>
        <UserSearch />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Follow Requests</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <FollowRequests />
        </Suspense>
      </section>
    </div>
  )
}
