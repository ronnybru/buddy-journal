import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const like = await db.like.create({
      data: {
        userId: session.user.id,
        journalId: params.id,
      },
    })

    // Create notification for journal author
    const journal = await db.journal.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (journal && journal.authorId !== session.user.id) {
      await db.notification.create({
        data: {
          type: "NEW_JOURNAL",
          recipientId: journal.authorId,
          senderId: session.user.id,
          journalId: params.id,
        },
      })
    }

    return NextResponse.json(like)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.like.delete({
      where: {
        userId_journalId: {
          userId: session.user.id,
          journalId: params.id,
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
