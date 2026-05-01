import { Head } from '@inertiajs/react';

// Import komponen-komponen Katalog
import { FeaturedProduct } from '@/components/catalogs/featured-product';
import { HeroSection } from '@/components/catalogs/hero-section';
import { LoggedInNavbar } from '@/components/catalogs/logged-in-navbar';
import { PaginationSection } from '@/components/catalogs/pagination-section';
import { ProductCard } from '@/components/catalogs/product-card';
import Footer from '@/components/khaslana/footer';

// Import Aset Gambar
import antingImg from "@/assets/images/katalog/anting-perak.png";
import kopiImg from "@/assets/images/katalog/kopi-gayo.png";
import sendalImg from "@/assets/images/katalog/sendal-garut.png";
import vaseImg from "@/assets/images/katalog/vase-keramik.png";

export default function Catalog() {
    // 1. Data Dummy dalam Array
    const productsData = [
        {
            id: 1,
            name: "Vase Keramik Kasongan",
            price: "Rp 185.000",
            image: vaseImg,
            discount: "67%",
            rating: "4.9",
            location: "Kab. Bandung",
            sold: "205",
            slug: "vase-keramik-kasongan"
        },
        {
            id: 2,
            name: "Sandalias Kulit Garut",
            price: "Rp 320.000",
            image: sendalImg,
            rating: "4.5",
            location: "Kab. Bandung",
            sold: "102",
            slug: "sendal-kulit-garut"
        },
        {
            id: 3,
            name: "Kopi Arabica Gayo",
            price: "Rp 145.000",
            image: kopiImg,
            discount: "19%",
            rating: "4.5",
            location: "Kab. Bandung",
            sold: "103",
            slug: "kopi-arabica-gayo"
        },
        {
            id: 4,
            name: "Anting Perak Kotagede",
            price: "Rp 450.000",
            image: antingImg,
            rating: "4.5",
            location: "Kab. Bandung",
            sold: "108",
            slug: "anting-perak-kotagede"
        }
    ];

    // 2. Looping data Dummy
    const displayProducts = Array.from({ length: 8 }, (_, i) => ({
        ...productsData[i % productsData.length],
        id: i + 1
    }));

    return (
        <div className="bg-[#1E1B26] min-h-screen flex flex-col relative w-full overflow-x-hidden font-sans">
            <Head title="Katalog - Khaslana" />
            
            <LoggedInNavbar />

            {/* Main Content Katalog */}
            <main className="flex flex-col px-6 lg:px-[55px] mx-auto max-w-[1600px] w-full flex-grow">
                <HeroSection />
                <FeaturedProduct />
                
                <section className="flex flex-col gap-6 pt-5 pb-[60px]">
                    {/* 3. Looping Grid menggunakan .map() */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayProducts.map((product) => (
                            <ProductCard 
                                key={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                discount={product.discount}
                                rating={product.rating}
                                location={product.location}
                                sold={product.sold}
                                slug={product.slug}
                            />
                        ))}
                    </div>

                    <PaginationSection />
                </section>
            </main>

            <Footer />
        </div>
    );
}
