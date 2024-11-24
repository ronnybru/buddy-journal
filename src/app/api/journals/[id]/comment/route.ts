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

    const json = await req.json()
    const { content } = json

    if (!content?.trim()) {
      return new NextResponse("Comment content is required", { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        content,
        userId: session.user.id,
        journalId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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

    return NextResponse.json(comment)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
