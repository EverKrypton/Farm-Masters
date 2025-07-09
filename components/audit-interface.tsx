"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Upload, Download, CheckCircle, AlertTriangle, Loader2, DollarSign, Code, Zap } from "lucide-react"

export default function AuditInterface() {
  const [contractCode, setContractCode] = useState("")
  const [contractLanguage, setContractLanguage] = useState("solidity")
  const [blockchain, setBlockchain] = useState("ethereum")
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResults, setAuditResults] = useState<any>(null)
  const [contractName, setContractName] = useState("")

  const supportedLanguages = [
    { value: "solidity", label: "🔷 Solidity", description: "Ethereum smart contracts" },
    { value: "rust", label: "🦀 Rust", description: "Solana, Near, Polkadot" },
    { value: "move", label: "🚀 Move", description: "Aptos, Sui blockchain" },
    { value: "cairo", label: "🏺 Cairo", description: "StarkNet contracts" },
    { value: "vyper", label: "🐍 Vyper", description: "Ethereum alternative" },
    { value: "javascript", label: "📜 JavaScript", description: "Web3 applications" },
  ]

  const supportedBlockchains = [
    { value: "ethereum", label: "Ethereum", icon: "⟠" },
    { value: "polygon", label: "Polygon", icon: "🟣" },
    { value: "bsc", label: "BSC", icon: "🟡" },
    { value: "solana", label: "Solana", icon: "🌞" },
    { value: "avalanche", label: "Avalanche", icon: "🔺" },
    { value: "arbitrum", label: "Arbitrum", icon: "🔵" },
  ]

  const handleAudit = async () => {
    if (!contractCode.trim() || !contractName.trim()) return

    setIsAuditing(true)
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: contractCode,
          language: contractLanguage,
          blockchain: blockchain,
          contractName: contractName,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAuditResults(data.results)
      }
    } catch (error) {
      console.error("Audit failed:", error)
    } finally {
      setIsAuditing(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!auditResults) return

    try {
      const response = await fetch("/api/audit/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: auditResults.auditId,
          contractName: contractName,
        }),
      })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${contractName}_audit_report.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
          <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">AI-Powered Security Analysis • $10 per audit</span>
          <span className="sm:hidden">AI Security Analysis • $10</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Smart Contract Audit
        </h1>

        <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Comprehensive AI-driven security analysis for smart contracts across multiple blockchain platforms.
        </p>
      </div>

      {!auditResults ? (
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Code className="w-5 h-5" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractName" className="text-sm font-medium text-gray-300">
                      Contract Name
                    </Label>
                    <Input
                      id="contractName"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="MyToken"
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="blockchain" className="text-sm font-medium text-gray-300">
                      Blockchain Platform
                    </Label>
                    <select
                      id="blockchain"
                      value={blockchain}
                      onChange={(e) => setBlockchain(e.target.value)}
                      className="mt-1 w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                    >
                      {supportedBlockchains.map((chain) => (
                        <option key={chain.value} value={chain.value}>
                          {chain.icon} {chain.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="language" className="text-sm font-medium text-gray-300">
                    Programming Language
                  </Label>
                  <select
                    id="language"
                    value={contractLanguage}
                    onChange={(e) => setContractLanguage(e.target.value)}
                    className="mt-1 w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label} - {lang.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="code" className="text-sm font-medium text-gray-300">
                    Contract Source Code
                  </Label>
                  <Textarea
                    id="code"
                    value={contractCode}
                    onChange={(e) => setContractCode(e.target.value)}
                    placeholder="Paste your smart contract code here..."
                    className="mt-1 bg-gray-800 border-gray-700 text-white min-h-[300px] sm:min-h-[400px] font-mono text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-700 bg-transparent text-gray-300 hover:text-white flex-1 sm:flex-none"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    onClick={handleAudit}
                    disabled={!contractCode.trim() || !contractName.trim() || isAuditing}
                    className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none"
                  >
                    {isAuditing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {isAuditing ? "Analyzing..." : "Start Audit - $10"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-4 sm:space-y-6">
              {/* Pricing Card */}
              <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-800/30">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Audit Pricing</h3>
                    <div className="text-2xl font-bold text-emerald-400 mb-2">$10</div>
                    <p className="text-gray-400 text-sm mb-4">Per contract audit</p>
                    <ul className="text-sm text-gray-300 space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Comprehensive security analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Vulnerability detection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Gas optimization suggestions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Detailed PDF report
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Supported Features */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Audit Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Reentrancy Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Integer Overflow/Underflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Access Control Issues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Gas Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Logic Vulnerabilities</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Results */
        <div className="space-y-6 sm:space-y-8">
          {/* Results Header */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Audit Complete</h2>
                  <p className="text-gray-400">Contract: {contractName}</p>
                  <p className="text-gray-400 text-sm">
                    Audit ID: {auditResults.auditId} • {auditResults.timestamp}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button onClick={handleDownloadReport} className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAuditResults(null)}
                    className="border-gray-700 bg-transparent"
                  >
                    New Audit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">{auditResults.securityScore}/100</div>
                <p className="text-gray-400">Security Score</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{auditResults.criticalIssues}</div>
                <p className="text-gray-400">Critical Issues</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{auditResults.warnings}</div>
                <p className="text-gray-400">Warnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Security Issues Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {auditResults.issues.map((issue: any, index: number) => (
                <div key={index} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {issue.severity === "critical" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                      {issue.severity === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                      {issue.severity === "info" && <CheckCircle className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge
                          variant={issue.severity === "critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{issue.description}</p>
                      <p className="text-gray-500 text-xs">Line {issue.line}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
