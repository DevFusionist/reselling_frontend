import ProductCard from '@/components/cards/ProductCard';

const featuredProducts = [
  { id: 1, name: 'Obsidian Chronograph', price: '9,450', imagePlaceholder: '/images/watch.png' },
  { id: 2, name: 'Aetherial Wallet', price: '1,200', imagePlaceholder: '/images/wallet.png' },
  { id: 3, name: 'Siena Leather Bag', price: '14,800', imagePlaceholder: '/images/handbag.png' },
  { id: 4, name: 'Scent', price: '3,100', imagePlaceholder: '/images/scent.png' },
];

export default function FeaturedCollection() {
  return (
    <section className="py-25 max-w-7xl mx-auto px-6">
      <h2 className="font-headings text-5xl text-center text-text-cream mb-20">Curated for Elegance</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>
    </section>
  );
}
