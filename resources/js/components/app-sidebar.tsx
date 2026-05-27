import { Link } from '@inertiajs/react';
import { LayoutGrid, Package, MapPin, ToggleRight } from 'lucide-react';
import BackToHomepage from '@/components/back-to-homepage';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { dashboard, product } from '@/routes';
import { stayPoint } from '@/routes/umkm';
// import { storeStatus } from '@/routes/storeStatus';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';


export function AppSidebar() {
    const { user } = useAuth();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Product',
            href: product(),
            icon: Package,
        },
        ...(user?.is_umkm && user?.umkm?.type === 'KELILING'
            ? [
                {
                    title: 'Stay Point',
                    href: stayPoint(),
                    icon: MapPin,
                }
            ]
            : []
        ),
        // {
        //     title: 'Store Status',
        //     href: storeStatus(),
        //     icon: ToggleRight,
        // }
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <BackToHomepage />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
