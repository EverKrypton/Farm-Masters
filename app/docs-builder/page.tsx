"use client"

import { useState, useEffect } from "react"
import { DocsEditor } from "@/components/docs-builder/docs-editor"
import { DocsSidebar } from "@/components/docs-builder/docs-sidebar"
import { DocsHeader } from "@/components/docs-builder/docs-header"
import { DocsPreview } from "@/components/docs-builder/docs-preview"
import { PaymentModal } from "@/components/payment-modal"
import { SessionManager } from "@/lib/session-manager"

export default function DocsBuilder() {
  const [sessionId, setSessionId] = useState<string>("")
  const [isPremium, setIsPremium] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [docsData, setDocsData] = useState({
    title: "My Documentation",
    pages: [
      {
        id: "1",
        title: "Getting Started",
        content: "# Welcome to your documentation\n\nStart writing your content here...",
        children: [],
      },
    ],
    currentPageId: "1",
    settings: {
      theme: "light",
      customDomain: "",
      searchEnabled: true,
      collaborationEnabled: false,
    },
  })

  useEffect(() => {
    const session = SessionManager.getOrCreateSession()
    setSessionId(session.id)

    const savedDocs = SessionManager.getDocsData(session.id)
    if (savedDocs) {
      setDocsData(savedDocs)
    }

    setIsPremium(SessionManager.isPremiumSession(session.id))
  }, [])

  const handleDocsUpdate = (newData: any) => {
    setDocsData(newData)
    SessionManager.saveDocsData(sessionId, newData)
  }

  const handleUpgradeToPremium = () => {
    setShowPayment(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DocsHeader
        docsData={docsData}
        onUpdate={handleDocsUpdate}
        isPremium={isPremium}
        onUpgrade={handleUpgradeToPremium}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {!isPreviewMode && (
          <DocsSidebar
            docsData={docsData}
            onUpdate={handleDocsUpdate}
            isPremium={isPremium}
            onUpgrade={handleUpgradeToPremium}
          />
        )}

        <div className="flex-1">
          {isPreviewMode ? (
            <DocsPreview docsData={docsData} />
          ) : (
            <DocsEditor
              docsData={docsData}
              onUpdate={handleDocsUpdate}
              isPremium={isPremium}
              onUpgrade={handleUpgradeToPremium}
            />
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={() => {
          setIsPremium(true)
          SessionManager.upgradeToPremium(sessionId)
          setShowPayment(false)
        }}
      />
    </div>
  )
}
