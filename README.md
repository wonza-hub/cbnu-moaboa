## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure (FSD Architecture)

This project follows the **Feature-Sliced Design (FSD)** architecture adapted for **Next.js App Router**.

```
cbnu-moaboa/
├── app/                        # Next.js App Router (Routing Layer)
│
├── src/
│   ├── applications/           # App Configuration (FSD App Layer)
│   │   ├── providers/          # Global Providers (React Query, etc.)
│   │   └── styles/             # Global Styles
│   │
│   ├── widgets/                # Composition Layer (Complex UI Blocks)
│   │   └── notice-list/        # e.g. Notice List Widget
│   │
│   ├── features/               # User Interaction Layer
│   │   └── (user-actions)      # Search, Filter, Auth, etc.
│   │
│   ├── entities/               # Business Domain Layer
│   │   └── notice/             # Notice Entity
│   │       ├── model/          # Types, Stores
│   │       ├── lib/            # Constants
│   │       └── ui/             # Domain UI (NoticeCard)
│   │
│   └── shared/                 # Reusable Primitives
│       ├── api/                # API Clients
│       ├── components/         # UI Kit (Atomic Components)
│       ├── hooks/              # Shared Hooks
│       ├── lib/                # Utilities
│       └── stores/             # Global Stores
│
└── public/                     # Static Assets
```

## AI 에이전트 활용

### 커서룰 세분화
