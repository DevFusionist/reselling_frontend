# Reseller E-commerce Frontend

Modern, SEO-optimized e-commerce frontend built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn UI.

## Features

- 🚀 **Next.js 14+** with App Router and Server-Side Rendering
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui components
- ✨ **GSAP Animations** for smooth, interactive experiences
- 📱 **Fully Responsive** design for all devices
- 🔐 **Authentication** with JWT tokens
- 🛒 **Shopping Cart** with persistent storage
- 💳 **Razorpay Integration** for payments
- 👥 **Multi-role Support** (Admin, Customer, Reseller)
- 💰 **Wallet System** for resellers
- 🔗 **Share Links** for reseller marketing
- 📊 **SEO Optimized** with proper metadata and SSR

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: GSAP
- **State Management**: Zustand, React Context
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see reseller-backend)

### Installation

1. Clone the repository:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shop pages
│   ├── product/[slug]/    # Product detail pages (SSR)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── product/          # Product components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and API client
├── services/             # API service functions
└── types/                # TypeScript types
```

## Key Features

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- Role-based access control

### Products
- Product listing with pagination
- Product detail pages (SSR for SEO)
- Category filtering
- Search functionality
- Variant selection

### Cart
- Persistent cart (localStorage)
- Quantity management
- Price calculations
- Empty state handling

### Checkout
- Multi-step checkout flow
- Address management
- Razorpay payment integration
- Order confirmation

### Reseller Features
- Wallet dashboard
- Transaction history
- Payout requests
- Share link generation
- Link statistics

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

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay Key ID

## Performance Optimization

- Server-Side Rendering for SEO-critical pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Proper caching strategies
- Bundle size optimization

## SEO

- Server-Side Rendering
- Proper metadata for all pages
- Structured data (JSON-LD)
- Semantic HTML
- Sitemap generation

## License

MIT

