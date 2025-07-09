import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdminAuth(request)
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Mock data - replace with actual database queries
    const users = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        tier: "pro",
        credits: 150,
        websitesGenerated: 12,
        totalSpent: 75,
        lastActive: "2024-01-15T10:30:00Z",
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        tier: "free",
        credits: 0,
        websitesGenerated: 3,
        totalSpent: 0,
        lastActive: "2024-01-14T15:45:00Z",
        createdAt: "2024-01-05T00:00:00Z",
      },
      {
        id: "3",
        name: "Enterprise Corp",
        email: "admin@enterprise.com",
        tier: "enterprise",
        credits: 500,
        websitesGenerated: 45,
        totalSpent: 1200,
        lastActive: "2024-01-15T09:15:00Z",
        createdAt: "2023-12-15T00:00:00Z",
      },
    ]

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
