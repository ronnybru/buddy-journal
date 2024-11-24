import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { hash, compare } from "bcryptjs"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { passwordFormSchema } from "@/lib/validators/settings"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = passwordFormSchema.parse(json)

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    const isValid = await compare(body.currentPassword, user.password)
    if (!isValid) {
      return new NextResponse("Invalid current password", { status: 400 })
    }

    const hashedPassword = await hash(body.newPassword, 10)
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
