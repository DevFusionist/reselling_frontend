import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 px-6 sm:px-16 text-center">
      <h2 className="text-4xl font-semibold mb-4">Ready to Explore?</h2>
      <p className="text-muted-foreground mb-8">
        Join thousands of shoppers discovering premium products daily.
      </p>
      <Button
        size="lg"
        className="rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform"
      >
        Browse Collection
      </Button>
    </section>
  );
}
