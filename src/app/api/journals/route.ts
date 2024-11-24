// Update the GET method to include likes and comments
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const journals = await db.journal.findMany({
      where: {
        OR: [
          { authorId: session.user.id },
          {
            author: {
              followers: {
                some: {
                  followerId: session.user.id,
                  status: "ACCEPTED",
                },
              },
            },
            visibility: "ACCEPTED_FOLLOWERS",
          },
          { visibility: "OPEN" },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await db.journal.count({
      where: {
        OR: [
          { authorId: session.user.id },
          {
            author: {
              followers: {
                some: {
                  followerId: session.user.id,
                  status: "ACCEPTED",
                },
              },
            },
            visibility: "ACCEPTED_FOLLOWERS",
          },
          { visibility: "OPEN" },
        ],
      },
    })

    return NextResponse.json({
      journals,
      total,
      hasMore: skip + limit < total,
    })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
