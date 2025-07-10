"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Eye,
  Code,
  Settings,
  Github,
  Rocket,
  Globe,
  Save,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  DollarSign,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import CryptoPayment from "@/components/crypto-payment"

interface GeneratedWebsite {
  id: string
  prompt: string
  content: string
  code_blocks: Array<{ language: string; code: string; filename?: string }>
  files: Array<{ path: string; content: string }>
  preview_url?: string
  created_at: string
  tokens_used: number
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<GeneratedWebsite | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentService, setPaymentService] = useState<"domain" | "github">("domain")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [githubRepo, setGithubRepo] = useState("")
  const [selectedFile, setSelectedFile] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [githubToken, setGithubToken] = useState("")
  const [vercelToken, setVercelToken] = useState("")
  const [domainPaymentId, setDomainPaymentId] = useState("")
  const [githubPaymentId, setGithubPaymentId] = useState("")

  useEffect(() => {
    loadWebsite()
    loadTokens()
  }, [params.id])

  useEffect(() => {
    if (website && website.files.length > 0) {
      const mainFile = website.files.find((f) => f.path === "app/page.tsx") || website.files[0]
      setSelectedFile(mainFile.path)
      setFileContent(mainFile.content)
    }
  }, [website])

  const loadTokens = () => {
    const savedGithubToken = localStorage.getItem("github_token")
    const savedVercelToken = localStorage.getItem("vercel_token")
    const savedDomainPayment = localStorage.getItem(`domain_payment_${params.id}`)
    const savedGithubPayment = localStorage.getItem(`github_payment_${params.id}`)

    if (savedGithubToken) setGithubToken(savedGithubToken)
    if (savedVercelToken) setVercelToken(savedVercelToken)
    if (savedDomainPayment) setDomainPaymentId(savedDomainPayment)
    if (savedGithubPayment) setGithubPaymentId(savedGithubPayment)
  }

  const loadWebsite = async () => {
    try {
      // For demo, we'll get from the projects map
      const response = await fetch(`/api/projects/${params.id}`)
      const result = await response.json()

      if (result.success) {
        setWebsite(result.data)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to load website:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleDeploy = async () => {
    if (!website || !vercelToken) {
      alert("Please configure your Vercel token first.")
      return
    }

    // Check if custom domain is requested and payment is required
    if (customDomain && !domainPaymentId) {
      setPaymentService("domain")
      setShowPayment(true)
      return
    }

    setIsDeploying(true)
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: website.id,
          files: website.files,
          vercelToken,
          customDomain: customDomain || undefined,
          paymentId: domainPaymentId || undefined,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setDeploymentUrl(result.data.url)
        alert("Website deployed successfully!")
      } else {
        alert(result.error || "Deployment failed. Please try again.")
      }
    } catch (error) {
      console.error("Deployment failed:", error)
      alert("Deployment failed. Please try again.")
    } finally {
      setIsDeploying(false)
    }
  }

  const handleGitHubPush = async () => {
    if (!website || !githubRepo || !githubToken) {
      alert("Please configure your GitHub token and repository name first.")
      return
    }

    // Check if payment is required for GitHub integration
    if (!githubPaymentId) {
      setPaymentService("github")
      setShowPayment(true)
      return
    }

    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: website.id,
          repoName: githubRepo,
          files: website.files,
          githubToken,
          paymentId: githubPaymentId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Code pushed to GitHub successfully!")
      } else {
        alert(result.error || "GitHub push failed.")
      }
    } catch (error) {
      console.error("GitHub push failed:", error)
      alert("GitHub push failed. Please try again.")
    }
  }

  const handleSaveFile = async () => {
    if (!website || !selectedFile) return

    setIsSaving(true)
    try {
      const updatedFiles = website.files.map((file) =>
        file.path === selectedFile ? { ...file, content: fileContent } : file,
      )

      setWebsite({ ...website, files: updatedFiles })
      alert("File saved successfully!")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save file. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentComplete = (paymentId: string) => {
    if (paymentService === "domain") {
      setDomainPaymentId(paymentId)
      localStorage.setItem(`domain_payment_${params.id}`, paymentId)
      alert("Payment completed! You can now use custom domains.")
    } else {
      setGithubPaymentId(paymentId)
      localStorage.setItem(`github_payment_${params.id}`, paymentId)
      alert("Payment completed! You can now push to GitHub.")
    }
    setShowPayment(false)
  }

  const saveTokens = () => {
    if (githubToken) localStorage.setItem("github_token", githubToken)
    if (vercelToken) localStorage.setItem("vercel_token", vercelToken)
    alert("Tokens saved successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading website...</p>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Website Not Found</h1>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    )
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <CryptoPayment
          amount={paymentService === "domain" ? 5 : 10}
          service={paymentService}
          projectId={website.id}
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
              <Button variant="ghost" onClick={() => router.push("/")}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Website Editor</h1>
                <p className="text-sm text-gray-500">Generated {new Date(website.created_at).toLocaleDateString()}</p>
              </div>
              <Badge variant="secondary">{website.tokens_used} tokens used</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={isDeploying || !vercelToken}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="deploy">
              <Rocket className="w-4 h-4 mr-2" />
              Deploy & GitHub
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Website Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    {deploymentUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Live
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={loadWebsite}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-gray-600">{deploymentUrl || "Preview Mode"}</div>
                  </div>
                  <div className="aspect-video">
                    {deploymentUrl ? (
                      <iframe
                        src={deploymentUrl}
                        className="w-full h-full"
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Deploy your website to see the live preview</p>
                          <Button onClick={handleDeploy} disabled={isDeploying || !vercelToken}>
                            <Rocket className="w-4 h-4 mr-2" />
                            {!vercelToken ? "Configure Vercel Token" : "Deploy Now"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* File Explorer */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">Files</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {website.files.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => {
                          setSelectedFile(file.path)
                          setFileContent(file.content)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          selectedFile === file.path ? "bg-purple-50 text-purple-600 border-r-2 border-purple-600" : ""
                        }`}
                      >
                        {file.path}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono">{selectedFile}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(fileContent)}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" onClick={handleSaveFile} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-96 font-mono text-sm resize-none"
                    placeholder="Select a file to edit..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deploy">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deployment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!vercelToken && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Vercel token required</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">Configure your Vercel token in Settings to deploy.</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="custom-domain">Custom Domain (Optional - $5)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="custom-domain"
                        placeholder="yourdomain.com"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                      />
                      {customDomain && !domainPaymentId && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setPaymentService("domain")
                            setShowPayment(true)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Pay $5
                        </Button>
                      )}
                      {domainPaymentId && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Paid
                        </Badge>
                      )}
                    </div>
                  </div>

                  {deploymentUrl && (
                    <div>
                      <Label>Current Deployment</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={deploymentUrl} readOnly />
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(deploymentUrl)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleDeploy} disabled={isDeploying || !vercelToken} className="w-full">
                    <Rocket className="w-4 h-4 mr-2" />
                    {isDeploying ? "Deploying..." : deploymentUrl ? "Redeploy" : "Deploy"}
                  </Button>
                </CardContent>
              </Card>

              {/* GitHub Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    GitHub Integration ($10)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!githubToken && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">GitHub token required</span>
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        Configure your GitHub token in Settings to push code.
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="github-repo">Repository Name</Label>
                    <Input
                      id="github-repo"
                      placeholder="my-website"
                      value={githubRepo}
                      onChange={(e) => setGithubRepo(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">GitHub Push Access</span>
                    {githubPaymentId ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setPaymentService("github")
                          setShowPayment(true)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pay $10
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={handleGitHubPush}
                    disabled={!githubRepo || !githubToken || !githubPaymentId}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Push to GitHub
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Create at{" "}
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

                  <div>
                    <Label htmlFor="vercel-token">Vercel Access Token</Label>
                    <Input
                      id="vercel-token"
                      type="password"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={vercelToken}
                      onChange={(e) => setVercelToken(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Create at{" "}
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

                  <Button onClick={saveTokens} className="w-full">
                    Save Tokens
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Original Prompt</Label>
                    <Textarea value={website.prompt} readOnly className="mt-1 bg-gray-50" rows={3} />
                  </div>

                  <div>
                    <Label>Project ID</Label>
                    <Input value={website.id} readOnly className="mt-1 bg-gray-50" />
                  </div>

                  <div>
                    <Label>Created</Label>
                    <Input value={new Date(website.created_at).toLocaleString()} readOnly className="mt-1 bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Custom Domain</span>
                        {domainPaymentId ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge variant="secondary">Not Paid</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>GitHub Integration</span>
                        {githubPaymentId ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge variant="secondary">Not Paid</Badge>
                        )}
                      </div>
                    </div>
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
