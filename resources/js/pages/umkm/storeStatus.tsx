// import { Head, router } from '@inertiajs/react';
// import AppLayout from '@/layouts/app-layout';
// import CtaCard from '@/components/khaslana/dashboard/cta-card';
// import { useState } from 'react';
// import { useAuth } from '@/hooks/use-auth';
// // import { storeStatus } from '@/routes/storeStatus';
// import type { BreadcrumbItem } from '@/types';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Store Status',
//         href: storeStatus(),
//     },
// ];

// type Props = {
//     isOpen: boolean;
// };

// export default function StoreStatus({ isOpen }: Props) {

//     const { user } = useAuth();

//     const [enabled, setEnabled] = useState<boolean>(isOpen);

//     const toggleStore = () => {
//         router.post('/store-status', {
//             is_open: !enabled,
//         });

//         setEnabled(!enabled);
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Store Status" />

//             {/* {!user.is_umkm ? (
//                 <CtaCard />
//             ) : ( */}
//                 <div className="p-6">
//                     <div className="w-full rounded-2xl border bg-dark p-6 shadow-sm">

//                         <h1 className="mb-2 text-2xl font-bold">
//                             Store Status
//                         </h1>

//                         <p className="mb-6 text-sm text-gray-500">
//                             Control your store operational status.
//                         </p>

//                         <div className="flex items-center justify-between rounded-xl border p-4">

//                             <div>
//                                 <h2 className="font-semibold">
//                                     {enabled
//                                         ? 'Store Open'
//                                         : 'Store Closed'}
//                                 </h2>

//                                 <p className="text-sm text-gray-500">
//                                     {enabled
//                                         ? 'Customers can place orders.'
//                                         : 'Customers cannot place orders.'}
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={toggleStore}
//                                 className={`rounded-lg px-5 py-2 text-sm font-medium text-white transition ${
//                                     enabled
//                                         ? 'bg-green-500 hover:bg-green-600'
//                                         : 'bg-red-500 hover:bg-red-600'
//                                 }`}
//                             >
//                                 {enabled ? 'OPEN' : 'CLOSED'}
//                             </button>

//                         </div>
//                     </div>
//                 </div>
//             {/* )} */}
//         </AppLayout>
//     );
// }