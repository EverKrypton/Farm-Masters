# WebCraft Studio - AI Website Builder

A fully functional website builder that generates websites using AI, integrates with GitHub, deploys to Vercel, and accepts cryptocurrency payments.

## 🚀 Features

- **Free AI Website Generation** - Unlimited website creation using advanced AI
- **GitHub Integration** - Push code to repositories ($10 via ETH)
- **Vercel Deployment** - Deploy with custom domains ($5 via ETH for custom domains)
- **Crypto Payments** - Secure Ethereum-based payment system
- **Real-time Preview** - Live website preview and code editing
- **Responsive Design** - Modern, mobile-first interface

## 🛠️ Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd webcraft-studio
npm install
\`\`\`

### 2. Environment Configuration

Copy the `.env.local` file and update the following required variables:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

**Required Variables:**
- `V0_API_KEY` - Get from [v0.dev API](https://v0.dev/api)
- `MASTER_PAYOUT_ADDRESS` - Your Ethereum wallet address for payments
- `JWT_SECRET` - Random secret key for session management
- `NEXTAUTH_SECRET` - Random secret key for NextAuth

**Optional Variables:**
- `TELEGRAM_BOT_TOKEN` - For payment notifications
- `OXAPAY_API_KEY` - Alternative payment processor
- `GOOGLE_AI_API_KEY` - Fallback AI service

### 3. Get API Keys

#### V0.dev API Key
1. Visit [v0.dev](https://v0.dev)
2. Sign up for an account
3. Go to API settings
4. Generate a new API key
5. Add to `V0_API_KEY` in `.env.local`

#### Ethereum RPC (Free)
The app uses `https://eth.llamarpc.com` by default (free, no signup required).

Alternative free RPC endpoints:
- `https://rpc.ankr.com/eth`
- `https://ethereum.publicnode.com`
- `https://eth.rpc.blxrbdn.com`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy the application

### Deploy to Netlify

1. **Build the application:**
\`\`\`bash
npm run build
npm run export
\`\`\`

2. **Deploy to Netlify:**
   - Drag and drop the `out` folder to Netlify
   - Or connect your GitHub repository
   - Add environment variables in Netlify dashboard

## 💰 Payment Configuration

### Ethereum Wallet Setup

1. **Get an Ethereum Address:**
   - Use MetaMask, Trust Wallet, or any Ethereum wallet
   - Copy your wallet address
   - Add to `MASTER_PAYOUT_ADDRESS` in environment variables

2. **Test Payments:**
   - Use Ethereum testnet (Goerli/Sepolia) for testing
   - Get test ETH from faucets
   - Update RPC URL to testnet for testing

### Payment Verification

The app automatically verifies payments using:
- Transaction hash validation
- Amount verification
- Address confirmation
- Blockchain confirmation status

## 🔧 API Endpoints

### Website Generation
- `POST /api/generate` - Generate website from prompt
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project

### Payments
- `POST /api/payments/create` - Create payment request
- `POST /api/payments/verify` - Verify payment transaction
- `GET /api/payments/create?paymentId=xxx` - Get payment status

### Integrations
- `POST /api/github/push` - Push code to GitHub
- `POST /api/deploy` - Deploy to Vercel

## 🎯 Usage Guide

### For Users

1. **Generate Website:**
   - Enter a description of your desired website
   - Click "Generate Website"
   - Preview and edit the generated code

2. **Deploy (Free):**
   - Add your Vercel token in Settings
   - Click "Deploy" to publish your website

3. **Custom Domain ($5):**
   - Enter your custom domain
   - Pay $5 in ETH
   - Deploy with custom domain

4. **GitHub Integration ($10):**
   - Add your GitHub token in Settings
   - Pay $10 in ETH
   - Push code to your GitHub repository

### For Developers

1. **Extend AI Models:**
   - Add more AI providers in `/api/generate/route.ts`
   - Implement fallback mechanisms

2. **Add Payment Methods:**
   - Extend crypto support in `/api/payments/`
   - Add traditional payment gateways

3. **Custom Integrations:**
   - Add more deployment targets
   - Integrate with other services

## 🔒 Security

- Client-side token storage (upgrade to encrypted storage for production)
- Payment verification on blockchain
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection

## 📊 Monitoring

- Payment transaction logging
- Error tracking and reporting
- Usage analytics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue on GitHub
- Check the documentation
- Join our Discord community

## 🔄 Updates

- v1.0.0 - Initial release with core features
- v1.1.0 - Added GitHub integration
- v1.2.0 - Custom domain support
- v1.3.0 - Enhanced payment system

---

Built with ❤️ using Next.js, TypeScript, and Ethereum
\`\`\`

Let's also create a deployment configuration file:
