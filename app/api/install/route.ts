import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectName = searchParams.get("project") || "genui-website"
  const websiteId = searchParams.get("id")

  if (!websiteId) {
    return NextResponse.json({ error: "Website ID is required" }, { status: 400 })
  }

  // Generate comprehensive NPX installation script
  const installScript = generateInstallScript(projectName, websiteId)

  return new NextResponse(installScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Content-Disposition": `attachment; filename="install-${projectName}.js"`,
      "Cache-Control": "no-cache",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { projectName, websiteData } = await request.json()

    if (!projectName || !websiteData) {
      return NextResponse.json({ error: "Project name and website data are required" }, { status: 400 })
    }

    // Generate NPX package information
    const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    const packageName = `@genui/${sanitizedName}`
    const installCommand = `npx ${packageName}@latest`

    // Create installation package metadata
    const installPackage = {
      name: packageName,
      version: "1.0.0",
      description: `GenUI generated project: ${projectName}`,
      main: "install.js",
      bin: {
        [sanitizedName]: "./install.js",
      },
      scripts: {
        postinstall: "node install.js",
      },
      keywords: ["genui", "website", "generator", "0xhub", websiteData.language.toLowerCase()],
      author: "GenUI <support@0xhub.pro>",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/0xhub/genui-projects.git",
      },
      homepage: "https://0xhub.pro",
      dependencies: websiteData.dependencies || {},
      devDependencies: websiteData.devDependencies || {},
    }

    return NextResponse.json({
      success: true,
      package: installPackage,
      installCommand,
      alternativeCommands: [
        `npm create genui@latest ${sanitizedName}`,
        `yarn create genui ${sanitizedName}`,
        `pnpm create genui ${sanitizedName}`,
      ],
      websiteUrl: websiteData.hostedUrl,
      installScript: generateInstallScript(sanitizedName, websiteData.id),
    })
  } catch (error) {
    console.error("Install package generation error:", error)
    return NextResponse.json({ error: "Failed to generate install package" }, { status: 500 })
  }
}

