import './globals.css';

export const metadata = {
  title: {
    default: 'Ethos — Elegant Technology and Curated Commerce',
    template: '%s | Ethos'
  },
  description: 'Where high-definition technology disappears into elegant design. Discover premium wearables, home audio, workspace solutions, and lifestyle products. Ethos: Elegant Technology. Essential Living.',
  keywords: ['luxury technology', 'smart wearables', 'home audio', 'workspace solutions', 'minimalist design', 'premium electronics', 'design services', 'curated commerce'],
  authors: [{ name: 'Ethos Technologies' }],
  creator: 'Ethos Technologies',
  publisher: 'Ethos Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ethos.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethos.com',
    title: 'Ethos — Elegant Technology and Curated Commerce',
    description: 'Where high-definition technology disappears into elegant design. This is Ethos.',
    siteName: 'Ethos',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Ethos - Elegant Technology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethos — Elegant Technology and Curated Commerce',
    description: 'Where high-definition technology disappears into elegant design. This is Ethos.',
    images: ['/images/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <main>{children}</main>
      </body>
    </html>
  );
}
