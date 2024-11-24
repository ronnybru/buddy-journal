import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.notification.updateMany({
      where: {
        recipientId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
