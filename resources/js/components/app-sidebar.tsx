import { Link } from '@inertiajs/react';
import { LayoutGrid, Package, MapPin, ClipboardList, TicketPercent} from 'lucide-react';

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
import { stayPoint } from '@/routes';
import { order } from '@/routes/dashboard';
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
        {
            title: 'Order',
            href: order(),
            icon: ClipboardList,
        },
        ...(user?.is_umkm && user?.umkm?.type === 'KELILING'
            ? [
                {
                    title: 'Stay Point',
                    href: stayPoint(),
                    icon: MapPin,
                },
            ]
            : []
        ),
        {
            title: 'Promo',
            href: '/store-management/promo',
            icon: TicketPercent,
        },
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
