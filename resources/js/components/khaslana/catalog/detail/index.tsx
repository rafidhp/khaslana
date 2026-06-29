import HeroSection from "@/components/khaslana/catalog/detail/hero-section";
import type { Product } from "@/types/product"

import ReviewSection from "@/components/khaslana/catalog/detail/review-section";

interface IndexProps {
    product: Product;
}

export default function Index({
    product,
}: IndexProps) {
    return (
        <div className="flex flex-col gap-20 mb-18">
            <HeroSection product={product} />
            <ReviewSection product={product} />
        </div>
    )
}