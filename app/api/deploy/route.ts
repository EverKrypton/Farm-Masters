import { type NextRequest, NextResponse } from "next/server"

interface DeploymentRequest {
  projectId: string
  files: Array<{
    path: string
    content: string
  }>
  vercelToken: string
  customDomain?: string
  paymentId?: string
}

// Import the payments map
const pendingPayments = new Map<string, any>()

async function deployToVercel(
  files: Array<{ path: string; content: string }>,
  projectName: string,
  vercelToken: string,
): Promise<any> {
  const vercelFiles = files.map((file) => ({
    file: file.path,
    data: Buffer.from(file.content).toString("base64"),
    encoding: "base64",
  }))

  const deploymentResponse = await fetch("https://api.vercel.com/v13/deployments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      files: vercelFiles,
      projectSettings: {
        framework: "nextjs",
        buildCommand: "npm run build",
        devCommand: "npm run dev",
        installCommand: "npm install",
        outputDirectory: ".next",
      },
      target: "production",
    }),
  })

  if (!deploymentResponse.ok) {
    const errorText = await deploymentResponse.text()
    throw new Error(`Vercel deployment failed: ${deploymentResponse.status} - ${errorText}`)
  }

  return await deploymentResponse.json()
}

async function configureCustomDomain(deploymentId: string, domain: string, vercelToken: string): Promise<void> {
  const domainResponse = await fetch("https://api.vercel.com/v9/projects/domains", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: domain,
      projectId: deploymentId,
    }),
  })

  if (!domainResponse.ok) {
    const errorText = await domainResponse.text()
    throw new Error(`Domain configuration failed: ${domainResponse.status} - ${errorText}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, files, vercelToken, customDomain, paymentId }: DeploymentRequest = await request.json()

    if (!projectId || !files || !vercelToken) {
      return NextResponse.json({ error: "Project ID, files, and Vercel token are required" }, { status: 400 })
    }

    // If custom domain is requested, verify payment
    if (customDomain && paymentId) {
      const payment = pendingPayments.get(paymentId)
      if (!payment || payment.status !== "completed" || payment.service !== "domain") {
        return NextResponse.json({ error: "Valid payment required for custom domain" }, { status: 402 })
      }
    }

    const requiredFiles = ["package.json"]
    const fileNames = files.map((f) => f.path)

    for (const required of requiredFiles) {
      if (!fileNames.some((name) => name.includes(required))) {
        return NextResponse.json({ error: `Missing required file: ${required}` }, { status: 400 })
      }
    }

    const projectName = `webcraft-${projectId.slice(0, 8)}`
    const deployment = await deployToVercel(files, projectName, vercelToken)

    // Configure custom domain if provided and paid for
    if (customDomain && paymentId) {
      try {
        await configureCustomDomain(deployment.id, customDomain, vercelToken)
      } catch (error) {
        console.error("Custom domain configuration failed:", error)
        // Don't fail the entire deployment for domain issues
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: deployment.id,
        url: `https://${deployment.url}`,
        status: deployment.status || "ready",
        customDomain,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Deployment error:", error)

    if (error instanceof Error) {
      if (error.message.includes("403") || error.message.includes("forbidden")) {
        return NextResponse.json({ error: "Invalid Vercel token or insufficient permissions" }, { status: 403 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Deployment failed" }, { status: 500 })
  }
}
