import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In-memory storage for demo (use a real database in production)
export const projects = new Map<string, any>()

interface V0GenerateRequest {
  prompt: string
  userId?: string
}

function extractCodeBlocks(content: string): Array<{ language: string; code: string; filename?: string }> {
  const codeBlockRegex = /```(\w+)(?:\s+file="([^"]+)")?\n([\s\S]*?)```/g
  const blocks: Array<{ language: string; code: string; filename?: string }> = []

  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1],
      code: match[3],
      filename: match[2],
    })
  }

  return blocks
}

function generateFileStructure(codeBlocks: Array<{ language: string; code: string; filename?: string }>) {
  const files: Array<{ path: string; content: string }> = []

  // Add package.json if not present
  const hasPackageJson = codeBlocks.some((block) => block.filename === "package.json")
  if (!hasPackageJson) {
    files.push({
      path: "package.json",
      content: JSON.stringify(
        {
          name: "generated-website",
          version: "1.0.0",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
          },
          dependencies: {
            next: "14.0.4",
            react: "^18",
            "react-dom": "^18",
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            autoprefixer: "^10.0.1",
            postcss: "^8",
            tailwindcss: "^3.3.0",
            typescript: "^5",
          },
        },
        null,
        2,
      ),
    })
  }

  // Process code blocks
  codeBlocks.forEach((block) => {
    if (block.filename) {
      files.push({
        path: block.filename,
        content: block.code,
      })
    } else {
      // Default file based on language
      let defaultPath = "app/page.tsx"
      if (block.language === "css") defaultPath = "app/globals.css"
      if (block.language === "json") defaultPath = "package.json"

      files.push({
        path: defaultPath,
        content: block.code,
      })
    }
  })

  return files
}

async function callV0Api(prompt: string): Promise<any> {
  const apiKey = process.env.V0_API_KEY
  if (!apiKey) {
    throw new Error("V0 API key not configured")
  }

  try {
    // Use the correct v0.dev API endpoint
    const response = await fetch("https://api.v0.dev/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "v0-1.5-md",
      }),
      signal: AbortSignal.timeout(60000), // 60 seconds timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("V0 API Error:", response.status, errorText)
      throw new Error(`V0 API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Extract the generated content
    const generatedContent = data.choices?.[0]?.message?.content || data.content || JSON.stringify(data)

    // Parse the generated content to extract code blocks
    const codeBlocks = extractCodeBlocks(generatedContent)

    return {
      id: uuidv4(),
      prompt,
      content: generatedContent,
      code_blocks: codeBlocks,
      files: generateFileStructure(codeBlocks),
      preview_url: null,
      created_at: new Date().toISOString(),
      tokens_used: data.usage?.total_tokens || 0,
    }
  } catch (error) {
    console.error("V0 API call failed:", error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error when connecting to v0.dev API. Please check your internet connection.")
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request to v0.dev API timed out. Please try again later.")
    }

    throw error
  }
}

// Fallback function to generate mock data if the API call fails
function generateMockResponse(prompt: string): any {
  console.log("Using mock response for prompt:", prompt)

  const mockNextJsCode = `
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GeneratedWebsite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Your Website</h1>
          <p className="text-xl text-gray-600 mb-8">
            Generated from: "${prompt}"
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Feature One</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Amazing feature description here.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Two</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Another great feature description.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Three</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Third amazing feature description.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
  `

  return {
    id: uuidv4(),
    prompt,
    content: mockNextJsCode,
    code_blocks: [
      {
        language: "tsx",
        code: mockNextJsCode,
        filename: "app/page.tsx",
      },
    ],
    files: [
      {
        path: "app/page.tsx",
        content: mockNextJsCode,
      },
      {
        path: "package.json",
        content: JSON.stringify(
          {
            name: "generated-website",
            version: "1.0.0",
            private: true,
            scripts: {
              dev: "next dev",
              build: "next build",
              start: "next start",
              lint: "next lint",
            },
            dependencies: {
              next: "14.0.4",
              react: "^18",
              "react-dom": "^18",
              "@types/node": "^20",
              "@types/react": "^18",
              "@types/react-dom": "^18",
              autoprefixer: "^10.0.1",
              postcss: "^8",
              tailwindcss: "^3.3.0",
              typescript: "^5",
            },
          },
          null,
          2,
        ),
      },
    ],
    preview_url: null,
    created_at: new Date().toISOString(),
    tokens_used: 0,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId }: V0GenerateRequest = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required and cannot be empty" }, { status: 400 })
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: "Prompt is too long. Maximum 2000 characters allowed." }, { status: 400 })
    }

    let generatedWebsite

    try {
      // Try to generate website using v0.dev API
      generatedWebsite = await callV0Api(prompt)
    } catch (apiError) {
      console.error("V0 API error, falling back to mock data:", apiError)
      // If the API call fails, use the fallback mock data
      generatedWebsite = generateMockResponse(prompt)
    }

    // Store the project in memory for demo purposes
    projects.set(generatedWebsite.id, generatedWebsite)

    return NextResponse.json({
      success: true,
      data: generatedWebsite,
    })
  } catch (error) {
    console.error("Website generation error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to generate website. Please try again." }, { status: 500 })
  }
}
