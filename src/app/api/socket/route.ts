import { NextResponse } from "next/server"
import { initSocket } from "@/lib/socket"

export function GET(req: Request) {
  try {
    // @ts-ignore - Next.js API route type mismatch
    const io = initSocket(req, res)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false })
  }
}
