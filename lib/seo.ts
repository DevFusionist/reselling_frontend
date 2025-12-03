interface ProductSchemaData {
  title: string;
  description?: string;
  sku?: string;
  base_price: number | string;
  images?: string[];
  stock?: number;
  url?: string;
}

export function generateProductSchema(product: ProductSchemaData) {
  // Handle price as string or number
  const price = typeof product.base_price === 'string' 
    ? parseFloat(product.base_price) 
    : product.base_price;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images || [],
    description: product.description || '',
    sku: product.sku || '',
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'USD',
      availability: product.stock && product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      ...(product.url && { url: product.url }),
    }
  }
}
