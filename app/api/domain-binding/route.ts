import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl, customDomain, projectName } = await request.json()

    if (!websiteUrl || !customDomain || !projectName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(customDomain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    // Simulate domain binding process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const bindingId = `binding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sanitizedDomain = customDomain.toLowerCase().replace(/^https?:\/\//, "")

    // Generate CNAME configuration
    const cnameConfig = {
      record: "CNAME",
      name: sanitizedDomain,
      value: `${projectName.toLowerCase()}.genui.app`,
      ttl: 300,
    }

    return NextResponse.json({
      success: true,
      bindingId,
      customDomain: sanitizedDomain,
      originalUrl: websiteUrl,
      cname: cnameConfig,
      status: "pending",
      instructions: [
        "Add the CNAME record to your DNS provider",
        "Wait for DNS propagation (up to 24 hours)",
        "Your website will be accessible at your custom domain",
      ],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Domain binding error:", error)
    return NextResponse.json(
      {
        error: "Failed to bind domain",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
