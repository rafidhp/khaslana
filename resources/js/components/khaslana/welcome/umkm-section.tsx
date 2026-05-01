import AntingPerak from '@/assets/images/landing-page/umkm-section/anting-perak.png';
import KopiGayo from '@/assets/images/landing-page/umkm-section/kopi-gayo.png';
import SendalGarut from '@/assets/images/landing-page/umkm-section/sendal-garut.png';
import VasKeramik from '@/assets/images/landing-page/umkm-section/vas-keramik.png';

const products = [
    {
        name: "Vase Keramik Kasongan",
        price: "Rp 185.000",
        image: VasKeramik,
    },
    {
        name: "Sandalias Kulit Garut",
        price: "Rp 320.000",
        image: SendalGarut,
    },
    {
        name: "Kopi Arabica Gayo",
        price: "Rp 85.000",
        image: KopiGayo,
    },
    {
        name: "Anting Perak Kotagede",
        price: "Rp 450.000",
        image: AntingPerak,
    },
];

export default function UmkmSection() {
    return (
        <section className="umkm-section flex flex-col items-center justify-center min-h-screen h-auto py-5 px-13.75 gap-7.5">
            <h2 className='font-medium text-[40px] text-center mb-12 text-white'>
                Bersama Kami Menjadi Gerbang Digital{" "}
                <span className='text-[#99ff33]'>
                    UMKM Indonesia
                </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl mb-8 px-6">
                {products.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col bg-[#3d3c3b] rounded-lg overflow-hidden"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="flex flex-col gap-2 p-5">
                            <h4 className="font-semibold text-white">
                                {item.name}
                            </h4>
                            <h4 className="text-[#99ff33]">
                                {item.price}
                            </h4>
                            <div className="flex items-center justify-center text-center border border-[#494847] py-2.5 w-full rounded-lg mt-2 text-white hover:border-[#99ff33] hover:cursor-pointer transition">
                                <p className="w-full text-[13px]">
                                    + Add to Cart
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center w-screen rounded-[50%] px-0 md:px-20 gap-7.5">
                <div className="h-px w-full bg-[#99ff33] flex-1"></div>
                <a href="#" className="btn-secondary-khaslana">Lihat Semua</a>
                <div className="h-px w-full bg-[#99ff33] flex-1"></div>
            </div>
        </section>
    )
}