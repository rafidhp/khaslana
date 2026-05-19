import UnusedNavLayout from "@/layouts/unused-nav-layout";
import { catalog } from "@/routes";

export default function Index() {
    return (
        <UnusedNavLayout backHref={catalog().url}>
            Ini Detail
        </UnusedNavLayout>
    )
}