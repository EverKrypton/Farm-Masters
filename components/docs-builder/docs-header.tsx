"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, Edit, Share, Crown, Save, Settings } from "lucide-react"
import Link from "next/link"

interface DocsHeaderProps {
  docsData: any
  onUpdate: (data: any) => void
  isPremium: boolean
  onUpgrade: () => void
  isPreviewMode: boolean
  onTogglePreview: () => void
}

export function DocsHeader({
  docsData,
  onUpdate,
  isPremium,
  onUpgrade,
  isPreviewMode,
  onTogglePreview,
}: DocsHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Input
            value={docsData.title}
            onChange={(e) => onUpdate({ ...docsData, title: e.target.value })}
            className="text-xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
            placeholder="Documentation Title"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="ghost" size="sm" onClick={onTogglePreview}>
            {isPreviewMode ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>

          <Button variant="ghost" size="sm" disabled={!isPremium}>
            <Share className="w-4 h-4 mr-2" />
            Share {!isPremium && "(Pro)"}
          </Button>

          <Button variant="ghost" size="sm" disabled={!isPremium}>
            <Settings className="w-4 h-4 mr-2" />
            Settings {!isPremium && "(Pro)"}
          </Button>

          {!isPremium && (
            <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
