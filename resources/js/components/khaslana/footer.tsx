import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import Instagram from '@/assets/icons/footer/instagram.png';
import Linkedin from '@/assets/icons/footer/linkedin.png';
import Location from '@/assets/icons/footer/location_icon.png';
import Phone from '@/assets/icons/footer/phone_icon.png';
import Youtube from '@/assets/icons/footer/yt.png';
import Khaslana from '@/assets/images/landing-page/Khaslana.svg';
import Mail from '@/assets/images/landing-page/Vector.svg';
import { catalog, umkm, community, about, devPage } from '@/routes';

const socials = [
    {
        name: "Instagram",
        icon: Instagram,
        link: "https://www.instagram.com/khaslana.official"
    },
    {
        name: "Youtube",
        icon: Youtube,
        link: "https://www.youtube.com/@khaslana-official"
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        link: "https://www.linkedin.com/in/khaslana-corp"
    },
];

export default function Footer() {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleAccordion = (item: string) => {
        setOpenItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    };

    const handleDevPage = () => {
        window.location.pathname = devPage().url;
    }

    return (
        <footer className="bg-[#262626] border-t pt-15 max-md:flex-col md:gap-7.5">
            <div className="w-full px-6 lg:px-[85px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-12 items-start">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-center lg:justify-start items-center gap-2.5">
                            <img
                                src={Khaslana}
                                alt="Khaslana logo"
                                className="w-16 h-17.5"
                            />
                            <span className="font-semibold text-white text-3xl">
                                Khaslana
                            </span>
                        </div>
                        <p className="text-white text-[16px] max-w-md self-center lg:self-baseline text-justify">
                            Khaslana adalah platform digital kolaboratif yang didedikasikan sebagai wadah pemberdayaan bagi UMKM lokal Indonesia.
                            Platform ini hadir untuk menjembatani produk-produk kreatif hasil karya anak bangsa, mulai dari kuliner, kerajinan tangan, 
                            hingga fashion, dengan pasar yang lebih luas melalui ekosistem yang modern dan inklusif. 
                        </p>
                        <div className="flex justify-center lg:justify-start gap-4 mt-1">
                            {socials.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    aria-label={item.name}
                                    target='_blank'
                                    className="flex items-center justify-center w-9 h-9 rounded-full border border-[#99FF33] hover:bg-[#99FF33] transition group"
                                >
                                    <img
                                        src={item.icon}
                                        alt={item.name}
                                        className="w-4 h-4 object-contain transition group-hover:invert"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                    {/* mobile accordion */}
                    <div className="flex flex-col md:hidden w-full border-t border-white/10">
                        {/* layanan */}
                        <div className="border-b border-white/10">
                            <button
                                onClick={() => toggleAccordion('layanan')}
                                className="
                                    flex items-center justify-between
                                    w-full py-5
                                    text-left
                                    hover:cursor-pointer
                                "
                            >
                                <span className="text-white text-xl font-semibold">
                                    Layanan
                                </span>
                                <ChevronRight
                                    className={`
                                        w-6 h-6 text-[#8D8D8D]
                                        transition-transform duration-300
                                        ${
                                            openItems.includes('layanan')
                                                ? 'rotate-90'
                                                : ''
                                        }
                                    `}
                                />
                            </button>
                            <div
                                className={`
                                    grid transition-all duration-300 ease-in-out
                                    ${
                                        openItems.includes('layanan')
                                            ? 'grid-rows-[1fr] opacity-100 pb-5'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }
                                `}
                            >
                                <ul className="flex flex-col gap-0 w-full overflow-hidden">
                                    <li>
                                        <a
                                            className="
                                                flex w-full pb-1
                                                text-[#B7B7B7]
                                                transition-all duration-200
                                                hover:text-[#99FF33]
                                                hover:translate-x-1
                                            "
                                            href={catalog().url}
                                        >
                                            Katalog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="
                                                flex w-full py-1
                                                text-[#B7B7B7]
                                                transition-all duration-200
                                                hover:text-[#99FF33]
                                                hover:translate-x-1
                                            "
                                            href={umkm().url}
                                        >
                                            List UMKM
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="
                                                flex w-full py-1
                                                text-[#B7B7B7]
                                                transition-all duration-200
                                                hover:text-[#99FF33]
                                                hover:translate-x-1
                                            "
                                            href={community().url}
                                        >
                                            Komunitas
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* sumber daya */}
                        <div className="border-b border-white/10">
                            <button
                                onClick={() => toggleAccordion('sumber-daya')}
                                className="
                                    flex items-center justify-between
                                    w-full py-5
                                    text-left
                                    hover:cursor-pointer
                                "
                            >
                                <span className="text-white text-xl font-semibold">
                                    Sumber Daya
                                </span>
                                <ChevronRight
                                    className={`
                                        w-6 h-6 text-[#8D8D8D]
                                        transition-transform duration-300
                                        ${
                                            openItems.includes('sumber-daya')
                                                ? 'rotate-90'
                                                : ''
                                        }
                                    `}
                                />
                            </button>
                            <div className={`
                                    grid transition-all duration-300 ease-in-out
                                    ${
                                        openItems.includes('sumber-daya')
                                            ? 'grid-rows-[1fr] opacity-100 pb-5'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }
                                `}
                            >
                                <ul className="flex flex-col w-full overflow-hidden">
                                    <li>
                                        <a
                                            className="
                                                flex w-full py-1
                                                text-[#B7B7B7]
                                                transition-all duration-200
                                                hover:text-[#99FF33]
                                                hover:translate-x-1
                                            "
                                            href="#"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="
                                                flex w-full py-1
                                                text-[#B7B7B7]
                                                transition-all duration-200
                                                hover:text-[#99FF33]
                                                hover:translate-x-1
                                            "
                                            href="#"
                                        >
                                            Syarat dan Ketentuan
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* contact */}
                        <div className="border-b border-white/10">
                            <button
                                onClick={() => toggleAccordion('kontak')}
                                className="
                                    flex items-center justify-between
                                    w-full py-5
                                    text-left
                                    hover:cursor-pointer
                                "
                            >
                                <span className="text-white text-xl font-semibold">
                                    Kontak
                                </span>
                                <ChevronRight
                                    className={`
                                        w-6 h-6 text-[#8D8D8D]
                                        transition-transform duration-300
                                        ${
                                            openItems.includes('kontak')
                                                ? 'rotate-90'
                                                : ''
                                        }
                                    `}
                                />
                            </button>
                            <div className={`
                                    grid transition-all duration-300 ease-in-out
                                    ${
                                        openItems.includes('kontak')
                                            ? 'grid-rows-[1fr] opacity-100 pb-5'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }
                                `}
                            >
                                <ul className="flex flex-col gap-4 w-full overflow-hidden">
                                    <li className="flex w-full py-1 text-[#B7B7B7] transition-all duration-200">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px me-2">
                                            <img
                                                src={Location}
                                                alt="location icon"
                                                className="w-3.5 h-3.5 object-contain"
                                            />
                                        </span>
                                        Cibiru, Jawa Barat, Indonesia
                                    </li>
                                    <li className="flex w-full py-1 text-[#B7B7B7] transition-all duration-200">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px me-2">
                                            <img
                                                src={Phone}
                                                alt="phone icon"
                                                className="w-3.5 h-3.5 object-contain"
                                            />
                                        </span>
                                        +62 851 9929 7123
                                    </li>
                                    <li className="flex w-full py-1 text-[#B7B7B7] transition-all duration-200 break-all">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px me-2">
                                            <img
                                                src={Mail}
                                                alt="mail icon"
                                                className="w-3.5 h-3.5 object-contain"
                                            />
                                        </span>
                                        khaslana.official@gmail.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* desktop list */}
                    <div className="hidden md:grid md:grid-cols-3 w-full">
                        <div className="flex flex-col gap-4 justify-self-start sm:justify-self-center">
                            <h5 className="text-white text-[18px] font-semibold m-0">
                                Layanan
                            </h5>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <a
                                        className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        href={catalog().url}
                                    >
                                        Katalog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        href={umkm().url}
                                    >
                                        List UMKM
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        href={community().url}
                                    >
                                        Komunitas
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4 justify-self-end sm:justify-self-center">
                            <h5 className="text-white text-[18px] font-semibold m-0">
                                Sumber Daya
                            </h5>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <a
                                        className="text-white cursor-pointer decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        onClick={handleDevPage}
                                    >
                                        Kebijakan Privasi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-white cursor-pointer decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        onClick={handleDevPage}
                                    >
                                        Syarat dan Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4 mt-4 sm:mt-0 col-span-2 sm:col-span-1 items-center sm:items-start text-center sm:text-left">
                            <h5 className="text-white text-[18px] font-semibold m-0">
                                Kontak
                            </h5>
                            <ul className="flex flex-col gap-3">
                                <li className="flex items-start gap-3 text-white text-[15px]">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Location}
                                            alt="location icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span>Cibiru, Jawa Barat, Indonesia</span>
                                </li>
                                <li className="flex items-start gap-3 text-white text-[15px]">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Phone}
                                            alt="phone icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span>+62 851 9929 7123</span>
                                </li>
                                <li className="flex items-start gap-3 text-white text-[15px] leading-relaxed">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Mail}
                                            alt="mail_icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span className='break-all'>khaslana.official@gmail.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-muted-foreground mb-3" />
                <div className="flex flex-col md:flex-row items-center justify-between py-5 gap-3 text-center md:text-left">
                    <p className="text-white text-[14px]">
                        &copy;2026 Khaslana. All rights reserved.
                    </p>
                    <div className="flex gap-7">
                        <a
                            className="text-white decoration-0 text-[14px] transition-colors duration-200 ease-in hover:text-[#989898]"
                            href={about().url}
                        >
                            Tentang Kami
                        </a>
                        <a
                            className="text-white cursor-pointer decoration-0 text-[14px] transition-colors duration-200 ease-in hover:text-[#989898]"
                            onClick={handleDevPage}
                        >
                            Kebijakan Privasi
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}