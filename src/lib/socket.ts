import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { NextApiResponseServerIO } from "@/types/socket"

export const config = {
  api: {
    bodyParser: false,
  },
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }
  return res.socket.server.io
}
