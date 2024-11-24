import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notification = await db.notification.update({
      where: {
        id: params.id,
        recipientId: session.user.id,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
