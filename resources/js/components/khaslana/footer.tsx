import Instagram from '@/assets/icons/footer/instagram.png';
import Linkedin from '@/assets/icons/footer/linkedin.png';
import Location from '@/assets/icons/footer/location_icon.png';
import Phone from '@/assets/icons/footer/phone_icon.png';
import Youtube from '@/assets/icons/footer/yt.png';
import Khaslana from '@/assets/images/landing-page/Khaslana.svg';
import Mail from '@/assets/images/landing-page/Vector.svg';
import { catalog, umkm, community } from '@/routes';

const socials = [
    {
        name: "Instagram",
        icon: Instagram,
        link: "#"
    },
    {
        name: "Youtube",
        icon: Youtube,
        link: "#"
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        link: "#"
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#262626] border-t pt-15 max-md:flex-col md:gap-7.5">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pb-12 items-start">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            <img
                                src={Khaslana}
                                alt="Khaslana logo"
                                className="w-16 h-17.5"
                            />
                            <span className="font-semibold text-white text-3xl">
                                Khaslana
                            </span>
                        </div>
                        <p className="text-white text-[16px] max-w-md">
                            Khaslana adalah platform digital kolaboratif yang didedikasikan sebagai wadah pemberdayaan bagi UMKM lokal Indonesia.
                            Platform ini hadir untuk menjembatani produk-produk kreatif hasil karya anak bangsa, mulai dari kuliner, kerajinan tangan, 
                            hingga fashion, dengan pasar yang lebih luas melalui ekosistem yang modern dan inklusif. 
                        </p>
                        <div className="flex gap-4 mt-1">
                            {socials.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    aria-label={item.name}
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-4">
                            <h5 className="text-white text-[18px] font-semibold m-0">
                                Sumber Daya
                            </h5>
                            <ul className="flex flex-col gap-3">
                                <li>
                                    <a
                                        className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        href="#">
                                        Kebijakan Privasi
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]"
                                        href="#"
                                    >
                                        Syarat dan Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h5 className="text-white text-[18px] font-semibold m-0">
                                Kontak
                            </h5>
                            <ul className="flex flex-col gap-3">
                                <li className="flex items-start gap-2.25 text-white text-[15px]">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Location}
                                            alt="location icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span>Cibiru, Jawa Barat, Indonesia</span>
                                </li>
                                <li className="flex items-start gap-2.25 text-white text-[15px]">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Phone}
                                            alt="phone icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span>+62 858 6028 2313</span>
                                </li>
                                <li className="flex items-start gap-2.25 text-white text-[15px]">
                                    <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                        <img
                                            src={Mail}
                                            alt="mail_icon"
                                            className="w-3.5 h-3.5 object-contain"
                                        />
                                    </span>
                                    <span>hello@khaslana.id</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="h-px w-full bg-muted-foreground mb-3" />
                <div className="flex flex-col md:flex-row items-center justify-between py-5 text-center md:text-left">
                    <p className="text-white text-[14px]">
                        &copy;2026 Khaslana. All rights reserved.
                    </p>
                    <div className="flex gap-7">
                        <a
                            className="text-white decoration-0 text-[14px] transition-colors duration-200 ease-in hover:text-[#989898]"
                            href="#"
                        >
                            Tentang Kami
                        </a>
                        <a
                            className="text-white decoration-0 text-[14px] transition-colors duration-200 ease-in hover:text-[#989898]"
                            href="#"
                        >
                            Kebijakan Privasi
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}