import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
            {children}
        </div>
    </AppLayoutTemplate>
);
