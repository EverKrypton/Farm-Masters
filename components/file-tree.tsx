"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileTreeProps {
  files: any
  onFileSelect?: (filePath: string) => void
  selectedFile?: string | null
}

interface FileTreeItemProps {
  name: string
  item: any
  path: string
  level: number
  onFileSelect?: (filePath: string) => void
  selectedFile?: string | null
}

function FileTreeItem({ name, item, path, level, onFileSelect, selectedFile }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
  const isFolder = item.type === "folder"
  const isSelected = selectedFile === path
  const hasChildren = isFolder && item.children && Object.keys(item.children).length > 0

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect?.(path)
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "tsx":
      case "jsx":
        return "⚛️"
      case "ts":
      case "js":
        return "📜"
      case "css":
        return "🎨"
      case "json":
        return "📋"
      case "md":
        return "📝"
      case "html":
        return "🌐"
      case "svg":
        return "🖼️"
      default:
        return "📄"
    }
  }

  return (
    <div>
      <Button
        variant="ghost"
        className={`w-full justify-start h-auto p-1 px-2 text-left hover:bg-gray-800 ${
          isSelected ? "bg-gray-800 text-white" : "text-gray-300"
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isFolder ? (
            <>
              {hasChildren && (
                <div className="flex-shrink-0">
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
              )}
              <div className="flex-shrink-0">
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-400" />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-3 h-3 flex-shrink-0" /> {/* Spacer for alignment */}
              <div className="flex-shrink-0">
                <span className="text-sm">{getFileIcon(name)}</span>
              </div>
            </>
          )}
          <span className="text-sm truncate">{name}</span>
        </div>
      </Button>

      {isFolder && isExpanded && hasChildren && (
        <div>
          {Object.entries(item.children).map(([childName, childItem]) => (
            <FileTreeItem
              key={childName}
              name={childName}
              item={childItem}
              path={`${path}/${childName}`}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileTree({ files, onFileSelect, selectedFile }: FileTreeProps) {
  if (!files || Object.keys(files).length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No files to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {Object.entries(files).map(([name, item]) => (
        <FileTreeItem
          key={name}
          name={name}
          item={item}
          path={name}
          level={0}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  )
}
