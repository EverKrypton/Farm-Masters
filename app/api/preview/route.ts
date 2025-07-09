import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    // Generate a secure preview HTML
    const previewHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenUI Component Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f9fafb;
    }
    .error { 
      color: #dc2626; 
      background: #fef2f2; 
      padding: 1rem; 
      border-radius: 0.5rem; 
      border: 1px solid #fecaca;
      margin: 1rem 0;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">Loading component...</div>
  </div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;
    
    try {
      // Inject the component code
      ${code}
      
      // Try to render the component
      const root = document.getElementById('root');
      
      // Clear loading message
      root.innerHTML = '';
      
      // Create React root and render
      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(React.createElement(GeneratedComponent || ComponentName || (() => React.createElement('div', {}, 'Component rendered successfully'))));
      
    } catch (error) {
      console.error('Preview rendering error:', error);
      document.getElementById('root').innerHTML = 
        '<div class="error"><strong>Rendering Error:</strong><br>' + error.message + '</div>';
    }
  </script>
</body>
</html>`

    return NextResponse.json({
      success: true,
      html: previewHtml,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Preview generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate preview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
