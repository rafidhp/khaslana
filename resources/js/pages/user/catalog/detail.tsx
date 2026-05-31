import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog } from "@/routes";
import type { Product } from "@/types/product";

interface DetailProps {
    product: Product;
}

export default function Detail({
    product,
}: DetailProps) {
    console.log(product);

    return (
        <UnusedNavLayout backHref={catalog().url}>
            Ini Detail
        </UnusedNavLayout>
    )
}