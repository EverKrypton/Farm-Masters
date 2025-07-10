# Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/webcraft-studio.git
git push -u origin main
\`\`\`

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `V0_API_KEY`: Your v0.dev API key
     - `MASTER_PAYOUT_ADDRESS`: Your Ethereum wallet address
     - `JWT_SECRET`: Random secret string
     - `NEXTAUTH_SECRET`: Random secret string
     - `ETHEREUM_RPC_URL`: `https://eth.llamarpc.com`
   - Click "Deploy"

3. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS settings

### Option 2: Netlify

1. **Build for static export:**
\`\`\`bash
npm run build
npm run export
\`\`\`

2. **Deploy to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder
   - Or connect GitHub repository
   - Add environment variables in Site Settings

### Option 3: Railway

1. **Connect GitHub:**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

### Option 4: DigitalOcean App Platform

1. **Create App:**
   - Visit DigitalOcean App Platform
   - Connect GitHub repository
   - Configure build settings
   - Add environment variables

## 🔧 Environment Variables

### Required Variables
\`\`\`env
V0_API_KEY=your_v0_api_key_here
MASTER_PAYOUT_ADDRESS=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-here
\`\`\`

### Optional Variables
\`\`\`env
ETHEREUM_RPC_URL=https://eth.llamarpc.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_telegram_chat_id_here
OXAPAY_API_KEY=your_oxapay_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
\`\`\`

## 🌐 Free RPC Endpoints

The application uses free Ethereum RPC endpoints by default:

### Primary (Default)
- `https://eth.llamarpc.com` - LlamaNodes (No signup required)

### Alternatives
- `https://rpc.ankr.com/eth` - Ankr (No signup required)
- `https://ethereum.publicnode.com` - PublicNode (No signup required)
- `https://eth.rpc.blxrbdn.com` - bloXroute (No signup required)
- `https://rpc.flashbots.net` - Flashbots (No signup required)

### For Testing (Testnets)
- Goerli: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
- Sepolia: `https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`

## 🔐 Security Checklist

### Before Production Deployment

- [ ] Change all default secret keys
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable error monitoring
- [ ] Configure backup systems
- [ ] Test payment flows thoroughly

### Recommended Security Measures

1. **API Rate Limiting:**
\`\`\`javascript
// Add to your API routes
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}
\`\`\`

2. **Input Validation:**
\`\`\`javascript
// Validate all user inputs
const validateInput = (input) => {
  return input && input.length > 0 && input.length < 2000
}
\`\`\`

3. **Error Handling:**
\`\`\`javascript
// Don't expose internal errors
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
}
\`\`\`

## 📊 Monitoring Setup

### Error Tracking
- Sentry: Add `@sentry/nextjs` for error tracking
- LogRocket: For session replay and debugging

### Analytics
- Google Analytics: Track user interactions
- Mixpanel: Track conversion events

### Performance
- Vercel Analytics: Built-in performance monitoring
- New Relic: Application performance monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
\`\`\`yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version (use 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **API Errors:**
   - Verify environment variables
   - Check API key validity
   - Monitor rate limits

3. **Payment Issues:**
   - Verify Ethereum RPC endpoint
   - Check wallet address format
   - Test with small amounts first

4. **Deployment Issues:**
   - Check build logs
   - Verify environment variables
   - Test locally first

### Getting Help

- Check GitHub Issues
- Review deployment logs
- Test API endpoints individually
- Use browser developer tools

---

Need help? Create an issue on GitHub or check our documentation.
