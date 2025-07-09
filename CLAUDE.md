# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server on http://localhost:3000
- `npm run build` - Build the production application
- `npm run start` - Run the production build locally

### Testing & Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Run TypeScript compiler to check types (if added)

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

### Project Structure
```
/app              # Next.js App Router pages and API routes
  /api           # API endpoints
    /recipes     # Recipe generation and extraction
  /preferences   # User preferences form
  /recipes       # Recipe generation UI
  /shopping-list # Shopping list with retailer links
  
/components      # Reusable React components
  /ui           # Basic UI components (Button, Card, etc.)
  
/lib            # Utility functions and configurations
  /ai           # AI prompts and logic
```

### Key Features
1. **MVP Focus**: No authentication, uses sessionStorage for user data
2. **AI Integration**: Claude API for recipe generation and ingredient extraction
3. **Swiss Market Integration**: Direct links to Migros and Coop for ingredients
4. **Export Functionality**: Download shopping lists as text files

### Environment Variables
Required in `.env.local`:
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude

### Development Workflow
1. User fills preferences form → stored in sessionStorage
2. AI generates seasonal Swiss recipes based on preferences
3. User selects recipes → ingredients extracted via AI
4. Shopping list created with retailer links
5. List can be exported or items searched directly on Migros/Coop