# Claude Code Memory for auduongtuan.com

This file contains project-specific knowledge and patterns for Claude to reference in future sessions.

## Project Overview

**Personal portfolio website** for Au Duong Tuan built with modern web technologies. Features a sophisticated content management system using Notion as a headless CMS.

## Tech Stack

- **Framework**: Next.js 15.3.1 with Pages Router (not App Router)
- **Language**: TypeScript 5.7.2 with strict typing
- **Styling**: Tailwind CSS 4.1.5 with custom design system
- **Content**: Notion API for headless CMS
- **State**: Zustand for lightweight state management
- **Data Fetching**: SWR with custom caching layer
- **Package Manager**: Bun
- **Deployment**: Vercel-optimized

## Project Architecture

### Directory Structure
```
components/          # Atomic Design Structure
├── atoms/          # Basic UI (Button, Badge, CustomImage)
├── molecules/      # Composite (Navigation, Footer, Cards)
├── templates/      # Page templates (home, about, post, project)
└── notion/         # Notion content rendering components

lib/                # Business Logic
├── notion/         # Notion API integration & content types
├── utils/          # Utility functions & cache
├── cloudinary.ts   # Image optimization
└── gtag.ts         # Analytics

pages/              # Next.js Pages Router
├── api/            # API routes (comments, reactions, spotify)
├── blog/           # Blog pages
├── project/        # Project detail pages
└── [various pages]

store/              # Zustand state stores
hooks/              # Custom React hooks
```

### Path Aliases
```typescript
"@atoms/*": ["components/atoms/*"]
"@molecules/*": ["components/molecules/*"] 
"@templates/*": ["components/templates/*"]
"@lib/*": ["lib/*"]
"@store/*": ["store/*"]
```

## Development Commands

```bash
# Standard development
bun run dev

# Development with cache revalidation
bun run dev --revalidate-cache
bun run dev --revalidate
bun run dev -r

# Other commands
bun run build
bun run start
bun run lint
```

## Cache System

### Cache Functions
- `getProjectsWithCache()` - Caches project data from Notion
- `getPostsWithCache()` - Caches post data from Notion
- Cache TTL: 24 hours in development
- Cache is only used in development environment

### Cache Revalidation
- Use `--revalidate-cache`, `--revalidate`, or `-r` flags to bypass cache
- Implemented in `lib/utils/cache.ts:shouldRevalidateCache()`
- Shows console message when cache is revalidated

## Key Files

### Cache Implementation
- `lib/utils/cache.ts` - NodeCache instance and revalidation logic
- `lib/notion/project.ts:getProjectsWithCache()` - Project cache with revalidation
- `lib/notion/post.ts:getPostsWithCache()` - Post cache with revalidation

### Content Management
- `lib/notion/project.ts` - Project data fetching from Notion
- `lib/notion/post.ts` - Post data fetching from Notion
- Environment variables: `PROJECT_DATABASE_ID`, `PROJECT_GROUP_DATABASE_ID`, `BLOG_DATABASE_ID`

## Code Patterns

### Cache Function Pattern
```typescript
export async function getDataWithCache() {
  let data: DataType[];
  if (isDevEnvironment) {
    const forceRevalidate = shouldRevalidateCache();
    const cacheData = !forceRevalidate ? cache.get("key") as DataType[] : null;
    if (cacheData) {
      data = cacheData;
    } else {
      data = await getData(isDevEnvironment);
      cache.set("key", data, 24 * 1000 * 60 * 60);
      if (forceRevalidate) {
        console.log("🔄 Cache revalidated for key");
      }
    }
  } else {
    data = await getData(isDevEnvironment);
  }
  return data;
}
```

## Content Management (Notion CMS)

### Data Models
```typescript
// Projects
type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  cover: NotionMedia[];
  tools: string[];
  roles: string[];
  protected: boolean;
  group?: ProjectGroup;
  // ... more fields
}

// Posts
type Post = {
  id: string;
  slug: string;
  meta: {
    title: string;
    date: string;
    tags: string[];
    protected: boolean;
  };
  assets: NotionAssets;
}
```

### Environment Variables
- `PROJECT_DATABASE_ID` - Notion project database
- `PROJECT_GROUP_DATABASE_ID` - Project grouping database  
- `BLOG_DATABASE_ID` - Blog posts database

## Component Patterns

### Atomic Design System
- **Atoms**: `Button`, `Badge`, `CustomImage`, `Dialog`
- **Molecules**: `Navigation`, `Footer`, `PostCard`, `ProjectCard`
- **Templates**: Page-level layouts and structure
- **Notion**: Specialized Notion content renderers

### Component Conventions
```typescript
// Polymorphic components
interface ButtonProps {
  href?: string;
  colorful?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

// Forward refs and accessibility
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // Implementation
});
```

### Styling Patterns
```typescript
// Custom Tailwind utilities
@utility hero-text {
  @apply text-[1.75rem] leading-[1.11] font-semibold 
         md:text-5xl lg:text-[3.75rem];
}

@utility content-container {
  @apply max-w-content px-section-horizontal mx-auto;
}
```

## API Routes & Features

### Comment System
- Rate limiting: 5 requests per minute
- Location: `/api/comment.ts`
- Uses rate limiting map with timestamps

### Reactions System  
- Location: `/api/reaction.ts`
- Like/reaction functionality

### Spotify Integration
- Location: `/api/spotify.ts`
- Real-time currently playing display

### Dynamic OG Images
- Location: `/api/og/[...data].tsx`
- Generated for social sharing

## Performance Optimizations

### Image Handling
- **Cloudinary**: Primary image optimization
- **Next.js Image**: Built-in optimization
- **Sharp**: Server-side processing
- **Remote patterns**: AWS, Cloudinary, Spotify, YouTube

### Font Loading
- **Variable fonts**: ABCOracle font family
- **font-display: swap**: Prevent layout shift

### Bundle Optimization
- **Turbopack**: Fast development builds
- **Code splitting**: Automatic with Next.js
- **Tree shaking**: Enabled by default

## Development Notes

- **Pages Router**: Not App Router (important for routing)
- **Cache is dev-only**: Production always fetches fresh data
- **TypeScript strict**: Full type coverage expected
- **Mobile-first**: Responsive design approach
- **Accessibility**: Using Base UI components
- **Rate limiting**: Implemented for API routes
- **Password protection**: Available for private content