import { FeaturedProduct } from '@/components/khaslana/catalog/featured-product';
import { HeroSection } from '@/components/khaslana/catalog/hero-section';
import { PaginationSection } from '@/components/khaslana/catalog/pagination-section';
import { ProductCard } from '@/components/khaslana/catalog/product-card';
import { displayProducts } from '@/components/khaslana/catalog/product-data';

export default function CatalogIndex() {
    return (
        <div className="flex flex-col w-full px-6 lg:px-[70px] mx-auto">
            <HeroSection />

            <section className="flex flex-col gap-6 pt-5 pb-[60px]">
                {/* Menampilkan Card Batik & Sambal di atas Grid */}
                <FeaturedProduct />

                {/* Grid Produk Utama dengan spacing yang disesuaikan */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
                
                <PaginationSection />
            </section>
        </div>
    );
}