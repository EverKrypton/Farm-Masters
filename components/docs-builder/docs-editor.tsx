"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bold, Italic, ImageIcon, ImageIcon as ImageIcon2, Code, List, ListOrdered, Quote, Crown } from "lucide-react"

interface DocsEditorProps {
  docsData: any
  onUpdate: (data: any) => void
  isPremium: boolean
  onUpgrade: () => void
}

export function DocsEditor({ docsData, onUpdate, isPremium, onUpgrade }: DocsEditorProps) {
  const currentPage = docsData.pages.find((page: any) => page.id === docsData.currentPageId)
  const [content, setContent] = useState(currentPage?.content || "")

  const updatePageContent = (newContent: string) => {
    setContent(newContent)

    const updatedPages = docsData.pages.map((page: any) =>
      page.id === docsData.currentPageId ? { ...page, content: newContent } : page,
    )

    onUpdate({
      ...docsData,
      pages: updatedPages,
    })
  }

  const insertMarkdown = (markdown: string) => {
    if (!isPremium && markdown !== "**bold**" && markdown !== "*italic*") {
      onUpgrade()
      return
    }

    const textarea = document.querySelector("textarea")
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + markdown + content.substring(end)
      updatePageContent(newContent)

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + markdown.length, start + markdown.length)
      }, 0)
    }
  }

  const toolbarItems = [
    { icon: Bold, label: "Bold", markdown: "**bold**", premium: false },
    { icon: Italic, label: "Italic", markdown: "*italic*", premium: false },
    { icon: ImageIcon, label: "Link", markdown: "[link text](url)", premium: true },
    { icon: ImageIcon2, label: "Image", markdown: "![alt text](image-url)", premium: true },
    { icon: Code, label: "Code", markdown: "`code`", premium: true },
    { icon: List, label: "Bullet List", markdown: "- item", premium: true },
    { icon: ListOrdered, label: "Numbered List", markdown: "1. item", premium: true },
    { icon: Quote, label: "Quote", markdown: "> quote", premium: true },
  ]

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">Select a page to start editing</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2 flex-wrap">
          {toolbarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown(item.markdown)}
              disabled={item.premium && !isPremium}
              className="relative"
            >
              <item.icon className="w-4 h-4" />
              {item.premium && !isPremium && <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Markdown Editor */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Editor</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => updatePageContent(e.target.value)}
                placeholder="Start writing your documentation in Markdown..."
                className="h-full resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
                    .replace(/\*(.*)\*/gim, "<em>$1</em>")
                    .replace(/`(.*)`/gim, "<code>$1</code>")
                    .replace(/\n/gim, "<br>"),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
