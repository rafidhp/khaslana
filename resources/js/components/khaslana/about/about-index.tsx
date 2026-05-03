import Misi from '@/assets/images/about/misi.svg';
import VisiMisi from '@/assets/images/about/visi-misi.png';
import What from '@/assets/images/about/what-img.png';

export default function AboutIndex() {
    return (
        <div className='flex flex-col px-16 max-md:px-9 2xl:px-21'>
            <div className="what-section min-h-screen h-auto flex justify-between items-center pt-22.5 max-md:pt-14 text-white gap-17.5 max-md:gap-12 flex-col md:flex-row">
                <div className="what-right hidden flex-1 w-full items-end max-md:flex">
                    <img src={What} alt="" className="h-auto max-w-full 2xl:w-200 object-contain" />
                </div>
                
                <div className="what-left flex flex-1 flex-col gap-7.5">
                    <h1 className="text-[36px] md:text-[64px] 2xl:text-[100px] font-light leading-none">
                        Apa itu{' '}
                        <i className="text-[#99FF33] text-[60px] md:text-[100px] 2xl:text-[150px]">
                            Khaslana?
                        </i>
                    </h1>
                    <p className="text-[#ADAAAA] 2xl:text-2xl">
                        Khaslana adalah platform digital kolaboratif yang didedikasikan sebagai wadah pemberdayaan bagi UMKM lokal Indonesia. Platform ini hadir untuk menjembatani produk-produk kreatif hasil karya anak bangsa—mulai dari kuliner, kerajinan tangan, hingga fashion—dengan pasar yang lebih luas melalui ekosistem yang modern dan inklusif.
                    </p>
                </div>

                <div className="what-right flex flex-1 w-full justify-end max-md:hidden">
                    <img src={What} alt="" className="h-auto max-w-full 2xl:w-200" />
                </div>
            </div>

            <div className="visi-misi-section min-h-screen h-auto flex justify-between items-center pb-5 text-white gap-17.5 max-md:gap-2 flex-col lg:flex-row max-md:mb-15">
                <div className="visi-left flex justify-start">
                    <img src={VisiMisi} alt="" className="h-auto flex justify-start w-200" />
                </div>

                <div className="visi-right flex flex-col gap-5 lg:mr-10">
                    {/* Visi */}
                    <div className="visi-section flex flex-col gap-5">
                        <span className="text-[#99FF33] font-semibold text-[12px] tracking-[5px]">
                            VISI KAMI
                        </span>
                        <h2 className="text-white font-medium text-xl">
                            Menjadi platform ekosistem UMKM terpercaya yang menghubungkan produk lokal Indonesia ke pasar yang lebih luas.
                        </h2>
                        <p className="text-[#ADAAAA]">
                            Kami percaya bahwa setiap warung, bengkel, dan pengrajin lokal berhak mendapatkan akses untuk menjangkau pasar tanpa kehilangan identitas mereka.
                        </p>
                    </div>

                    <div className="misi-section flex flex-col gap-5 bg-[#262626] p-5 px-6.25 rounded-[15px]">
                        <span className="text-[#99FF33] font-semibold text-[12px] tracking-[5px]">
                            MISI KAMI
                        </span>

                        <div className="misi flex gap-2 items-start">
                            <img src={Misi} alt="" className="shrink-0" />
                            <p className="misi-text text-white text-sm">
                                Memperluas akses UMKM ke pembeli, mitra, dan sumber daya yang sebelumnya sulit dijangkau.
                            </p>
                        </div>

                        <div className="misi flex gap-2 items-start">
                            <img src={Misi} alt="" className="shrink-0" />
                            <p className="misi-text text-white text-sm">
                                Menyediakan platform yang memudahkan UMKM mengelola usaha, mulai dari pencatatan hingga pemasaran digital.
                            </p>
                        </div>

                        <div className="misi flex gap-2 items-start">
                            <img src={Misi} alt="" className="shrink-0" />
                            <p className="misi-text text-white text-sm">
                                Mendampingi UMKM dalam adopsi teknologi secara bertahap sesuai kebutuhan dan kapasitas mereka.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}