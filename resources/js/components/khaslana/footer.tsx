import Khaslana from '@/assets/images/landing-page/Khaslana.svg';
import Mail from '@/assets/images/landing-page/Vector.svg';

export default function Footer() {
    return (
            <footer className="bg-[#262626] border-t pt-15 max-md:flex-col md:gap-7.5">
                <div className="px-13.75">
                    <div className="grid grid-cols-1 gap-20 pb-11.25 items-start">
                        <div className="flex flex-col gap-4 -mt-9">
                            <div className="flex items-center gap-2.5">
                                <img src={Khaslana} alt="Khaslana logo" className="w-16 h-17.5" />
                                <span className="font-semibold text-white text-3xl">Khaslana</span>
                            </div>
                            <p className="text-white text-[15px] max-w-93.75">
                                Khaslana adalah platform digital kolaboratif yang didedikasikan sebagai wadah pemberdayaan bagi UMKM lokal Indonesia.
                                Platform ini hadir untuk menjembatani produk-produk kreatif hasil karya anak bangsa—mulai dari kuliner, kerajinan tangan, 
                                hingga fashion—dengan pasar yang lebih luas melalui ekosistem yang modern dan inklusif. 
                            </p>
                            <div className="flex gap-2.5 mt-1">
                                <a href="#" className="flex items-center justify-center w-9 h-9 rounded-[50%] decoration-0" aria-label="Instagram">
                                    <img src="./assets/instagram.png" alt="Instagram" className="w-4 h-4 object-contain"/>
                                </a>
                                <a href="#" className="flex items-center justify-center w-9 h-9 rounded-[50%] decoration-0" aria-label="Youtube">
                                    <img src="./assets/yt.png" alt="Youtube" className="w-4 h-4 object-contain"/>
                                </a>
                                <a href="#" className="flex items-center justify-center w-9 h-9 rounded-[50%] decoration-0" aria-label="linkedIn">
                                    <img src="./assets/linkedin.png" alt="linkedIn" className="w-4 h-4 object-contain"/>
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-7.5">
                            <div className="flex flex-col gap-4">
                                <h5 className="text-white text-[18px] font-semibold m-0">Layanan</h5>
                                <ul className="flex flex-col gap-3">
                                    <li><a className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]" href="./src/pages/katalog/index.html">Katalog</a></li>
                                    <li><a className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]" href="./src/pages/umkm/index.html">List UMKM</a></li>
                                    <li><a className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]" href="./src/pages/komunitas/index.html">Komunitas</a></li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h5 className="text-white text-[18px] font-semibold m-0">Sumber Daya</h5>
                                <ul className="flex flex-col gap-3">
                                    <li><a className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]" href="#">Kebijakan Privasi</a></li>
                                    <li><a className="text-white decoration-0 text-[15px] transition-colors duration-200 ease-in hover:text-[#99FF33]" href="#">Syarat dan Ketentuan</a></li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h5 className="text-white text-[18px] font-semibold m-0">Kontak</h5>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-start gap-2.25 text-white text-[15px]">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                            <img className="w-3.5 h-3.5 object-contain" src="./assets/location_icon.png" alt="location_icon" />
                                        </span>
                                        <span>Cibiru, Jawa Barat, Indonesia</span>
                                    </li>
                                    <li className="flex items-start gap-2.25 text-white text-[15px]">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                            <img className="w-3.5 h-3.5 object-contain" src="./assets/phone_icon.png" alt="phone_icon" />
                                        </span>
                                        <span>+62 858 6028 2313</span>
                                    </li>
                                    <li className="flex items-start gap-2.25 text-white text-[15px]">
                                        <span className="flex items-center justify-center w-4 h-4 shrink-0 mt-px">
                                            <img className="w-3.5 h-3.5 object-contain" src={Mail} alt="mail_icon" />
                                        </span>
                                        <span>hello@khaslana.id</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="h-px w-full"></div>
                    <div className="flex items-center justify-between py-5">
                        <p className="text-white text-[12px]">&copy;2026 Khaslana. All rights reserved.</p>
                        <div className="flex gap-7">
                            <a className="text-white decoration-0 text-[12px] transition-colors duration-200 ease-in hover:text-[#989898]" href="#">Tentang Kami</a>
                            <a className="text-white decoration-0 text-[12px] transition-colors duration-200 ease-in hover:text-[#989898]" href="#">Kebijakan Privasi</a>
                        </div>
                    </div>
                </div>
            </footer>
    )
}