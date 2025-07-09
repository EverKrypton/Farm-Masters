import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { websiteData, projectName } = await request.json()

    if (!websiteData) {
      return NextResponse.json({ error: "Website data is required" }, { status: 400 })
    }

    // Create ZIP content as text (in a real app, use JSZip library)
    const zipContent = generateZipContent(websiteData, projectName)

    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectName || "website"}.zip"`,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate download",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateZipContent(websiteData: any, projectName: string): string {
  // In a real implementation, this would create an actual ZIP file
  // For now, return a text representation
  let content = `# ${projectName || "Generated Website"}\n\n`
  content += `Generated with GenUI\n\n`
  content += `## Files:\n\n`

  function processFiles(files: any, basePath = ""): string {
    let result = ""

    Object.entries(files).forEach(([name, item]: [string, any]) => {
      const fullPath = basePath ? `${basePath}/${name}` : name

      if (item.type === "folder") {
        result += `📁 ${fullPath}/\n`
        if (item.children) {
          result += processFiles(item.children, fullPath)
        }
      } else {
        result += `📄 ${fullPath}\n`
        result += `${item.content}\n\n---\n\n`
      }
    })

    return result
  }

  content += processFiles(websiteData.files || {})

  return content
}
