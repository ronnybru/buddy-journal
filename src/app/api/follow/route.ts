import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const followSchema = z.object({
  userId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = followSchema.parse(json)

    const existingFollow = await db.follower.findUnique({
      where: {
        userId_followerId: {
          userId: body.userId,
          followerId: session.user.id,
        },
      },
    })

    if (existingFollow) {
      return new NextResponse("Already following", { status: 400 })
    }

    const follow = await db.follower.create({
      data: {
        userId: body.userId,
        followerId: session.user.id,
        status: "PENDING",
      },
    })

    await db.notification.create({
      data: {
        type: "FOLLOW_REQUEST",
        recipientId: body.userId,
        senderId: session.user.id,
      },
    })

    return NextResponse.json(follow)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
