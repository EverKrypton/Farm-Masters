"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Plus, Check, AlertCircle, ExternalLink, Copy, Trash2, RefreshCw, Info } from "lucide-react"

interface DomainManagerProps {
  websiteId: string
}

interface Domain {
  id: string
  domain: string
  status: "pending" | "verified" | "failed"
  createdAt: string
  sslStatus: "pending" | "active" | "failed"
}

export default function DomainManager({ websiteId }: DomainManagerProps) {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: "1",
      domain: "example.com",
      status: "verified",
      createdAt: "2024-01-15",
      sslStatus: "active",
    },
  ])
  const [newDomain, setNewDomain] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [copied, setCopied] = useState("")

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return

    setIsAdding(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const domain: Domain = {
        id: Date.now().toString(),
        domain: newDomain.trim(),
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        sslStatus: "pending",
      }

      setDomains([...domains, domain])
      setNewDomain("")
    } catch (error) {
      console.error("Failed to add domain:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveDomain = async (domainId: string) => {
    setDomains(domains.filter((d) => d.id !== domainId))
  }

  const handleVerifyDomain = async (domainId: string) => {
    setDomains(domains.map((d) => (d.id === domainId ? { ...d, status: "verified", sslStatus: "active" } : d)))
  }

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "active":
        return <Check className="w-4 h-4" />
      case "pending":
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Domain */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Custom Domains
          </h3>

          <div className="flex gap-2 mb-4">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="bg-gray-800 border-gray-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
            />
            <Button
              onClick={handleAddDomain}
              disabled={!newDomain.trim() || isAdding}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAdding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Free Custom Domains</p>
                <p>Connect unlimited custom domains to your generated website at no cost.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain List */}
      {domains.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 sm:p-6">
            <h4 className="font-semibold mb-4">Connected Domains</h4>
            <div className="space-y-3">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white truncate">{domain.domain}</span>
                      <div className={`flex items-center gap-1 ${getStatusColor(domain.status)}`}>
                        {getStatusIcon(domain.status)}
                        <span className="text-xs capitalize">{domain.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Added: {domain.createdAt}</span>
                      <div className={`flex items-center gap-1 ${getStatusColor(domain.sslStatus)}`}>
                        <span>SSL: {domain.sslStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {domain.status === "verified" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://${domain.domain}`, "_blank")}
                        className="text-gray-400 hover:text-white p-1 h-auto"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}

                    {domain.status === "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVerifyDomain(domain.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1"
                      >
                        Verify
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveDomain(domain.id)}
                      className="text-red-400 hover:text-red-300 p-1 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DNS Configuration */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h4 className="font-semibold mb-4">DNS Configuration</h4>
          <p className="text-gray-400 text-sm mb-4">
            Add these DNS records to your domain provider to connect your custom domain:
          </p>

          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">A Record</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy("76.76.19.123", "a-record")}
                  className="text-gray-400 hover:text-white p-1 h-auto"
                >
                  {copied === "a-record" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Name: @ (or leave blank)</div>
                <div>Value: 76.76.19.123</div>
                <div>TTL: 3600</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CNAME Record</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy("cname.0xhub.pro", "cname-record")}
                  className="text-gray-400 hover:text-white p-1 h-auto"
                >
                  {copied === "cname-record" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Name: www</div>
                <div>Value: cname.0xhub.pro</div>
                <div>TTL: 3600</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-300">
                <p className="font-medium mb-1">DNS Propagation</p>
                <p>DNS changes can take up to 24-48 hours to propagate globally.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
