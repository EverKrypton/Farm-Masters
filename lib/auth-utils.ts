import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function verifyAdminAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Mock user data - replace with actual database query
    const user = {
      id: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.email === "admin@0xhub.pro" || decoded.userId === "1",
    }

    return user
  } catch (error) {
    return null
  }
}
