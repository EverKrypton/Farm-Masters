"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Code, Settings, Github, Rocket, Globe, Wallet, Download } from "lucide-react"
import CryptoPayment from "./crypto-payment"

interface WebsiteEditorProps {
  projectId: string
  initialCode: string
  previewUrl: string
}

export default function WebsiteEditor({ projectId, initialCode, previewUrl }: WebsiteEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [showPayment, setShowPayment] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          files: [
            {
              path: "app/page.tsx",
              content: code,
            },
            {
              path: "package.json",
              content: JSON.stringify(
                {
                  name: "generated-website",
                  version: "1.0.0",
                  dependencies: {
                    next: "^14.0.0",
                    react: "^18.0.0",
                    "react-dom": "^18.0.0",
                  },
                },
                null,
                2,
              ),
            },
          ],
        }),
      })

      const result = await response.json()
      if (result.success) {
        setDeploymentUrl(result.data.url)
      }
    } catch (error) {
      console.error("Deployment failed:", error)
    } finally {
      setIsDeploying(false)
    }
  }

  const handleGitHubPush = async () => {
    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          repoName: `webcraft-${projectId}`,
          files: [
            {
              path: "app/page.tsx",
              content: code,
            },
          ],
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Code pushed to GitHub successfully!")
      }
    } catch (error) {
      console.error("GitHub push failed:", error)
    }
  }

  const handlePaymentComplete = (paymentId: string) => {
    setShowPayment(false)
    alert("Payment completed! Premium features unlocked.")
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <CryptoPayment
          amount="0.01"
          description="Premium Website Features"
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => setShowPayment(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Website Editor</h1>
              <Badge variant="secondary">Project {projectId}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowPayment(true)}>
                <Wallet className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
              <Button variant="outline" size="sm" onClick={handleGitHubPush}>
                <Github className="w-4 h-4 mr-2" />
                Push to GitHub
              </Button>
              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Rocket className="w-4 h-4 mr-2" />
                {isDeploying ? "Deploying..." : "Deploy"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Website Preview
                  {deploymentUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        View Live
                      </a>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <iframe src={previewUrl} className="w-full h-96" title="Website Preview" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Source Code
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm border rounded-lg resize-none"
                  placeholder="Your website code will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Custom Domain</label>
                    <input type="text" placeholder="yourdomain.com" className="w-full mt-1 p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Environment</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Production</option>
                      <option>Staging</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GitHub Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Repository Name</label>
                    <input type="text" placeholder="my-website" className="w-full mt-1 p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
