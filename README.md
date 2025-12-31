# Love Universe 2025 - Setup Guide

## Project Structure

This is a monorepo containing:
- **client/** - Frontend Vite + React + TypeScript application
- **server/** - Backend Node.js + Express + TypeScript API

## Quick Start

### 1. Install Dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### 2. Configure Environment Variables

**Server:**
```bash
cd server
cp .env.example .env
```

Edit `.env` and add your configuration values (MongoDB URI, Cloudinary credentials, etc.)

### 3. Run Development Servers

**Client (from client/ directory):**
```bash
npm run dev
```
The client will run on `http://localhost:5173`

**Server (from server/ directory):**
```bash
npm run dev
```
The server will run on `http://localhost:3000`

## Project Features

### Custom Tailwind Theme

The project includes a custom Tailwind configuration with romantic theme colors:

- **Deep Blue** (`deep-blue`): `#1a1a2e` - Primary background color
- **Stardust Gold** (`stardust-gold`): `#ffd700` - Accent and highlight color
- **Soft Pink** (`soft-pink`): `#ffb6c1` - Romantic elements

Usage example:
```tsx
<div className="bg-deep-blue text-stardust-gold">
  <h1 className="text-soft-pink">Hello</h1>
</div>
```

### Google Fonts

Two fonts are integrated:
- **Dancing Script** (`font-dancing`) - For romantic headings
- **Inter** (`font-inter`) - For body text

Usage example:
```tsx
<h1 className="font-dancing text-6xl">Love Universe</h1>
<p className="font-inter">Beautiful typography</p>
```

### TypeScript Strict Mode

Both client and server have strict TypeScript mode enabled with path aliases:

**Client aliases:**
- `@/` → `./src/`
- `@/components/*` → `./src/components/*`
- `@/utils/*` → `./src/utils/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/types/*` → `./src/types/*`

**Server aliases:**
- `@/` → `./src/`
- `@/models/*` → `./src/models/*`
- `@/routes/*` → `./src/routes/*`
- `@/controllers/*` → `./src/controllers/*`
- `@/middleware/*` → `./src/middleware/*`
- `@/utils/*` → `./src/utils/*`

## Available Scripts

### Client Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Server Scripts

- `npm run dev` - Start development server with auto-restart (tsx watch)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled production server
- `npm run lint` - Run ESLint for code quality checks

## Code Quality Tools

- **ESLint** - Configured for both client and server with TypeScript support
- **Prettier** - Consistent code formatting across the project
- **EditorConfig** - Cross-editor consistency for indentation and line endings

## Tech Stack

### Frontend (client/)
- ⚡ Vite - Fast build tool and dev server
- ⚛️ React 18 - UI library
- 📘 TypeScript - Type safety
- 🎨 Tailwind CSS - Utility-first CSS framework
- ✅ ESLint + Prettier - Code quality and formatting

### Backend (server/)
- 🟢 Node.js - Runtime environment
- 🚂 Express - Web framework
- 📘 TypeScript - Type safety
- 🔄 tsx - TypeScript execution with watch mode
- ✅ ESLint + Prettier - Code quality and formatting

## Next Steps

After installing dependencies, you can:
1. Start both development servers
2. Open `http://localhost:5173` to see the client
3. Test the server health endpoint at `http://localhost:3000/api/health`
4. Begin building your features!

## Notes

- All configuration files are properly set up
- TypeScript strict mode is enabled for maximum type safety
- Path aliases are configured in both TypeScript and Vite configs
- The project follows best practices for modern full-stack development
