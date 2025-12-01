import { Metadata } from 'next';
import { generateProductSchema } from '@/lib/seo';

// Mock product data - in production, this would be fetched based on slug
const getProductData = (slug: string) => {
  // This is a placeholder - in production, fetch from your data source
  return {
    name: 'Nocturne Lumina Desk Globe',
    description: 'A meticulously crafted, oversized desk globe featuring continents rendered in polished obsidian, oceans in deep, swirling sapphire resin, and major cities marked by subtle, inlaid mother-of-pearl.',
    price: '9,800.00',
    sku: 'NOCT-LUM-001',
    images: [
      'https://placehold.co/800x800/28242D/F0EAD6?text=Main+Globe',
      'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+1',
      'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+2',
      'https://placehold.co/800x800/28242D/F0EAD6?text=Globe+Detail+3',
    ],
  };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductData(params.slug);
  
  return {
    title: `${product.name} | Velvet Zenith`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const product = getProductData(params.slug);
  
  // Generate structured data for SEO (server-side, in initial HTML)
  const productSchema = generateProductSchema({
    ...product,
    price: product.price.replace(',', ''),
  });

  return (
    <>
      {/* SEO Structured Data - Server-side rendered, visible to search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}

