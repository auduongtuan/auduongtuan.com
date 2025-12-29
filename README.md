# auduongtuan.com

Personal portfolio website for Au Duong Tuan, featuring a sophisticated content management system using Notion as a headless CMS.

🔗 **Live Site:** [auduongtuan.com](https://auduongtuan.com)

## Tech Stack

### Core
- **Framework:** Next.js 15.3.1 (Pages Router)
- **Language:** TypeScript 5.7.2 with strict typing
- **Styling:** Tailwind CSS 4.1.5 with custom design system
- **Package Manager:** Bun

### Content & Data
- **CMS:** Notion API (headless CMS)
- **State Management:** Zustand
- **Data Fetching:** SWR with custom caching layer
- **Image Optimization:** Cloudinary + Next.js Image

### Features
- **AI:** Google Gemini SDK for comment suggestions
- **Analytics:** Google Analytics (gtag)
- **UI Components:** Base UI (accessible component library)

## Features

- 📝 **Dynamic Content:** Projects, blog posts, and portfolio powered by Notion
- 💬 **Interactive Comments:** AI-powered suggestions with Gemini
- 👍 **Reactions System:** Like/reaction functionality for posts
- 🎵 **Spotify Integration:** Real-time currently playing display
- 🖼️ **Smart Media Handling:** Automatic image optimization with Cloudinary
- 🔒 **Password Protection:** Private content support
- 📱 **Fully Responsive:** Mobile-first design approach
- 🎨 **Custom Design System:** Tailwind-based with atomic design structure
- 🌐 **Dynamic OG Images:** Generated social sharing cards

## Project Structure

```
├── components/              # Atomic Design Structure
│   ├── atoms/              # Basic UI (Button, Badge, CustomImage)
│   ├── molecules/          # Composite (Navigation, Footer, Cards)
│   ├── templates/          # Page templates
│   └── notion/             # Notion content rendering
├── lib/                    # Business Logic
│   ├── notion/             # Notion API integration & types
│   ├── utils/              # Utility functions & cache
│   ├── cloudinary.ts       # Image optimization
│   └── gtag.ts             # Analytics
├── pages/                  # Next.js Pages Router
│   ├── api/                # API routes
│   ├── blog/               # Blog pages
│   └── project/            # Project pages
├── store/                  # Zustand state stores
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```

### Path Aliases
```typescript
"@atoms/*": "components/atoms/*"
"@molecules/*": "components/molecules/*"
"@templates/*": "components/templates/*"
"@lib/*": "lib/*"
"@store/*": "store/*"
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Notion API key and database IDs
- Cloudinary account (for image optimization)
- Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/auduongtuan/auduongtuan.com.git
cd auduongtuan.com
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
# Notion
NOTION_API_KEY=your_notion_api_key
PROJECT_DATABASE_ID=your_project_database_id
PROJECT_GROUP_DATABASE_ID=your_project_group_database_id
BLOG_DATABASE_ID=your_blog_database_id

# Notion Data Sources (for comments, reactions, metadata)
COMMENT_DATASOURCE_ID=your_comment_datasource_id
REACTION_DATASOURCE_ID=your_reaction_datasource_id
METADATA_DATASOURCE_ID=your_metadata_datasource_id

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Site Configuration
NEXT_PUBLIC_PRODUCTION_WEB_URL=https://auduongtuan.com
```

### Development

Run the development server:
```bash
bun run dev
```

Open [http://localhost:7777](http://localhost:7777) to see the result.

Run with cache revalidation (bypasses Notion data cache):
```bash
bun run dev --revalidate-cache
# or
bun run dev --revalidate
# or
bun run dev -r
```

The dev server uses **Turbopack** for faster builds and runs on **port 7777**.

### Build & Production

```bash
# Build for production
bun run build

# Start production server
bun run start

# Lint
bun run lint
```

## Cache System

The project implements a custom caching layer for Notion data in development:

- **Cache TTL:** 24 hours
- **Cache Location:** In-memory (NodeCache)
- **Cached Data:** Projects, posts, and other Notion database queries
- **Environment:** Development only (production always fetches fresh data)

### Cache Revalidation
Use the `--revalidate-cache`, `--revalidate`, or `-r` flags to bypass cache:

```bash
bun run dev --revalidate-cache
```

Implementation: `lib/utils/cache.ts:shouldRevalidateCache()`

## Key Features Implementation

### Notion CMS Integration
- **Dynamic Content:** Projects and blog posts fetched from Notion databases
- **Rich Content:** Support for headings, lists, callouts, toggles, embeds, code blocks
- **Smart Mentions:** Link previews, user mentions, page mentions
- **Embed Enhancements:** Custom dimension extraction from captions (e.g., `[542-504] Description`)

### Comment System
- **AI Suggestions:** Gemini-powered comment suggestions (Vietnamese & English)
- **Data Fetching:** useSWR for automatic caching and revalidation
- **Rate Limiting:** 5 requests per minute per IP
- **Storage:** Notion database

### Reactions System
- **Emoji Reactions:** 💖 😆 😮 💅 🤨
- **Optimistic Updates:** Immediate UI feedback with background sync
- **Animations:** emoji-blast effects on interaction

### Image Optimization
- **Cloudinary:** Primary image CDN with automatic optimization
- **Next.js Image:** Built-in optimization fallback
- **Sharp:** Server-side processing
- **Remote Patterns:** AWS, Cloudinary, Spotify, YouTube

## API Routes

- `/api/comment` - Comment CRUD operations
- `/api/comment-suggestion` - AI-powered comment suggestions
- `/api/reaction` - Reaction system
- `/api/spotify` - Currently playing track
- `/api/og/[...data]` - Dynamic OG image generation

## Deployment

The site is optimized for Vercel deployment:

1. Push to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

Automatic deployments are triggered on push to `main` branch.

## Development Notes

- **Pages Router:** This project uses Next.js Pages Router, NOT App Router
- **TypeScript:** Strict mode enabled, full type coverage expected
- **Mobile-First:** Responsive design approach
- **Accessibility:** Using Base UI for accessible components
- **Cache Behavior:** Development cache only, production always fresh
- **Dev Server:** Runs on port 7777 with Turbopack enabled

## Contributing

This is a personal portfolio project, but suggestions and bug reports are welcome via issues.

## License

All rights reserved © Au Duong Tuan
