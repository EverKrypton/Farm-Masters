"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Menu, Home } from "lucide-react"

interface DocsPreviewProps {
  docsData: any
}

export function DocsPreview({ docsData }: DocsPreviewProps) {
  const currentPage = docsData.pages.find((page: any) => page.id === docsData.currentPageId)

  return (
    <div className="h-full bg-white">
      {/* Preview Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">{docsData.title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search docs..." className="pl-10 w-64" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {docsData.pages.map((page: any) => (
              <Button
                key={page.id}
                variant={docsData.currentPageId === page.id ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                {page.title}
              </Button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {currentPage && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: currentPage.content
                    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-4 mt-8">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-3 mt-6">$1</h3>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
                    .replace(/`(.*)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
                    .replace(/\n\n/gim, '</p><p class="mb-4">')
                    .replace(/\n/gim, "<br>"),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
