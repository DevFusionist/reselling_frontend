# CommerceOS Frontend

Multi-Model E-Commerce Platform (Direct Sales + Reseller Commissions) built with Next.js 14+ (App Router), React Server Components (RSC), TypeScript, and Tailwind CSS.

## Features

- 🚀 **Server-Side Rendering (SSR)** for SEO optimization
- 🔐 **Authentication** with cookie-based sessions
- 💰 **Wallet Dashboard** for tracking earnings and commissions
- 🛍️ **Product Pages** with dynamic metadata for social sharing
- 🔗 **Reseller Links** with shareId parameter support
- 📱 **Responsive Design** with Tailwind CSS
- ⚡ **Performance Optimized** with Next.js Image optimization

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** Zustand, React Query
- **Validation:** Zod
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js v18.17 or later
- Backend API must be running (Auth, Products, Orders endpoints)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
# Server-Side Only (RSC & API Routes)
API_SECRET_KEY=your_secret_key
INTERNAL_API_URL=http://backend-service:3000

# Client Accessible (Browser)
NEXT_PUBLIC_API_URL=https://api.commerceos.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_123456789
NEXT_PUBLIC_SITE_URL=https://commerceos.com
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure

```
src/
├── app/
│   ├── (auth)/                # Route Group (doesn't affect URL path)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/             # Protected Routes
│   │   ├── layout.tsx         # Dashboard Shell (Sidebar)
│   │   └── page.tsx           # Main Wallet View
│   ├── product/[slug]/        # Dynamic Product Routes
│   │   ├── loading.tsx        # Suspense Fallback (Skeleton)
│   │   └── page.tsx           # Main Product Page (RSC)
│   ├── layout.tsx             # Root Layout
│   └── page.tsx               # Homepage
├── components/
│   ├── server/                # RSCs (e.g., ProductDetails)
│   ├── client/                # Client components (e.g., BuyButton)
│   └── ui/                    # UI Components (e.g., Skeletons)
├── lib/
│   ├── actions.ts             # Server Actions (Mutations)
│   ├── session.ts             # Cookie/JWT handling
│   └── utils.ts               # Utility functions
└── middleware.ts              # Edge Middleware
```

## Key Features Implementation

### Product Pages with SEO & Reseller Logic

Product pages use Server Components to fetch and render product data on the server, ensuring proper SEO and correct pricing for reseller links (shareId parameter).

### Authentication Middleware

Routes are protected at the edge using Next.js Middleware. The middleware checks for authentication tokens and redirects users accordingly.

### Server Actions

Form submissions (like adding to cart) are handled using Server Actions, eliminating the need for separate API routes.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting

**Q: Why is localStorage undefined?**
A: You are trying to access browser APIs in a Server Component. Move that logic to a Client Component ('use client') or use useEffect.

**Q: Why do my reseller links show the wrong price on WhatsApp?**
A: Ensure your generateMetadata function in page.tsx is async and fetching the price using the shareId from searchParams. Do not rely on client-side fetching for meta tags.

**Q: Styles are missing on initial load?**
A: Ensure you are importing globals.css in src/app/layout.tsx.

## License

Private - All rights reserved
