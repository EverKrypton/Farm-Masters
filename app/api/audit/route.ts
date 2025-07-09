import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code, language, blockchain, contractName } = await request.json()

    if (!code || !contractName) {
      return NextResponse.json({ error: "Code and contract name are required" }, { status: 400 })
    }

    // Simulate audit process
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Generate audit results based on code analysis
    const auditResults = await performAudit(code, language, blockchain, contractName)

    return NextResponse.json({
      success: true,
      results: auditResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Audit error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Audit failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function performAudit(code: string, language: string, blockchain: string, contractName: string) {
  // AI-powered audit simulation
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Analyze code for common vulnerabilities
  const issues = []
  let securityScore = 85
  let criticalIssues = 0
  let warnings = 0

  // Check for common patterns
  if (code.includes("transfer(") && !code.includes("require(")) {
    issues.push({
      severity: "critical",
      title: "Unchecked Transfer",
      description: "Transfer function without proper validation could lead to loss of funds",
      line: findLineNumber(code, "transfer("),
      recommendation: "Add require() statements to validate transfer conditions",
    })
    criticalIssues++
    securityScore -= 15
  }

  if (code.includes("msg.sender") && code.includes("onlyOwner")) {
    issues.push({
      severity: "warning",
      title: "Access Control Pattern",
      description: "Ensure proper access control implementation",
      line: findLineNumber(code, "onlyOwner"),
      recommendation: "Review access control modifiers and permissions",
    })
    warnings++
    securityScore -= 5
  }

  if (code.includes("block.timestamp")) {
    issues.push({
      severity: "warning",
      title: "Timestamp Dependence",
      description: "Using block.timestamp can be manipulated by miners",
      line: findLineNumber(code, "block.timestamp"),
      recommendation: "Consider using block.number or external oracles for time-sensitive operations",
    })
    warnings++
    securityScore -= 5
  }

  if (!code.includes("SafeMath") && language === "solidity") {
    issues.push({
      severity: "critical",
      title: "Integer Overflow Risk",
      description: "No SafeMath library detected for arithmetic operations",
      line: 1,
      recommendation: "Use SafeMath library or Solidity 0.8+ built-in overflow protection",
    })
    criticalIssues++
    securityScore -= 20
  }

  // Gas optimization checks
  if (code.includes("for(") || code.includes("while(")) {
    issues.push({
      severity: "info",
      title: "Gas Optimization",
      description: "Loops detected - consider gas optimization",
      line: findLineNumber(code, "for("),
      recommendation: "Optimize loops to prevent gas limit issues",
    })
  }

  return {
    auditId,
    contractName,
    language,
    blockchain,
    securityScore: Math.max(securityScore, 0),
    criticalIssues,
    warnings,
    issues,
    gasOptimizations: 3,
    codeQuality: "Good",
    timestamp: new Date().toISOString(),
  }
}

function findLineNumber(code: string, searchTerm: string): number {
  const lines = code.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchTerm)) {
      return i + 1
    }
  }
  return 1
}
