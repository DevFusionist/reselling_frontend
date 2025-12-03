import { Metadata } from 'next';
import { generateProductSchema } from '@/lib/seo';
import { fetchProductServerSide } from '@/lib/api-server';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Parse product ID from slug
  const productId = parseInt(params.slug);
  
  // If slug is not a valid product ID, return default metadata
  if (isNaN(productId)) {
    return {
      title: 'Product Not Found | Velvet Zenith',
      description: 'The requested product could not be found.',
    };
  }

  // Fetch real product data
  const response = await fetchProductServerSide(productId);
  
  if (!response.success || !response.data) {
    return {
      title: 'Product Not Found | Velvet Zenith',
      description: response.message || 'The requested product could not be found.',
    };
  }

  // API response structure: product fields directly on data, with images array
  const productData = response.data;
  const images = response.data.images || [];
  
  // Ensure product exists
  if (!productData || !('title' in productData)) {
    return {
      title: 'Product Not Found | Velvet Zenith',
      description: 'The requested product could not be found.',
    };
  }
  
  const product = productData;
  
  // Get images sorted by display_order
  const productImages = images
    ?.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
    .map((img: { image_url: string }) => img.image_url) || [];
  
  // Use images from API, fallback to product.image_url/image_urls
  const allImages = productImages.length > 0
    ? productImages
    : (product.image_url ? [product.image_url] : product.image_urls || []);
  
  // Format price
  const price = typeof product.base_price === 'string' 
    ? parseFloat(product.base_price) 
    : product.base_price;
  
  const formattedPrice = price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const productTitle = product.title || 'Product';
  const productDescription = product.description || `${productTitle} - Available at Velvet Zenith`;
  
  return {
    title: `${productTitle} | Velvet Zenith`,
    description: productDescription,
    openGraph: {
      title: productTitle,
      description: productDescription,
      images: allImages.length > 0 ? allImages : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription,
      images: allImages.length > 0 ? allImages : undefined,
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  // Parse product ID from slug
  const productId = parseInt(params.slug);
  
  let productSchema = null;
  
  // Only generate schema if we have a valid product ID
  if (!isNaN(productId)) {
    // Fetch real product data
    const response = await fetchProductServerSide(productId);

    if (response.success && response.data) {
      try {
        // API response structure: product fields directly on data, with images array
        const productData = response.data;
        const images = response.data.images || [];
        
        // Ensure product exists and has required properties
        if (!productData || !('title' in productData)) {
          console.error('Product data is missing or invalid in API response');
          return (
            <>
              {children}
            </>
          );
        }
        
        // Get images sorted by display_order
        const productImages = images && Array.isArray(images) && images.length > 0
          ? images
              .sort((a: { display_order?: number }, b: { display_order?: number }) => (a.display_order || 0) - (b.display_order || 0))
              .map((img: { image_url: string }) => img.image_url)
              .filter((url: string) => url) // Filter out any empty URLs
          : [];
        
        // Use images from API, fallback to product.image_url/image_urls
        const allImages = productImages.length > 0
          ? productImages
          : (productData.image_url ? [productData.image_url] : (productData.image_urls || []));
        
        // Construct product URL (use environment variable or default)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://velvetzenith.com';
        const productUrl = `${baseUrl}/shop/${productId}`;
        
        // Generate structured data for SEO (server-side, in initial HTML)
        productSchema = generateProductSchema({
          title: productData.title || 'Product',
          description: productData.description || '',
          sku: productData.sku,
          base_price: productData.base_price || 0,
          images: allImages,
          stock: productData.stock,
          url: productUrl,
        });
      } catch (schemaError: any) {
        console.error('Error generating product schema:', schemaError);
        // Continue without schema rather than breaking the page
      }
    }
  }

  return (
    <>
      {/* SEO Structured Data - Server-side rendered, visible to search engines */}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {children}
    </>
  );
}

