import HeroSection from "@/components/khaslana/catalog/detail/hero-section";
import type { Product } from "@/types/product"

interface IndexProps {
    product: Product;
}

export default function Index({
    product,
}: IndexProps) {
    return (
        <div className="flex flex-col mb-12">
            <HeroSection product={product} />
        </div>
    )
}