# The 2025 Love Universe – APM Implementation Plan
**Memory Strategy:** Dynamic-MD
**Last Modification:** Plan creation by the Setup Agent.
**Project Overview:** Full-stack Progressive Web App (PWA) for a romantic 2025 recap experience. Features TikTok-style video feed (33 videos), 3D interactive photo galleries (36+ photos), real-time presence (Socket.io), and emotional features (Voice Map, Secret Letter, Gacha). Migrates content from existing Happy Birthday website. Tech stack: React/Vite/TypeScript + Tailwind + Framer Motion (Frontend), Node.js/Express (Backend), MongoDB Atlas (Database), Cloudinary (Media), deployed on Vercel + Render.

---

## Phase 1: Foundation & Infrastructure

### Task 1.1 – Project Scaffolding & Monorepo Setup - Agent_Infrastructure
**Objective:** Initialize full-stack project structure with proper tooling.
**Output:** Working monorepo with client/ and server/ directories, configured build tools.
**Guidance:** Use Vite for React, Express for backend. Mobile-first Tailwind config.

1. Create project root with `client/` (Vite + React + TypeScript) and `server/` (Node.js + Express + TypeScript)
2. Configure shared ESLint + Prettier across both packages
3. Setup Tailwind CSS with custom theme (Deep Blue #1a1a2e, Stardust Gold #ffd700, Soft Pink #ffb6c1)
4. Add Google Fonts: Dancing Script (headings) + Inter (body)
5. Configure TypeScript strict mode in both packages
6. Create basic npm scripts for dev/build/start

### Task 1.2 – MongoDB Atlas & Database Models - Agent_Backend
**Objective:** Setup cloud database with all required schemas.
**Output:** Connected MongoDB Atlas cluster with Mongoose models.
**Guidance:** Free tier sufficient. Include indexes for query optimization.

1. Create MongoDB Atlas cluster (free tier M0)
2. Configure connection string with environment variables
3. Create Mongoose models:
   - `User` (sessionToken, lastVisit, preferences)
   - `Memory` (title, description, date, photos[], story)
   - `Comment` (memoryId, content, author, timestamp)
   - `Reaction` (targetType, targetId, type, userId)
   - `Letter` (content, unlockDate, isOpened)
   - `VoiceNote` (location, audioUrl, transcript, date)
4. Add database connection utility with retry logic

### Task 1.3 – Cloudinary Configuration & Media API - Agent_Backend
**Objective:** Setup Cloudinary for optimized media delivery.
**Output:** Working Cloudinary integration with folder structure documentation.
**Guidance:** Use Cloudinary free tier. Document folder naming convention for user.

1. Configure Cloudinary SDK with environment variables
2. Create API endpoints:
   - `GET /api/media/videos` - List all videos with adaptive streaming URLs
   - `GET /api/media/photos/:album` - List photos by album folder
   - `GET /api/media/folders` - List available albums
3. Implement Cloudinary transformations for:
   - Video: Adaptive bitrate streaming (q_auto, f_auto)
   - Photos: Responsive sizing, lazy-load placeholders
4. Document folder structure: `/videos/`, `/photos/winter/`, `/photos/autumn/`, `/photos/hue/`, `/photos/beach/`, `/photos/nature/`, `/photos/sweater/`
5. Create README section for user upload instructions

### Task 1.4 – Environment & Deployment Pipeline - Agent_Infrastructure
**Objective:** Setup deployment infrastructure for frontend and backend.
**Output:** Configured Vercel (FE) and Render (BE) deployments with env vars.
**Guidance:** Frontend auto-deploys from main branch. Backend needs manual config.

1. Create `.env.example` files for both client and server
2. Configure Vercel project for client/ directory
3. Configure Render web service for server/ directory
4. Setup environment variables in both platforms:
   - `MONGODB_URI`, `CLOUDINARY_*`, `JWT_SECRET`, `VITE_API_URL`
5. Add CORS configuration for cross-origin requests
6. Create deployment documentation in README

---

## Phase 2: Core Systems

### Task 2.1 – Authentication Gate Component - Agent_Frontend_Features
**Objective:** Create romantic password entry screen with token persistence.
**Output:** Working auth gate that blocks access until correct date is entered.
**Guidance:** Shared passcode (anniversary date format: DDMMYYYY). Store token in localStorage. Mobile-first design.

1. Create `AuthGate.tsx` component with:
   - Animated background (stars/particles)
   - Date input field styled as romantic lock
   - Optional "draw heart" gesture alternative
2. Implement password validation against hardcoded anniversary date
3. Generate and store JWT-like session token in localStorage
4. Add "Remember me" functionality (skip auth on return visits)
5. Create smooth transition animation to dashboard on success

### Task 2.2 – Authentication API & Middleware - Agent_Backend
**Objective:** Backend authentication logic and route protection.
**Output:** Auth endpoints and middleware for protected routes.
**Guidance:** Simple shared passcode, no user registration needed.
**Depends on: Task 1.2 Output**

1. Create `POST /api/auth/verify` endpoint:
   - Validate passcode against env var `AUTH_PASSCODE`
   - Return signed JWT token on success
2. Create `authMiddleware` to verify tokens on protected routes
3. Create `GET /api/auth/validate` to check token validity
4. Add rate limiting on auth endpoint (prevent brute force)

### Task 2.3 – Dashboard Universe Layout - Agent_Frontend_Features
**Objective:** Create the "planet menu" home screen with navigation.
**Output:** Interactive dashboard with animated planet icons.
**Guidance:** Non-linear navigation. Each planet leads to different section. Use Framer Motion for hover/click effects.
**Depends on: Task 2.1 Output**

1. Create `Dashboard.tsx` with space-themed background
2. Implement floating planet navigation:
   - 🪐 Hành tinh Kỷ niệm → Memory Vault + Gallery
   - 🚀 Trạm Vũ trụ → Video Feed
   - 🗺️ Bản đồ Sao → Voice Map
   - 🎁 Hộp Pandora → Gacha/Secret Letter
3. Add orbit animations for planets
4. Implement smooth page transitions using Framer Motion
5. Create responsive layout (mobile: vertical list, desktop: circular orbit)

### Task 2.4 – React Router & App Shell - Agent_Frontend_Core
**Objective:** Setup routing and global app structure.
**Output:** Configured routes with protected areas and shared layout.
**Guidance:** Use React Router v6. All routes except auth require authentication.

1. Install and configure React Router DOM
2. Create route structure:
   - `/` → Auth Gate
   - `/dashboard` → Dashboard (protected)
   - `/videos` → Video Feed (protected)
   - `/gallery/:album?` → Photo Gallery (protected)
   - `/memories` → Memory Vault (protected)
   - `/voicemap` → Voice Map (protected)
   - `/letter` → Secret Letter (protected)
   - `/surprise` → Final Surprise (protected)
3. Create `ProtectedRoute` wrapper component
4. Add `AppLayout` with global audio player, navigation hints
5. Implement scroll restoration and page transition wrappers

---

## Phase 3: Video Experience

### Task 3.1 – Infinite Video Feed Component - Agent_Frontend_Features
**Objective:** Create TikTok-style vertical video scroll with autoplay.
**Output:** Smooth infinite scroll video player with 33 videos.
**Guidance:** Critical for iOS Safari autoplay. Use Intersection Observer. Preload adjacent videos. Mobile-first swipe gestures.

1. Create `VideoFeed.tsx` with full-screen vertical layout
2. Implement Intersection Observer for:
   - Autoplay when video enters viewport (>50% visible)
   - Pause when video leaves viewport
3. Add swipe gesture support (touch events for mobile)
4. Implement video preloading (load next 2 videos ahead)
5. Create loading skeleton while videos buffer
6. Add iOS Safari autoplay workarounds (muted start, user interaction trigger)

### Task 3.2 – Video Player Controls & UI - Agent_Frontend_Features
**Objective:** Custom video player with engagement features.
**Output:** Styled video controls with like, comment, share buttons.
**Guidance:** Overlay UI like TikTok. Don't obstruct video content.
**Depends on: Task 3.1 Output**

1. Create `VideoOverlay.tsx` with:
   - Play/pause toggle (tap center)
   - Progress bar (bottom, thin)
   - Volume toggle
   - Like button with heart animation
   - Comment button (opens drawer)
   - Share button
2. Show video caption/description at bottom
3. Add double-tap to like gesture
4. Implement video progress as seekable bar
5. Create mute/unmute toggle with visual indicator

### Task 3.3 – Video API Integration - Agent_Backend
**Objective:** Backend endpoints for video metadata and interactions.
**Output:** API for fetching videos and saving reactions.
**Guidance:** Cloudinary provides video URLs. Store metadata in MongoDB.
**Depends on: Task 1.3 Output**

1. Create `GET /api/videos` endpoint:
   - Fetch video list from Cloudinary `/videos/` folder
   - Include streaming URLs with transformations
   - Support pagination (limit/offset)
2. Create `POST /api/videos/:id/reaction` for likes
3. Create video metadata model if needed (captions, order)
4. Optimize response with caching headers

---

## Phase 4: Visual Gallery

### Task 4.1 – 3D Gallery Foundation - Agent_Frontend_Visual
**Objective:** Create base 3D photo gallery with parallax/tilt effects.
**Output:** Interactive gallery component with 3D hover effects.
**Guidance:** Use Framer Motion for 3D transforms. Consider react-spring or vanilla-tilt. Optimize for mobile touch.

1. Create `Gallery3D.tsx` with CSS 3D perspective
2. Implement photo card component with:
   - 3D tilt on hover/touch
   - Parallax depth effect
   - Smooth rotation animations
3. Create grid layout with responsive columns
4. Add photo lightbox for full-screen viewing
5. Implement touch-friendly gestures for mobile

### Task 4.2 – Album Navigation & Photo Display - Agent_Frontend_Features
**Objective:** Album selection and photo browsing experience.
**Output:** Complete gallery with album tabs and photo captions.
**Guidance:** 6 albums (Winter, Autumn, Huế, Beach, Nature, Sweater). Each photo has a cute caption.
**Depends on: Task 4.1 Output**

1. Create `GalleryPage.tsx` with album selector tabs
2. Fetch photos from `/api/media/photos/:album`
3. Display photos with:
   - Album-specific styling/theme colors
   - Individual photo captions (cute messages)
   - Photo count indicator
4. Add swipe navigation between albums (mobile)
5. Implement masonry grid layout for varied photo sizes
6. Add loading states and error handling

### Task 4.3 – Photo API & Album Management - Agent_Backend
**Objective:** Backend for photo albums and metadata.
**Output:** API endpoints for fetching organized photo albums.
**Guidance:** Cloudinary folder structure maps to albums.
**Depends on: Task 1.3 Output**

1. Create `GET /api/photos` endpoint (all albums summary)
2. Create `GET /api/photos/:album` endpoint:
   - Fetch from Cloudinary folder
   - Include responsive image URLs
   - Support sorting and filtering
3. Add photo metadata model for captions
4. Create admin endpoint to update photo captions (optional)

---

## Phase 5: Memory & Emotional Features

### Task 5.1 – Love Timer Component - Agent_Frontend_Features
**Objective:** Create dynamic love duration counter.
**Output:** Animated timer showing years, days, hours, minutes, seconds together.
**Guidance:** Migrate from old Happy Birthday site. Update every second. Prominent display on intro/dashboard.

1. Create `LoveTimer.tsx` component
2. Calculate duration from anniversary date to now
3. Display breakdown: Years, Days, Hours, Minutes, Seconds
4. Add flip animation for changing digits
5. Style with romantic typography (Dancing Script)
6. Make responsive for both intro and dashboard placement

### Task 5.2 – Memory Vault Grid - Agent_Frontend_Features
**Objective:** Create memory cards grid with navigation to details.
**Output:** Grid of memory cards that link to individual memory pages.
**Guidance:** Migrate memory structure from old site. Each memory = card with preview.

1. Create `MemoryVault.tsx` grid layout
2. Fetch memories from `/api/memories`
3. Create `MemoryCard.tsx` with:
   - Cover photo thumbnail
   - Title and date
   - Hover/tap effect reveal
4. Implement smooth transition to memory detail
5. Add "Add Memory" floating button (for future content)

### Task 5.3 – Memory Detail Page - Agent_Frontend_Features
**Objective:** Individual memory page with story and photos.
**Output:** Full memory view with narrative and photo gallery.
**Guidance:** Migrate content from old site's memory pages.
**Depends on: Task 5.2 Output**

1. Create `MemoryDetail.tsx` page component
2. Display memory content:
   - Title with date
   - Story narrative (styled text)
   - Photo gallery specific to memory
   - Navigation to next/previous memory
3. Add reading progress indicator
4. Implement back navigation to vault
5. Add share/react buttons

### Task 5.4 – Memory API & Data Models - Agent_Backend
**Objective:** Backend for memory CRUD operations.
**Output:** API endpoints for memories with photo associations.
**Guidance:** Initial data will be migrated from old site.
**Depends on: Task 1.2 Output**

1. Create Memory model (title, date, story, photos[])
2. Create `GET /api/memories` endpoint (list all)
3. Create `GET /api/memories/:id` endpoint (single memory)
4. Create `POST /api/memories` for adding new memories
5. Create seed script with migrated content from old site

### Task 5.5 – Secret Letter with Timer - Agent_Frontend_Features
**Objective:** Time-capsule letter that unlocks on specified date.
**Output:** Letter component with countdown and reveal animation.
**Guidance:** Merge with old site's letter feature. Add unlock date functionality.

1. Create `SecretLetter.tsx` component
2. Display countdown if letter is locked:
   - Days/hours until unlock
   - Locked envelope animation
3. On unlock date, reveal letter with:
   - Dramatic opening animation
   - Styled letter content (handwriting font)
   - Background music trigger
4. Add "Write Reply" button for future
5. Include embedded video player from old site

### Task 5.6 – Letter API & Content - Agent_Backend
**Objective:** Backend for letter storage and unlock logic.
**Output:** API for letter with date-based access control.

1. Create Letter model (content, unlockDate, isOpened)
2. Create `GET /api/letter` endpoint:
   - Check unlock date vs current date
   - Return locked status or content
3. Create `POST /api/letter/open` to mark as opened
4. Seed initial letter content from old site

---

## Phase 6: Interactive Features

### Task 6.1 – Voice Map Foundation - Agent_Frontend_Features
**Objective:** Create interactive map with voice notes at locations.
**Output:** Map component with markers for voice recordings.
**Guidance:** Use Leaflet or Mapbox. Each marker = location where you recorded a message.

1. Create `VoiceMap.tsx` with map library
2. Add custom markers at significant locations
3. Implement marker click to play voice note
4. Add visual indicator for unheard notes
5. Create location list sidebar (mobile: bottom sheet)
6. Style map with romantic theme (custom tiles if possible)

### Task 6.2 – Voice Note Player & Recording - Agent_Frontend_Features
**Objective:** Audio player for voice notes with waveform.
**Output:** Voice note player modal with visual feedback.
**Guidance:** Voice notes stored in Cloudinary. Add waveform visualization.
**Depends on: Task 6.1 Output**

1. Create `VoiceNotePlayer.tsx` modal
2. Display:
   - Location name and photo
   - Audio waveform visualization
   - Play/pause controls
   - Transcript text (optional)
3. Add smooth open/close animation
4. Implement audio preloading
5. Create recording interface (future feature prep)

### Task 6.3 – Voice Note API - Agent_Backend
**Objective:** Backend for voice notes metadata.
**Output:** API for voice note locations and audio URLs.

1. Create VoiceNote model (location, coordinates, audioUrl)
2. Create `GET /api/voicenotes` endpoint
3. Create `GET /api/voicenotes/:id` for single note
4. Seed with initial voice note data

### Task 6.4 – Wish Modal Component - Agent_Frontend_Features
**Objective:** Popup modal with birthday/anniversary wish message.
**Output:** Styled modal with copy button (migrated from old site).
**Guidance:** Migrate from old site's wish popup feature.

1. Create `WishModal.tsx` component
2. Display wish message content
3. Add "Copy to Clipboard" button with feedback
4. Style with card effect and gift icon
5. Add confetti animation on open

### Task 6.5 – Particle Effects System - Agent_Frontend_Visual
**Objective:** Create falling hearts and confetti effects.
**Output:** Reusable particle system for hearts, stars, confetti.
**Guidance:** Use canvas or CSS animations. Optimize for mobile performance.

1. Create `ParticleSystem.tsx` component
2. Implement particle types:
   - Falling hearts (continuous)
   - Confetti burst (triggered)
   - Stars twinkle (ambient)
3. Add performance controls (reduce on low-end devices)
4. Create trigger API for use across app
5. Optimize with requestAnimationFrame

---

## Phase 7: Real-time & Enhancement

### Task 7.1 – Socket.io Server Setup - Agent_Backend
**Objective:** Setup real-time server for presence features.
**Output:** Working Socket.io server with connection handling.
**Guidance:** Private 1-on-1 only. Track when both users are online.

1. Install and configure Socket.io with Express
2. Implement connection/disconnection handlers
3. Create room for private session (using auth token)
4. Track active users (max 2)
5. Emit presence events: "partner_joined", "partner_left"

### Task 7.2 – Real-time Presence UI - Agent_Frontend_Features
**Objective:** Show "Anh đang ở đây ❤️" when partner is online.
**Output:** Presence indicator and cursor tracking visualization.
**Guidance:** Cursor appears as glowing dot on partner's screen.
**Depends on: Task 7.1 Output by Agent_Backend**

1. Create `usePresence` hook for Socket connection
2. Display presence indicator when partner online
3. Implement cursor position sharing:
   - Emit local cursor coordinates
   - Display partner cursor as glowing dot
4. Add "waving" interaction (click sends hearts to partner)
5. Handle connection states gracefully

### Task 7.3 – Socket.io Client Integration - Agent_Frontend_Core
**Objective:** Setup Socket.io client with React integration.
**Output:** Connected socket client with context provider.
**Guidance:** Auto-connect after authentication.
**Depends on: Task 7.1 Output by Agent_Backend**

1. Install socket.io-client
2. Create `SocketContext` provider
3. Implement connection management:
   - Connect after auth success
   - Reconnect on disconnect
   - Handle errors gracefully
4. Create hooks for subscribing to events
5. Add connection status indicator

### Task 7.4 – Gacha Game Component - Agent_Frontend_Features
**Objective:** Create voucher wheel spin game.
**Output:** Spinning wheel with prize animation.
**Guidance:** Nice-to-have feature. Fun rewards like "1 hug", "1 movie night".

1. Create `GachaWheel.tsx` component
2. Implement spinning animation with acceleration/deceleration
3. Define prize list with probabilities
4. Add win celebration animation
5. Track won prizes in localStorage
6. Create prize collection view

### Task 7.5 – Final Surprise Page - Agent_Frontend_Features
**Objective:** Create dramatic ending sequence.
**Output:** Closing celebration page with message and effects.
**Guidance:** Migrate from old site. Maximum emotional impact.

1. Create `Surprise.tsx` page
2. Implement entrance animation sequence
3. Display final message with typewriter effect
4. Trigger all particle effects (hearts, confetti, stars)
5. Add background music crescendo
6. Create "Return Home" or "Replay" button

---

## Phase 8: Integration & Polish

### Task 8.1 – Content Migration Script - Agent_Integration
**Objective:** Migrate content from old Happy Birthday site.
**Output:** Populated database with memories, letter, and assets.
**Guidance:** Extract text content, organize photos, migrate video.

1. Create migration script for:
   - Memory stories (text content)
   - Photo captions
   - Letter content
   - Wish message
2. Upload media to Cloudinary with correct folder structure
3. Seed MongoDB with migrated data
4. Verify all references resolved correctly

### Task 8.2 – PWA Configuration - Agent_Frontend_Core
**Objective:** Configure Progressive Web App features.
**Output:** Installable PWA with offline support and app-like experience.
**Guidance:** Use vite-plugin-pwa. Add custom splash screen.

1. Install and configure vite-plugin-pwa
2. Create manifest.json with:
   - App name: "Love Universe 2025"
   - Theme colors matching design
   - App icons (heart logo)
3. Configure service worker for offline caching
4. Add install prompt for mobile
5. Create custom splash screen

### Task 8.3 – Mobile Optimization - Agent_Frontend_Visual
**Objective:** Ensure flawless mobile experience especially iOS Safari.
**Output:** Tested and optimized mobile UI/UX.
**Guidance:** iOS Safari is priority #1. Test autoplay, gestures, performance.

1. Test and fix iOS Safari issues:
   - Video autoplay (requires user interaction)
   - 100vh viewport issues
   - Rubber-band scrolling conflicts
2. Optimize animations for mobile:
   - Reduce complexity on low-end devices
   - Use will-change for critical animations
3. Test touch gestures across devices
4. Verify responsive breakpoints
5. Performance audit with Lighthouse

### Task 8.4 – Global Audio Player - Agent_Frontend_Features
**Objective:** Background music player that persists across navigation.
**Output:** Ambient music player with controls.
**Guidance:** Music selection TBD. Must handle iOS audio restrictions.

1. Create `GlobalAudioPlayer.tsx` in AppLayout
2. Implement persistent playback across routes
3. Add mute/unmute toggle (always visible)
4. Handle iOS audio unlock (first interaction)
5. Create playlist support for different moods
6. Add volume control

### Task 8.5 – Final Testing & Bug Fixes - Agent_Integration
**Objective:** End-to-end testing and bug resolution.
**Output:** Production-ready application.
**Guidance:** Test on real devices. Focus on iOS Safari and low-end Android.

1. Manual E2E testing checklist:
   - Auth flow complete
   - All navigation paths work
   - Video feed smooth on 4G
   - Gallery loads correctly
   - Real-time presence works
2. Performance testing:
   - Lighthouse audit (target 90+)
   - Load testing with throttled network
3. Cross-browser testing:
   - iOS Safari (iPhone 12+)
   - Android Chrome
   - Desktop Chrome/Firefox
4. Fix identified bugs
5. Final deployment verification

### Task 8.6 – Documentation & Handoff - Agent_Integration
**Objective:** Create user documentation and maintenance guide.
**Output:** README with setup, usage, and content update instructions.
**Guidance:** User needs to know how to add new content for 2026.

1. Write comprehensive README:
   - Project overview
   - Local development setup
   - Environment variables
   - Deployment instructions
2. Create content update guide:
   - How to add videos (Cloudinary upload)
   - How to add photos (folder naming)
   - How to add memories (API/DB)
3. Document folder structure and architecture
4. Add troubleshooting section

