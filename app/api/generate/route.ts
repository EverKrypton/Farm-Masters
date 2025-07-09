import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, language } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Simulate AI generation process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate project name from prompt
    const projectName =
      prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 30) || "genui-website"

    // Generate website structure based on language
    const websiteData = generateWebsiteStructure(prompt, model, language, projectName)

    return NextResponse.json({
      success: true,
      website: websiteData,
    })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate website",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateWebsiteStructure(prompt: string, model: string, language: string, projectName: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const websiteId = Date.now().toString()

  // Generate different structures based on language
  let files: any = {}
  let dependencies: any = {}
  let devDependencies: any = {}

  switch (language) {
    case "nextjs":
      files = generateNextJSStructure(prompt, model)
      dependencies = {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        typescript: "^5.0.0",
        tailwindcss: "^3.3.0",
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
      }
      devDependencies = {
        autoprefixer: "^10.0.0",
        postcss: "^8.0.0",
        eslint: "^8.0.0",
        "eslint-config-next": "^14.0.0",
      }
      break

    case "react":
      files = generateReactStructure(prompt, model)
      dependencies = {
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "react-scripts": "^5.0.0",
        typescript: "^5.0.0",
        tailwindcss: "^3.3.0",
      }
      devDependencies = {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        autoprefixer: "^10.0.0",
        postcss: "^8.0.0",
      }
      break

    case "vue":
      files = generateVueStructure(prompt, model)
      dependencies = {
        vue: "^3.3.0",
        "@vitejs/plugin-vue": "^4.0.0",
        vite: "^4.0.0",
        typescript: "^5.0.0",
        tailwindcss: "^3.3.0",
      }
      break

    default:
      files = generateNextJSStructure(prompt, model)
      dependencies = {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
      }
  }

  return {
    id: websiteId,
    name: projectName,
    description: prompt,
    language: language,
    model: model,
    files: files,
    dependencies: dependencies,
    devDependencies: devDependencies,
    hostedUrl: `https://${projectName}.0xhub.pro`,
    npxCommand: `npx @genui/${projectName}@latest`,
    createdAt: new Date().toISOString(),
    stats: {
      totalFiles: countFiles(files),
      totalFolders: countFolders(files),
      linesOfCode: countLinesOfCode(files),
      features: generateFeaturesList(prompt, model),
    },
  }
}

function generateNextJSStructure(prompt: string, model: string) {
  const isPortfolio = prompt.toLowerCase().includes("portfolio")
  const isDark = prompt.toLowerCase().includes("dark")
  const isModern = prompt.toLowerCase().includes("modern")

  return {
    "package.json": {
      type: "file",
      content: JSON.stringify(
        {
          name: "genui-website",
          version: "1.0.0",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
          },
          dependencies: {
            next: "^14.0.0",
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            typescript: "^5.0.0",
            tailwindcss: "^3.3.0",
          },
        },
        null,
        2,
      ),
    },
    app: {
      type: "folder",
      children: {
        "layout.tsx": {
          type: "file",
          content: `import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${prompt}',
  description: 'Generated with GenUI - AI-Powered Website Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
        },
        "page.tsx": {
          type: "file",
          content: generatePageContent(prompt, model, isDark, isPortfolio, isModern),
        },
        "globals.css": {
          type: "file",
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, sans-serif;
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-hover {
  transition: transform 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-4px);
}`,
        },
      },
    },
    "tailwind.config.js": {
      type: "file",
      content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}`,
    },
    "next.config.js": {
      type: "file",
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig`,
    },
    "README.md": {
      type: "file",
      content: `# ${prompt}

Generated with GenUI - AI-Powered Website Generator

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Generated with AI

## Deployment

Deploy easily on Vercel, Netlify, or any hosting platform that supports Next.js.

## Generated by GenUI

This website was generated using GenUI's AI-powered website generator.
Visit [0xhub.pro](https://0xhub.pro) to create your own website.
`,
    },
  }
}

