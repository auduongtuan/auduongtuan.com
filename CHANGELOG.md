# Changelog

All notable changes to this project will be documented in this file.

## [3.7.0] - 2026-02-21

### Added
- **Interactive Vinyl Player**: Enhanced the Spotify player with a vinyl frame overlay, interactive controls, and auto-continue playback.
- **YouTube Music Integration**: Added a Python server and Vercel serverless functions as a backup YouTube Music API for audio playback via `react-player`.
- **Animated Binary Grid Footer**: Implemented a persistent footer across pages featuring a fluid binary grid background with glitch effects, bit-flipping animations, and cursor interactions.
- **HoverGif Enhancements**: Added cursor-following behavior to `HoverGif` popups with extended trigger areas using Floating UI.
- **Comment Suggestion Layout**: Improved the layout of the AI-generated comment suggestion tag container.

### Changed
- **Component Styles**: Updated component styles and Tailwind classes for `Button`, `IconButton`, `BackToPreviousPage`, and `ProjectCard`.
- **FadeScrollableContainer**: Refactored to use `mask-image` instead of background gradients for a cleaner fade effect.
- **Gemini API**: Added fallback handling and cache expiration for AI comment suggestions.

### Fixed
- Reset first/last margins in `MiniPostCard` to hide unwanted scrollbars.
- Reset photo section expand state when navigating away from the about page.
- Added `/uploads/**` to Next.js `localPatterns` to allow image optimization for content images.

---

## [3.6.4] - 2025-12-15

### Added
- **Product List**: Optimized projects and added a new product list layout with horizontal card support.
- **Notion SDK Upgrade**: Upgraded Notion SDK to v5.6.0 and implemented mention support.
- **Gemini SDK Upgrade**: Upgraded Gemini SDK, added metadata caching for comment suggestions, and improved TypeScript types.
- **Embed Dimensions**: Added dimension extraction for Notion embed blocks.

### Changed
- **Next.js 16**: Upgraded to Next.js 16.1, React 19.2.3, and TypeScript 5.9.
- **Grid Component**: Refactored and enhanced the `Grid` component with improved props and layout options.

### Fixed
- Fixed unpublished projects display.
- Cleared password state when navigating between protected posts.
- Fixed internal link issues.

---

## [3.6.3] - 2025-07-20

### Fixed
- Fixed mobile responsive bugs and improved date handling/formatting.

---

## [3.6.2] - 2025-06-15

### Added
- **Scroll Buttons**: Added scroll buttons for the project list.
- **Font Update**: Changed typography to use Oracle and JetBrains Mono fonts for a crisper look.
- **Phù Phiếm Header**: Added subtle, polished micro-interactions to the header.

### Changed
- **Bun Migration**: Migrated package management to `bun` for faster builds and better dependency handling.
- **Base UI**: Updated `@base-ui/components` and refactored hooks.
- **UI Optimization**: Various UI tweaks and optimizations across the site.

---

## [3.6.1] - 2025-05-10

### Added
- **9 Shades of Tuan**: Built a Tinder-style photo swiping experience for the About page.
- **Rich Text Enhancements**: Improved rich text rendering and code annotation/highlighting.
- **Facts & Now Section**: Enhanced the "Facts" and "Now" sections on the About page.

### Changed
- **About Page Optimization**: Optimized the layout and interactions on the About page.
- **Comment Section**: Optimized the comment section and AI-generated suggestions.

### Fixed
- Fixed photo image double-tap and touch event issues.
- Fixed shifting UI bugs and optimized thumbnails.

---

## [3.6.0] - 2025-02-20

### Added
- **Next.js 15 & TailwindCSS v4**: Upgraded the core tech stack to Next.js 15 and TailwindCSS v4.
- **AI-Powered Comment Suggestions**: Experimented with helping visitors articulate thoughts better using the Gemini API.
- **Enhanced Password Protection**: Extended password protection to both posts and projects for better content control.
- **Custom Tracking System**: Built a simple analytics solution using the Notion API to track page views and engagement.
- **Work Page**: Added a dedicated Work page and optimized project groupings.

### Changed
- **Copy-writing Refresh**: Changed the tagline to "part-time software builder, full-time dreamer" with sparkle text effects.
- **Cleaner Design**: Improved spacing and refined typography.
- **Content Upgrade**: Brought more personal content to the homepage, showcasing pet products and recent blog posts.
- **Scroll Snap Navigation**: Added smooth scrolling behaviors for more intentional browsing.

### Fixed
- Fixed various UI bugs, OG image generation, and page view tracking issues.
