import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Mock database - replace with your actual database
const users = [
  {
    id: "1",
    email: "demo@0xhub.pro",
    name: "Demo User",
    domains: [],
  },
]

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const { domain, websiteId } = await request.json()

    if (!domain || !websiteId) {
      return NextResponse.json({ message: "Domain and website ID are required" }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json({ message: "Invalid domain format" }, { status: 400 })
    }

    // Check if domain already exists
    const existingDomain = user.domains.find((d: any) => d.domain === domain)
    if (existingDomain) {
      return NextResponse.json({ message: "Domain already configured" }, { status: 409 })
    }

    // Generate DNS records
    const dnsRecords = [
      {
        type: "CNAME" as const,
        name: domain,
        value: `${websiteId}.0xhub.pro`,
        ttl: 300,
      },
      {
        type: "TXT" as const,
        name: `_genui-verification.${domain}`,
        value: `genui-verification=${generateVerificationToken(domain, websiteId)}`,
        ttl: 300,
      },
    ]

    // Create domain record
    const newDomain = {
      id: Date.now().toString(),
      domain,
      websiteId,
      status: "pending" as const,
      dnsRecords,
      createdAt: new Date().toISOString(),
    }

    user.domains.push(newDomain)

    return NextResponse.json({
      success: true,
      domain: newDomain,
      message: "Domain configuration created. Please add the DNS records to verify ownership.",
    })
  } catch (error) {
    console.error("Domain creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      domains: user.domains,
    })
  } catch (error) {
    console.error("Domain list error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

function generateVerificationToken(domain: string, websiteId: string): string {
  const data = `${domain}-${websiteId}-${Date.now()}`
  return Buffer.from(data)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 32)
}
