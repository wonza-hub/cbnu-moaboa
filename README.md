## MOABOA, 교내 공지사항 통합 플랫폼

### 서비스 아키텍처
<p align="center"><img width="568" alt="image" src="https://github.com/user-attachments/assets/97816019-4790-452d-96df-d6fa1d957e38" />

### 프로젝트 구조 (Next.js App Router + FSD Architecturer)
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