function generateInstallScript(projectName: string, websiteId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return `#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 GenUI Project Installer v1.0');
console.log('📦 Installing ${projectName}...');
console.log('Platform:', os.platform(), os.arch());
console.log('Node.js:', process.version);
console.log('');

async function downloadAndSetup() {
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      console.warn('⚠️  Node.js 16+ recommended. Current version:', nodeVersion);
      console.log('   Visit https://nodejs.org/ to upgrade');
    } else {
      console.log('✅ Node.js version check passed');
    }

    // Check npm availability
    try {
      execSync('npm --version', { stdio: 'pipe' });
      console.log('✅ npm is available');
    } catch (error) {
      throw new Error('npm is not available. Please install Node.js with npm.');
    }

    console.log('');
    console.log('⬇️  Downloading project files from GenUI...');
    
    // Create project directory
    const projectDir = '${projectName}';
    if (fs.existsSync(projectDir)) {
      console.log('📁 Project directory already exists, using existing...');
    } else {
      fs.mkdirSync(projectDir, { recursive: true });
      console.log('📁 Created project directory:', projectDir);
    }
    
    process.chdir(projectDir);
    console.log('📂 Changed to project directory');
    
    // Download project data from GenUI API
    console.log('🌐 Fetching project data...');
    const projectData = await fetchProjectData('${websiteId}');
    
    if (!projectData || !projectData.website) {
      throw new Error('Failed to fetch project data from GenUI');
    }

    console.log('✅ Project data downloaded successfully');
    console.log('');
    
    // Create project files
    console.log('📁 Creating project structure...');
    await createProjectFiles(projectData.website.files || {});
    console.log('✅ Project files created');
    
    // Create or update package.json
    const packageJsonPath = 'package.json';
    let packageJson;
    
    if (fs.existsSync(packageJsonPath)) {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } else {
      packageJson = {
        name: '${projectName}',
        version: '1.0.0',
        private: true,
        description: projectData.website.description || 'Generated with GenUI',
      };
    }
    
    // Merge scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      dev: getDevScript(projectData.website.language),
      build: getBuildScript(projectData.website.language),
      start: getStartScript(projectData.website.language),
      lint: getLintScript(projectData.website.language),
    };
    
    // Merge dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...projectData.website.dependencies,
    };
    
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...projectData.website.devDependencies,
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json configured');
    
    // Install dependencies
    console.log('');
    console.log('📦 Installing dependencies...');
    console.log('   This may take a few minutes...');
    
    try {
      console.log('   Running: npm install');
      execSync('npm install', { 
        stdio: 'inherit',
        timeout: 600000, // 10 minutes timeout
        env: { ...process.env, NODE_ENV: 'development' }
      });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.log('⚠️  Standard installation failed, trying alternative methods...');
      
      // Try with legacy peer deps for compatibility
      try {
        console.log('   Trying: npm install --legacy-peer-deps');
        execSync('npm install --legacy-peer-deps', { stdio: 'inherit', timeout: 600000 });
        console.log('✅ Dependencies installed with fallback method');
      } catch (fallbackError) {
        console.error('❌ Installation failed with all methods');
        console.log('');
        console.log('💡 Manual installation steps:');
        console.log('   1. npm install --legacy-peer-deps');
        console.log('   2. npm run dev');
        console.log('');
        throw new Error('Dependency installation failed');
      }
    }
    
    // Setup environment files
    console.log('');
    console.log('🔧 Setting up environment...');
    await setupEnvironment(projectData.website.language);
    console.log('✅ Environment configured');
    
    // Final setup and verification
    console.log('');
    console.log('🔍 Verifying installation...');
    await verifyInstallation(projectData.website.language);
    
    console.log('');
    console.log('🎉 Installation completed successfully!');
    console.log('');
    console.log('📋 Project Information:');
    console.log('   Name: ${projectName}');
    console.log('   Framework:', projectData.website.language);
    console.log('   Files:', projectData.website.stats?.totalFiles || 'N/A');
    console.log('   Generated:', new Date().toLocaleDateString());
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   cd ${projectName}');
    console.log('   npm run dev');
    console.log('');
    console.log('🌐 Your app will be available at:');
    console.log('   http://localhost:3000');
    console.log('');
    console.log('📚 Resources:');
    console.log('   Documentation: https://0xhub.pro/docs');
    console.log('   Support: https://0xhub.pro/support');
    console.log('   GitHub: https://github.com/0xhub/genui');
    console.log('');
    console.log('✨ Happy coding!');
    
  } catch (error) {
    console.error('');
    console.error('❌ Installation failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure Node.js 16+ is installed');
    console.log('   2. Check internet connection');
    console.log('   3. Try running with --verbose flag');
    console.log('   4. Clear npm cache: npm cache clean --force');
    console.log('');
    console.log('💡 Manual installation:');
    console.log('   1. Visit https://0xhub.pro');
    console.log('   2. Generate your website again');
    console.log('   3. Use the provided installation command');
    console.log('');
    console.log('🆘 Need help?');
    console.log('   Email: support@0xhub.pro');
    console.log('   Discord: https://discord.gg/genui');
    console.log('');
    process.exit(1);
  }
}

async function fetchProjectData(websiteId) {
  return new Promise((resolve, reject) => {
    const url = '${baseUrl}/api/websites/' + websiteId + '/install';
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'GenUI-NPX-Installer/1.0',
        'Accept': 'application/json'
      },
      timeout: 30000
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Invalid JSON response from server'));
        }
      });
    });
    
    request.on('error', (error) => {
      reject(new Error('Network error: ' + error.message));
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout - please check your internet connection'));
    });
  });
}

async function createProjectFiles(files, basePath = '') {
  for (const [name, item] of Object.entries(files)) {
    const fullPath = path.join(basePath, name);
    
    try {
      if (item.type === 'folder') {
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        if (item.children) {
          await createProjectFiles(item.children, fullPath);
        }
      } else if (item.type === 'file') {
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, item.content || '');
      }
    } catch (error) {
      console.warn('⚠️  Warning: Could not create', fullPath, ':', error.message);
    }
  }
}

function getDevScript(language) {
  switch (language) {
    case 'nextjs': return 'next dev';
    case 'react': return 'react-scripts start';
    case 'vue': return 'vite';
    case 'angular': return 'ng serve';
    case 'svelte': return 'vite dev';
    default: return 'next dev';
  }
}

function getBuildScript(language) {
  switch (language) {
    case 'nextjs': return 'next build';
    case 'react': return 'react-scripts build';
    case 'vue': return 'vite build';
    case 'angular': return 'ng build';
    case 'svelte': return 'vite build';
    default: return 'next build';
  }
}

function getStartScript(language) {
  switch (language) {
    case 'nextjs': return 'next start';
    case 'react': return 'serve -s build';
    case 'vue': return 'vite preview';
    case 'angular': return 'ng serve --prod';
    case 'svelte': return 'vite preview';
    default: return 'next start';
  }
}

function getLintScript(language) {
  switch (language) {
    case 'nextjs': return 'next lint';
    case 'react': return 'react-scripts test --watchAll=false';
    case 'vue': return 'vue-tsc --noEmit';
    case 'angular': return 'ng lint';
    case 'svelte': return 'svelte-check';
    default: return 'next lint';
  }
}

async function setupEnvironment(language) {
  // Create .env.local for Next.js projects
  if (language === 'nextjs' && !fs.existsSync('.env.local')) {
    const envContent = \`# Environment variables for \${language}
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Add your environment variables here
# NEXT_PUBLIC_CUSTOM_VAR=your_value
\`;
    fs.writeFileSync('.env.local', envContent);
  }
  
  // Create .env for other frameworks
  if (language !== 'nextjs' && !fs.existsSync('.env')) {
    const envContent = \`# Environment variables for \${language}
VITE_BASE_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api

# Add your environment variables here
# VITE_CUSTOM_VAR=your_value
\`;
    fs.writeFileSync('.env', envContent);
  }
  
  // Create .gitignore if it doesn't exist
  if (!fs.existsSync('.gitignore')) {
    const gitignoreContent = \`# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
\`;
    fs.writeFileSync('.gitignore', gitignoreContent);
  }
}

async function verifyInstallation(language) {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }

  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    throw new Error('Dependencies not installed properly');
  }

  // Check if main files exist based on framework
  const mainFiles = {
    nextjs: ['app/page.tsx', 'app/layout.tsx'],
    react: ['src/App.tsx', 'src/index.tsx'],
    vue: ['src/App.vue', 'src/main.ts'],
    angular: ['src/app/app.component.ts'],
    svelte: ['src/App.svelte'],
  };

  const filesToCheck = mainFiles[language] || mainFiles['nextjs'];

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) {
      console.warn('⚠️  Warning: Expected file not found:', file);
    }
  }

  console.log('✅ Installation verification passed');
}

// Start the installation process
downloadAndSetup();`
}
