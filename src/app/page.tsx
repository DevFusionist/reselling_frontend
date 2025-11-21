import Hero from "@/components/Hero/Hero";
import Features from "@/components/Features/Features";
import Categories from "@/components/Categories/Categories";
import Trending from "@/components/Trending/Trending";
import Testimonials from "@/components/Testimonials/Testimonials";
import CTA from "@/components/CTA/CTA";
import Footer from "@/components/Footer/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Trending />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
