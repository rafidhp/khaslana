import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
// import { edit as editAppearance } from '@/routes/appearance';
import { storeManagement } from '@/routes';
import { edit } from '@/routes/profile';
// import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import type { NavItem } from '@/types';


export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentUrl } = useCurrentUrl();
    const { user } = useAuth();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Profil',
            href: edit(),
            icon: null,
        },
        {
            title: user.is_umkm ? 'Kelola Toko' : 'Data UMKM',
            href: storeManagement(),
            icon: null,
        },
        {
            title: 'Password',
            href: editPassword(),
            icon: null,
        },
        // {
        //     title: 'Two-Factor Auth',
        //     href: show(),
        //     icon: null,
        // },
    ];

    return (
        <div className="px-4 py-6">
            <Heading
                title="Pengaturan"
                description="Kelola profilmu dan pengaturan akunmu"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-2 space-x-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-[#99FF33] hover:bg-[#99FF33] text-black hover:text-black': isCurrentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 w-full">
                    <section className="w-full space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
