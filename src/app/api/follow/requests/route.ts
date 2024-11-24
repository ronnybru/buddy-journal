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

    const requests = await db.follower.findMany({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
