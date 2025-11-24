import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";
import Categories from "@/components/Categories/Categories";
import Trending from "@/components/Trending/Trending";
import Testimonials from "@/components/Testimonials/Testimonials";
import CTA from "@/components/CTA/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Trending />
      <Testimonials />
      <CTA />    </>
  );
}
