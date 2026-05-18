import antingImg from "@/assets/images/catalog/anting-perak.png";
import kopiImg from "@/assets/images/catalog/kopi-gayo.png";
import sendalImg from "@/assets/images/catalog/sendal-garut.png";
import vaseImg from "@/assets/images/catalog/vase-keramik.png";
import { HeroSection } from './hero-section';
import { PaginationSection } from './pagination-section';
import { ProductCard } from './product-card';

export default function CatalogIndex() {
    const productsData = [
        { id: 1, name: "Vase Keramik Kasongan", price: "Rp 185.000", image: vaseImg, discount: "67%", rating: "4.9", location: "Kab. Bandung", sold: "205", slug: "vase-keramik-kasongan" },
        { id: 2, name: "Sandalias Kulit Garut", price: "Rp 320.000", image: sendalImg, rating: "4.5", location: "Kab. Bandung", sold: "102", slug: "sendal-kulit-garut" },
        { id: 3, name: "Kopi Arabica Gayo", price: "Rp 145.000", image: kopiImg, discount: "19%", rating: "4.5", location: "Kab. Bandung", sold: "103", slug: "kopi-arabica-gayo" },
        { id: 4, name: "Anting Perak Kotagede", price: "Rp 450.000", image: antingImg, rating: "4.5", location: "Kab. Bandung", sold: "108", slug: "anting-perak-kotagede" }
    ];

    const displayProducts = Array.from({ length: 24 }, (_, i) => ({
        ...productsData[i % productsData.length],
        id: i + 1
    }));

    return (
        <div className="flex flex-col w-full px-6 lg:px-[55px] mx-auto max-w-[1600px] grow">
            <HeroSection />

            <section className="flex flex-col gap-6 pt-5 pb-[60px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
                <PaginationSection />
            </section>
        </div>
    );
}