import AppLayout from '@/layouts/app-layout';
import { product } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Product',
    href: product().url,
  },
];

export default function Product() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4'>
        {/* header */}
        <div className="flex flex-col align-items-center gap-2">
          <h1 className="text-3xl font-bold">
            Product
          </h1>
          <p className="text-muted-foreground">
            Manage your products
          </p>
        </div>

        {/* content */}
        <div>ini content</div>
      </div>
    </AppLayout>
  )
}