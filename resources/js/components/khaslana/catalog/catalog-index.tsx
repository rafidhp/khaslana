import { useMemo, useState } from 'react';
import { HeroSection } from '@/components/khaslana/catalog/hero-section';
import { PaginationSection } from '@/components/khaslana/catalog/pagination-section';
import { ProductCard } from '@/components/khaslana/catalog/product-card';
import type { PaginatedProducts } from '@/types/paginated-product';

interface Category {
    name: string;
}

interface CatalogIndexProps {
    categories: Category[];
    products: PaginatedProducts;
}

export default function CatalogIndex({
    categories,
    products,
}: CatalogIndexProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredProducts = useMemo(() => {
        return products.data.filter((product) => {
            const matchCategory =
                selectedCategory === ''
                    ? true
                    : product.category?.name === selectedCategory;

            const keyword = search.toLowerCase();

            const matchSearch =
                product.name.toLowerCase().includes(keyword) ||
                product.description.toLowerCase().includes(keyword) ||
                product.umkm?.store_name
                    ?.toLowerCase()
                    .includes(keyword);

            return matchCategory && matchSearch;
        });
    }, [products, search, selectedCategory]);

    return (
        <div className="flex flex-col w-full px-6 pt-32 lg:px-17.5 mx-auto">
            <HeroSection
                categories={categories}
                search={search}
                selectedCategory={selectedCategory}
                onSearchChange={setSearch}
                onCategoryChange={setSelectedCategory}
            />

            {/* TODO: on going */}
            {/* <FeaturedProduct /> */}
            <ProductCard products={filteredProducts} />
            <PaginationSection products={products} />
        </div>
    );
}