function generateReactStructure(prompt: string, model: string) {
  return {
    "package.json": {
      type: "file",
      content: JSON.stringify(
        {
          name: "genui-react-app",
          version: "1.0.0",
          private: true,
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "^5.0.0",
            typescript: "^5.0.0",
            tailwindcss: "^3.3.0",
          },
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject",
          },
        },
        null,
        2,
      ),
    },
    public: {
      type: "folder",
      children: {
        "index.html": {
          type: "file",
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${prompt}" />
    <title>${prompt}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
        },
      },
    },
    src: {
      type: "folder",
      children: {
        "App.tsx": {
          type: "file",
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ${prompt}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with GenUI - AI-Powered Website Generator
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="text-gray-700">
              This React application was generated by GenUI's AI. 
              Customize this content to match your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;`,
        },
        "index.tsx": {
          type: "file",
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        },
        "App.css": {
          type: "file",
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        },
        "index.css": {
          type: "file",
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
        },
      },
    },
  }
}

function generateVueStructure(prompt: string, model: string) {
  return {
    "package.json": {
      type: "file",
      content: JSON.stringify(
        {
          name: "genui-vue-app",
          version: "1.0.0",
          private: true,
          scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview",
          },
          dependencies: {
            vue: "^3.3.0",
          },
          devDependencies: {
            "@vitejs/plugin-vue": "^4.0.0",
            vite: "^4.0.0",
            typescript: "^5.0.0",
            tailwindcss: "^3.3.0",
          },
        },
        null,
        2,
      ),
    },
    "index.html": {
      type: "file",
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${prompt}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
    },
    src: {
      type: "folder",
      children: {
        "App.vue": {
          type: "file",
          content: `<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          ${prompt}
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Built with GenUI - AI-Powered Website Generator
        </p>
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">Welcome to Vue</h2>
          <p class="text-gray-700">
            This Vue.js application was generated by GenUI's AI. 
            Customize this content to match your needs.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Your Vue.js logic here
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>`,
        },
        "main.ts": {
          type: "file",
          content: `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`,
        },
        "style.css": {
          type: "file",
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        },
      },
    },
  }
}

function generatePageContent(prompt: string, model: string, isDark: boolean, isPortfolio: boolean, isModern: boolean) {
  const bgClass = isDark ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-100"
  const textClass = isDark ? "text-white" : "text-gray-900"
  const cardClass = isDark ? "bg-gray-800 text-white" : "bg-white"

  if (isPortfolio) {
    return `export default function HomePage() {
  return (
    <div className="min-h-screen ${bgClass}">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold ${textClass} mb-4">
            Portfolio
          </h1>
          <p className="text-xl ${isDark ? "text-gray-300" : "text-gray-600"} mb-8">
            ${prompt}
          </p>
        </div>

        {/* About Section */}
        <div className="${cardClass} rounded-lg shadow-lg p-8 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold mb-6">About Me</h2>
          <p className="${isDark ? "text-gray-300" : "text-gray-700"} text-lg leading-relaxed">
            Welcome to my portfolio. This website was generated using GenUI's AI-powered 
            website generator. Customize this content to showcase your skills, experience, 
            and projects.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((project) => (
            <div key={project} className="${cardClass} rounded-lg shadow-lg p-6 card-hover">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
              <p className="${isDark ? "text-gray-300" : "text-gray-600"} mb-4">
                Description of project {project}. Add your real project details here.
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                View Project
              </button>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="${cardClass} rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Get In Touch</h2>
          <p className="${isDark ? "text-gray-300" : "text-gray-700"} mb-6">
            Interested in working together? Let's connect!
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all">
            Contact Me
          </button>
        </div>
      </div>
    </div>
  )
}`
  }

  return `export default function HomePage() {
  return (
    <div className="min-h-screen ${bgClass}">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold ${textClass} mb-4">
            ${prompt}
          </h1>
          <p className="text-xl ${isDark ? "text-gray-300" : "text-gray-600"} mb-8">
            Built with GenUI - AI-Powered Website Generator
          </p>
          <div className="${cardClass} rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="${isDark ? "text-gray-300" : "text-gray-700"}">
              This website was generated by GenUI's AI based on your prompt: "${prompt}". 
              You can now customize this content, add more pages, and deploy it anywhere.
            </p>
            <div className="mt-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mr-4 transition-colors">
                Get Started
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`
}

function countFiles(files: any): number {
  let count = 0
  for (const [name, item] of Object.entries(files)) {
    if ((item as any).type === "file") {
      count++
    } else if ((item as any).type === "folder" && (item as any).children) {
      count += countFiles((item as any).children)
    }
  }
  return count
}

function countFolders(files: any): number {
  let count = 0
  for (const [name, item] of Object.entries(files)) {
    if ((item as any).type === "folder") {
      count++
      if ((item as any).children) {
        count += countFolders((item as any).children)
      }
    }
  }
  return count
}

function countLinesOfCode(files: any): number {
  let count = 0
  for (const [name, item] of Object.entries(files)) {
    if ((item as any).type === "file" && (item as any).content) {
      count += (item as any).content.split("\n").length
    } else if ((item as any).type === "folder" && (item as any).children) {
      count += countLinesOfCode((item as any).children)
    }
  }
  return count
}

function generateFeaturesList(prompt: string, model: string): string[] {
  const baseFeatures = ["Responsive Design", "SEO Optimized", "Fast Performance", "Modern UI/UX"]

  if (prompt.toLowerCase().includes("portfolio")) {
    baseFeatures.push("Project Showcase", "Contact Form", "About Section")
  }

  if (prompt.toLowerCase().includes("dark")) {
    baseFeatures.push("Dark Theme", "Theme Toggle")
  }

  if (model === "pro-ai") {
    baseFeatures.push("Advanced Animations", "Custom Components", "Performance Optimized")
  }

  return baseFeatures
}
