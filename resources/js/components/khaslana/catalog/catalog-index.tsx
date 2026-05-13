import { HeroSection } from '@/components/khaslana/catalog/hero-section';
import { PaginationSection } from '@/components/khaslana/catalog/pagination-section';
import { ProductCard } from '@/components/khaslana/catalog/product-card';
// Import data dummy
import { displayProducts } from '@/components/khaslana/catalog/product-data';

export default function CatalogIndex() {

    return (
        <div className="flex flex-col w-full px-6 lg:px-[70px] mx-auto">
            <HeroSection />

            <section className="flex flex-col gap-6 pt-5 pb-[60px]">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
                <PaginationSection />
            </section>
        </div>
    );
}