import Hero from '@/components/sections/Hero';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import BrandStory from '@/components/sections/BrandStory';
import LuxaryStatement from '@/components/sections/LuxaryStatement';
import ResellerCTASection from '@/components/sections/ResellerCTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <ResellerCTASection />
      <LuxaryStatement />
      <BrandStory /> 
    </>
  );
}
