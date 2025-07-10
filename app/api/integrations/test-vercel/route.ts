import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Test Vercel token
    const response = await fetch("https://api.vercel.com/v2/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: "Invalid Vercel token" }, { status: 401 })
      }
      throw new Error(`Vercel API error: ${response.status}`)
    }

    const userData = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        username: userData.username,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
      },
    })
  } catch (error) {
    console.error("Vercel test error:", error)
    return NextResponse.json({ error: "Failed to test Vercel connection" }, { status: 500 })
  }
}
