"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, ExternalLink, AlertCircle } from "lucide-react"

interface LivePreviewProps {
  websiteData: any
  onError?: (error: string | null) => void
}

export default function LivePreview({ websiteData, onError }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  useEffect(() => {
    if (websiteData) {
      generatePreview()
    }
  }, [websiteData])

  const generatePreview = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate preview generation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate preview URL
      const previewId = websiteData.id || Date.now().toString()
      const generatedUrl = `https://preview-${previewId}.0xhub.pro`
      setPreviewUrl(generatedUrl)

      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate preview"
      setError(errorMessage)
      onError?.(errorMessage)
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    generatePreview()
  }

  const handleOpenExternal = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 h-full">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-400">Generating live preview...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800 h-full">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-medium mb-2">Preview Error</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800 h-full">
      <CardContent className="p-0 h-full">
        {/* Preview Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRefresh}
              className="text-gray-400 hover:text-white p-1 h-auto"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleOpenExternal}
              className="text-gray-400 hover:text-white p-1 h-auto"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Address Bar */}
        <div className="px-3 py-2 bg-gray-800 border-b border-gray-700">
          <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300 font-mono">{previewUrl}</div>
        </div>

        {/* Preview Content */}
        <div className="relative h-full bg-white">
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load preview")
              onError?.("Failed to load preview")
            }}
          />

          {/* Overlay for demo purposes */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{websiteData?.name || "Generated Website"}</h1>
              <p className="text-gray-600 mb-6">
                {websiteData?.description || "This is a preview of your generated website"}
              </p>
              <div className="space-y-3">
                <div className="bg-gray-100 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Framework:</strong> {websiteData?.language || "Next.js"}
                  </p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Files:</strong> {websiteData?.stats?.totalFiles || 0}
                  </p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Status:</strong> <span className="text-green-600">Ready for NPX install</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  This is a demo preview. Your actual website will be fully functional after NPX installation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
