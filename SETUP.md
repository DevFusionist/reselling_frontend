# Frontend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd my-app
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the `my-app` directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Features Implemented

### ✅ Core Features
- [x] Next.js 14+ with App Router
- [x] TypeScript with strict mode
- [x] Tailwind CSS + shadcn/ui
- [x] GSAP animations
- [x] Responsive design
- [x] SEO optimization (SSR, metadata, structured data, sitemap)

### ✅ Authentication
- [x] Login/Register pages
- [x] JWT token management
- [x] Auto token refresh
- [x] Protected routes
- [x] Role-based access (Admin, Customer, Reseller)

### ✅ Product Features
- [x] Product listing (SSR)
- [x] Product detail pages (SSR with SEO)
- [x] Category filtering
- [x] Product variants
- [x] Image galleries

### ✅ Shopping Cart
- [x] Add/remove items
- [x] Quantity management
- [x] Persistent cart (localStorage)
- [x] Price calculations

### ✅ Checkout & Orders
- [x] Checkout flow
- [x] Razorpay payment integration
- [x] Order creation
- [x] Order history
- [x] Order details

### ✅ Reseller Features
- [x] Wallet dashboard
- [x] Transaction history
- [x] Payout requests
- [x] Share link creation
- [x] Share link statistics
- [x] Share link pages (SSR)

### ✅ UI/UX
- [x] Modern, sleek design
- [x] GSAP animations
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Responsive on all devices

## Project Structure

```
my-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages
│   ├── (shop)/              # Shop pages
│   │   ├── products/        # Product listing
│   │   ├── product/[slug]/  # Product detail (SSR)
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   ├── orders/          # Order management
│   │   ├── wallet/          # Reseller wallet
│   │   └── share-links/      # Share link management
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage (SSR)
│   ├── sitemap.ts           # SEO sitemap
│   └── robots.ts            # SEO robots.txt
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── product/             # Product components
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout components
│   ├── wallet/             # Wallet components
│   ├── share-link/         # Share link components
│   └── animations/         # GSAP animation wrappers
├── contexts/               # React contexts
│   └── AuthContext.tsx     # Authentication context
├── hooks/                   # Custom hooks
│   ├── useCart.ts          # Cart management
│   └── useGSAP.ts          # GSAP animations
├── lib/                     # Utilities
│   ├── api/                 # API client
│   └── utils.ts             # Helper functions
├── services/                # API services
│   ├── auth.ts
│   ├── products.ts
│   ├── orders.ts
│   ├── payments.ts
│   ├── pricing.ts
│   ├── wallet.ts
│   └── shareLinks.ts
└── types/                   # TypeScript types
    └── index.ts
```

## API Integration

All API calls go through the centralized API client at `lib/api/client.ts` which handles:
- Authentication tokens
- Token refresh
- Error handling
- Request/response interceptors

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | - |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL for SEO | - |

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Key Features

### SEO Optimization
- Server-Side Rendering for product pages
- Proper metadata for all pages
- Structured data (JSON-LD) for products
- Sitemap generation
- robots.txt configuration

### Performance
- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Optimized bundle size

### Animations
- GSAP for smooth animations
- Fade-in effects
- Slide-in animations
- Scale animations
- Respects `prefers-reduced-motion`

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized for all screen sizes

## Next Steps

1. **Backend Connection**: Ensure the backend is running on `http://localhost:3000`
2. **Razorpay Setup**: Add your Razorpay Key ID to `.env.local`
3. **Test Features**: Test all flows (auth, cart, checkout, payments)
4. **Customize**: Update branding, colors, and content
5. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure backend is running
- Check CORS settings in backend

### Razorpay Issues
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Check Razorpay dashboard for webhook configuration
- Ensure payment webhook URL is publicly accessible

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Support

For issues or questions, refer to:
- Backend README: `../reseller-backend/README.md`
- Next.js Docs: https://nextjs.org/docs
- shadcn/ui Docs: https://ui.shadcn.com

