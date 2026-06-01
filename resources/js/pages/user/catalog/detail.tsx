import Index from "@/components/khaslana/catalog/detail";
import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog } from "@/routes";
import type { Product } from "@/types/product";

interface DetailProps {
    product: Product;
}

export default function Detail({
    product,
}: DetailProps) {
    return (
        <UnusedNavLayout backHref={catalog().url}>
            <Index product={product} />
        </UnusedNavLayout>
    )
}