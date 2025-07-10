"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Github, Globe, Key, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface IntegrationStatus {
  github: boolean
  vercel: boolean
}

export default function SettingsPage() {
  const [githubToken, setGithubToken] = useState("")
  const [vercelToken, setVercelToken] = useState("")
  const [showGithubToken, setShowGithubToken] = useState(false)
  const [showVercelToken, setShowVercelToken] = useState(false)
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    github: false,
    vercel: false,
  })
  const [isTestingGithub, setIsTestingGithub] = useState(false)
  const [isTestingVercel, setIsTestingVercel] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadSavedTokens()
  }, [])

  const loadSavedTokens = () => {
    const savedGithubToken = localStorage.getItem("github_token")
    const savedVercelToken = localStorage.getItem("vercel_token")

    if (savedGithubToken) {
      setGithubToken(savedGithubToken)
      setIntegrationStatus((prev) => ({ ...prev, github: true }))
    }

    if (savedVercelToken) {
      setVercelToken(savedVercelToken)
      setIntegrationStatus((prev) => ({ ...prev, vercel: true }))
    }
  }

  const testGithubConnection = async () => {
    if (!githubToken.trim()) return

    setIsTestingGithub(true)
    try {
      const response = await fetch("/api/integrations/test-github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: githubToken }),
      })

      const result = await response.json()
      if (result.success) {
        setIntegrationStatus((prev) => ({ ...prev, github: true }))
        alert(`GitHub connected successfully! Username: ${result.data.username}`)
      } else {
        setIntegrationStatus((prev) => ({ ...prev, github: false }))
        alert("GitHub connection failed. Please check your token.")
      }
    } catch (error) {
      console.error("GitHub test failed:", error)
      setIntegrationStatus((prev) => ({ ...prev, github: false }))
      alert("GitHub connection test failed.")
    } finally {
      setIsTestingGithub(false)
    }
  }

  const testVercelConnection = async () => {
    if (!vercelToken.trim()) return

    setIsTestingVercel(true)
    try {
      const response = await fetch("/api/integrations/test-vercel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: vercelToken }),
      })

      const result = await response.json()
      if (result.success) {
        setIntegrationStatus((prev) => ({ ...prev, vercel: true }))
        alert(`Vercel connected successfully! User: ${result.data.username}`)
      } else {
        setIntegrationStatus((prev) => ({ ...prev, vercel: false }))
        alert("Vercel connection failed. Please check your token.")
      }
    } catch (error) {
      console.error("Vercel test failed:", error)
      setIntegrationStatus((prev) => ({ ...prev, vercel: false }))
      alert("Vercel connection test failed.")
    } finally {
      setIsTestingVercel(false)
    }
  }

  const saveTokens = async () => {
    setIsSaving(true)
    try {
      // Save tokens to localStorage (in production, use secure storage)
      if (githubToken.trim()) {
        localStorage.setItem("github_token", githubToken)
      } else {
        localStorage.removeItem("github_token")
      }

      if (vercelToken.trim()) {
        localStorage.setItem("vercel_token", vercelToken)
      } else {
        localStorage.removeItem("vercel_token")
      }

      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <Button onClick={saveTokens} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            {/* GitHub Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="w-6 h-6" />
                    <div>
                      <CardTitle>GitHub Integration</CardTitle>
                      <p className="text-sm text-gray-600">Connect your GitHub account to push code automatically</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.github ? "default" : "secondary"}>
                    {integrationStatus.github ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Connected
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="github-token">Personal Access Token</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="github-token"
                        type={showGithubToken ? "text" : "password"}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowGithubToken(!showGithubToken)}
                      >
                        {showGithubToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button onClick={testGithubConnection} disabled={!githubToken.trim() || isTestingGithub}>
                      {isTestingGithub ? "Testing..." : "Test"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Create a token at{" "}
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      GitHub Settings
                    </a>{" "}
                    with 'repo' permissions
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vercel Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6" />
                    <div>
                      <CardTitle>Vercel Integration</CardTitle>
                      <p className="text-sm text-gray-600">Connect your Vercel account for automatic deployments</p>
                    </div>
                  </div>
                  <Badge variant={integrationStatus.vercel ? "default" : "secondary"}>
                    {integrationStatus.vercel ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Connected
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vercel-token">Access Token</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="vercel-token"
                        type={showVercelToken ? "text" : "password"}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={vercelToken}
                        onChange={(e) => setVercelToken(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowVercelToken(!showVercelToken)}
                      >
                        {showVercelToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button onClick={testVercelConnection} disabled={!vercelToken.trim() || isTestingVercel}>
                      {isTestingVercel ? "Testing..." : "Test"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Create a token at{" "}
                    <a
                      href="https://vercel.com/account/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Vercel Settings
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Key className="w-6 h-6" />
                  <div>
                    <CardTitle>API Configuration</CardTitle>
                    <p className="text-sm text-gray-600">Current API status and configuration</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">v0.dev API</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Configured
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crypto Payments</span>
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Account management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
