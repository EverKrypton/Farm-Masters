"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Search, FolderPlus, Crown, ChevronRight, ChevronDown } from "lucide-react"

interface DocsSidebarProps {
  docsData: any
  onUpdate: (data: any) => void
  isPremium: boolean
  onUpgrade: () => void
}

export function DocsSidebar({ docsData, onUpdate, isPremium, onUpgrade }: DocsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])

  const addNewPage = () => {
    const newPage = {
      id: Date.now().toString(),
      title: "New Page",
      content: "# New Page\n\nStart writing your content here...",
      children: [],
    }

    onUpdate({
      ...docsData,
      pages: [...docsData.pages, newPage],
      currentPageId: newPage.id,
    })
  }

  const addNewFolder = () => {
    if (!isPremium) {
      onUpgrade()
      return
    }

    const newFolder = {
      id: Date.now().toString(),
      title: "New Folder",
      content: "",
      children: [],
      isFolder: true,
    }

    onUpdate({
      ...docsData,
      pages: [...docsData.pages, newFolder],
    })
  }

  const selectPage = (pageId: string) => {
    onUpdate({
      ...docsData,
      currentPageId: pageId,
    })
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]))
  }

  const filteredPages = docsData.pages.filter((page: any) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button onClick={addNewPage} size="sm" className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
          <Button onClick={addNewFolder} size="sm" variant="outline" disabled={!isPremium}>
            <FolderPlus className="w-4 h-4" />
            {!isPremium && <Crown className="w-3 h-3 ml-1" />}
          </Button>
        </div>

        {/* Pages List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {filteredPages.map((page: any) => (
              <div key={page.id}>
                <Button
                  variant={docsData.currentPageId === page.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => (page.isFolder ? toggleFolder(page.id) : selectPage(page.id))}
                >
                  {page.isFolder ? (
                    expandedFolders.includes(page.id) ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {page.title}
                </Button>

                {page.isFolder && expandedFolders.includes(page.id) && (
                  <div className="ml-6 space-y-1">
                    {page.children?.map((child: any) => (
                      <Button
                        key={child.id}
                        variant={docsData.currentPageId === child.id ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => selectPage(child.id)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {child.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Premium Features */}
        {!isPremium && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Unlock Pro Features</h3>
              <p className="text-sm text-gray-600 mb-4">Get folders, custom domains, team collaboration, and more.</p>
              <Button onClick={onUpgrade} size="sm" className="w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
