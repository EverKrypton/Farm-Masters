import { type NextRequest, NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Test GitHub token
    const octokit = new Octokit({ auth: token })

    const { data: user } = await octokit.rest.users.getAuthenticated()

    return NextResponse.json({
      success: true,
      data: {
        username: user.login,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    })
  } catch (error: any) {
    console.error("GitHub test error:", error)

    if (error.status === 401) {
      return NextResponse.json({ error: "Invalid GitHub token" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to test GitHub connection" }, { status: 500 })
  }
}
