import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { promises as dns } from "dns"

// Mock database - replace with your actual database
const users = [
  {
    id: "1",
    email: "demo@0xhub.pro",
    name: "Demo User",
    domains: [],
  },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const domainId = params.id

    // Find domain
    const domain = user.domains.find((d: any) => d.id === domainId)
    if (!domain) {
      return NextResponse.json({ message: "Domain not found" }, { status: 404 })
    }

    if (domain.status === "active") {
      return NextResponse.json({
        success: true,
        message: "Domain is already verified and active",
        domain,
      })
    }

    // Verify DNS records
    const verificationResults = await verifyDNSRecords(domain)

    if (verificationResults.verified) {
      // Update domain status
      domain.status = "active"
      domain.verifiedAt = new Date().toISOString()

      return NextResponse.json({
        success: true,
        message: "Domain verified successfully!",
        domain,
        verificationResults,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Domain verification failed. Please check your DNS records.",
        domain,
        verificationResults,
      })
    }
  } catch (error) {
    console.error("Domain verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

async function verifyDNSRecords(domain: any) {
  const results = {
    verified: false,
    checks: [] as any[],
  }

  try {
    for (const record of domain.dnsRecords) {
      const checkResult = {
        type: record.type,
        name: record.name,
        expectedValue: record.value,
        actualValue: null,
        verified: false,
      }

      try {
        if (record.type === "CNAME") {
          const cnameRecords = await dns.resolveCname(record.name)
          checkResult.actualValue = cnameRecords[0]
          checkResult.verified = cnameRecords.includes(record.value)
        } else if (record.type === "TXT") {
          const txtRecords = await dns.resolveTxt(record.name)
          const flatTxtRecords = txtRecords.flat()
          checkResult.actualValue = flatTxtRecords.join(", ")
          checkResult.verified = flatTxtRecords.some((txt) => txt.includes(record.value))
        } else if (record.type === "A") {
          const aRecords = await dns.resolve4(record.name)
          checkResult.actualValue = aRecords.join(", ")
          checkResult.verified = aRecords.includes(record.value)
        }
      } catch (dnsError) {
        console.error(`DNS lookup failed for ${record.name}:`, dnsError)
        checkResult.actualValue = "DNS lookup failed"
        checkResult.verified = false
      }

      results.checks.push(checkResult)
    }

    // Domain is verified if all required checks pass
    results.verified = results.checks.every((check) => check.verified)
  } catch (error) {
    console.error("DNS verification error:", error)
    results.verified = false
  }

  return results
}
