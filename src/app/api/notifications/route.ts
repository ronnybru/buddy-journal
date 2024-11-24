import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: {
        recipientId: session.user.id,
      },
      include: {
        sender: {
          select: {
            name: true,
            image: true,
          },
        },
        journal: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
