import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { profileFormSchema } from "@/lib/validators/settings"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = profileFormSchema.parse(json)

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        email: body.email,
        bio: body.bio,
        goals: body.goals,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
