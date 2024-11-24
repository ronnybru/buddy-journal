import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { status } = json

    if (!["ACCEPTED", "DECLINED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    const follow = await db.follower.update({
      where: {
        userId_followerId: {
          userId: session.user.id,
          followerId: params.userId,
        },
        status: "PENDING",
      },
      data: { status },
    })

    if (status === "ACCEPTED") {
      await db.notification.create({
        data: {
          type: "FOLLOW_ACCEPT",
          recipientId: params.userId,
          senderId: session.user.id,
        },
      })
    }

    return NextResponse.json(follow)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.follower.delete({
      where: {
        userId_followerId: {
          userId: params.userId,
          followerId: session.user.id,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
