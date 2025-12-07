# HairAI

AI-powered hairstyle generator that transforms your look with realistic hairstyle previews.

## Features

- **Preset Styles**: Choose from 12 popular hairstyles (Buzz Cut, Bob, Pompadour, Afro, etc.)
- **Custom Prompts**: Describe any hairstyle you can imagine
- **AI Consultant**: Let AI analyze your face and recommend the perfect style
- **Reference Mode**: Upload a celebrity or Pinterest hairstyle to transfer
- **Variations**: Generate multiple variations of your chosen style
- **Refinement**: Iteratively adjust the result with text prompts
- **x402 Payment**: Pay-per-use with USDC on Base network

## AI Model

This project uses **Google Gemini 2.5 Flash** (`gemini-2.5-flash-image`) for image generation:

- High-quality photorealistic hairstyle transformations
- Face preservation technology
- Professional portrait-style output
- Fast generation speed

For face analysis and style recommendations, we use `gemini-2.0-flash`.

## x402 Payment Protocol

HairAI uses the x402 payment protocol for pay-per-use AI generation:

- **Network**: Base (Mainnet)
- **Currency**: USDC
- **Wallet**: RainbowKit (WalletConnect, MetaMask, Coinbase Wallet)

### Pricing

| Feature | Price |
|---------|-------|
| Generate Hairstyle | $0.10 |
| Reference Transfer | $0.15 |
| Face Analysis | $0.05 |
| Variations (4x) | $0.30 |

### How it works

1. Connect your wallet (Base network)
2. Upload your photo
3. Choose a style and click Generate
4. Sign the EIP-3009 authorization
5. AI generates your new hairstyle

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_PAY_TO=0x92b6ed1f84d32CB5a39948a83236c0A7838f5118
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **AI**: Google Gemini API (@google/genai)
- **Web3**: wagmi + viem + RainbowKit
- **Payment**: x402 Protocol (EIP-3009)
- **Icons**: Lucide React
- **Language**: TypeScript

## API Routes

| Route | Description | Price |
|-------|-------------|-------|
| `/api/generate` | Generate hairstyle from text prompt | $0.10 |
| `/api/generate-reference` | Transfer hairstyle from reference image | $0.15 |
| `/api/analyze` | Analyze face and suggest hairstyle | $0.05 |
| `/api/variations` | Generate 4 style variations | $0.30 |

## License

MIT
