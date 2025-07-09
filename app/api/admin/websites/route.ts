import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminAuth(request)
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock data - replace with actual database queries
    const websites = [
      {
        id: "1",
        name: "E-commerce Store",
        userId: "1",
        userName: "John Doe",
        language: "Next.js",
        tier: "pro",
        createdAt: "2024-01-10T00:00:00Z",
        lastModified: "2024-01-12T00:00:00Z",
        isPublic: true,
        views: 1250,
      },
      {
        id: "2",
        name: "Portfolio Site",
        userId: "2",
        userName: "Jane Smith",
        language: "React",
        tier: "free",
        createdAt: "2024-01-08T00:00:00Z",
        lastModified: "2024-01-08T00:00:00Z",
        isPublic: false,
        views: 45,
      },
      {
        id: "3",
        name: "Corporate Website",
        userId: "3",
        userName: "Enterprise Corp",
        language: "Vue.js",
        tier: "pro",
        createdAt: "2024-01-05T00:00:00Z",
        lastModified: "2024-01-14T00:00:00Z",
        isPublic: true,
        views: 3420,
      },
    ]

    return NextResponse.json({ websites })
  } catch (error) {
    console.error("Admin websites error:", error)
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 })
  }
}
