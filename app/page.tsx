import Hero from '@/components/sections/Hero';
import CategoryLinks from '@/components/sections/CategoryLinks';
import ProductGridSection from '@/components/sections/ProductGridSection';
import PromotionalBreak from '@/components/sections/PromotionalBreak';
import TrustSignals from '@/components/sections/TrustSignals';

export default function Home() {
  return (
    <>
      {/* Hero Section - Rotating Billboard */}
      <Hero />
      
      {/* Section 1: Visual Category Links */}
      <CategoryLinks />
      
      {/* Section 2: Product Grid A - New Arrivals */}
      <ProductGridSection 
        title="New Arrivals" 
        apiParams={{ sort_by: 'created_at', sort_order: 'desc' }}
        limit={4}
      />
      
      {/* Section 3: Promotional Break */}
      <PromotionalBreak 
        title="Up to 40% off Winter Gear"
        subtitle="Shop our curated collection of premium winter essentials"
        ctaText="Shop Now"
        ctaLink="/shop"
      />
      
      {/* Section 4: Product Grid B - Best Sellers */}
      <ProductGridSection 
        title="Best Sellers" 
        apiParams={{ is_featured: true }}
        limit={4}
      />
      
      {/* Section 5: Trust Signals Bar */}
      <TrustSignals />
    </>
  );
}
