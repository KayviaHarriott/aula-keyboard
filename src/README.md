src/
│
├─ App.tsx                 # stays here — main app shell & routes
├─ main.tsx                # ReactDOM + BrowserRouter
├─ index.css
│
├─ pages/                  # route-level pages
│   ├─ Home/
│   │   ├─ Home.tsx
│   │   └─ index.ts
│   ├─ About/
│   │   ├─ About.tsx
│   │   └─ index.ts
│   └─ ...
│
├─ components/             # reusable UI components
│   ├─ ui/
│   │   ├─ Button.tsx
│   │   ├─ Card.tsx
│   │   └─ ...
│   ├─ layout/
│   │   ├─ Navbar.tsx
│   │   └─ Footer.tsx
│   └─ ...
│
├─ hooks/                  # global custom hooks
│   ├─ useDebounce.ts
│   ├─ useLocalStorage.ts
│   └─ ...
│
├─ services/               # API service layer
│   ├─ http.ts             # axios/fetch wrapper
│   ├─ user.service.ts
│   ├─ auth.service.ts
│   └─ ...
│
├─ store/                  # global state (Zustand, Jotai, Redux)
│   ├─ user.store.ts
│   └─ theme.store.ts
│
├─ utils/                  # pure functions & helpers
│   ├─ numbers.ts
│   ├─ dates.ts
│   └─ ...
│
├─ assets/                 # images, fonts, svgs
│   ├─ logo.svg
│   └─ ...
│
└─ lib/                    # wrappers for external libraries
    ├─ axios.ts
    └─ supabase.ts
