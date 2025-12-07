# HairAI

AI-powered hairstyle generator that transforms your look with realistic hairstyle previews.

## Features

- **Preset Styles**: Choose from 12 popular hairstyles (Buzz Cut, Bob, Pompadour, Afro, etc.)
- **Custom Prompts**: Describe any hairstyle you can imagine
- **AI Consultant**: Let AI analyze your face and recommend the perfect style
- **Reference Mode**: Upload a celebrity or Pinterest hairstyle to transfer
- **Variations**: Generate multiple variations of your chosen style
- **Refinement**: Iteratively adjust the result with text prompts

## AI Model

This project uses **Google Gemini 2.5 Flash** (`gemini-2.5-flash-image`) for image generation:

- High-quality photorealistic hairstyle transformations
- Face preservation technology
- Professional portrait-style output
- Fast generation speed

For face analysis and style recommendations, we use `gemini-2.0-flash`.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
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
- **Icons**: Lucide React
- **Language**: TypeScript

## API Routes

| Route | Description |
|-------|-------------|
| `/api/generate` | Generate hairstyle from text prompt |
| `/api/generate-reference` | Transfer hairstyle from reference image |
| `/api/analyze` | Analyze face and suggest hairstyle |
| `/api/variations` | Generate 4 style variations |

## License

MIT
