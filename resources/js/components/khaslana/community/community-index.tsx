import ProfileIcon from "@/assets/icons/default-profile.png";

export default function CommunityIndex() {
    return (
        <div className="flex flex-col items-center pt-28 px-6 lg:px-[70px] w-full">
            <section className="community-header flex flex-col w-full pt-8 pb-[40px] max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-xl md:text-5xl">Terhubung, Berkolaborasi, dan Berdaya Bersama.</h2>
                <p className="text-[#adaaaa] font-light text-[16.5px] max-md:text-md">Bagikan perjalanan bisnismu, temukan solusi bersama, dan tumbuh lebih kuat dalam ekosistem komunitas Khaslana</p>
            </section>
            
            <div className="community-container flex flex-wrap justify-between gap-5 h-auto min-h-screen py-5 mb-10 border-box">
                <div className="posts w-full flex flex-col gap-5">
                    <div className="create-post flex flex-col bg-[#222] p-5 gap-10 rounded-[15px]">
                        <div className="post-top flex items-center gap-3.75">
                            <img src={ProfileIcon} alt="Profile" className="h-12 w-12" />
                            <input type="text" placeholder="Bagikan strategi pertumbuhan Anda hari ini..." className="main-input flex flex-1 bg-transparent border-0 outline-0 text-white" />
                        </div>

                        <div className="post-bottom flex justify-between items-center">
                            <div className="post-options flex gap-3.75">
                                <label className="opt-btn bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px]">
                                    <input type="file" className="hidden" accept="image/*" />
                                    <img src="./../../../assets/komunitas/gambar.svg" alt="" /> Gambar
                                </label>

                                <label className="opt-btn bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px]">
                                    <input type="file" className="hidden" accept="video/*" />
                                    <img src="./../../../assets/komunitas/video.svg" alt="" /> Video
                                </label>

                                <label className="opt-btn bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px]">
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                                    <img src="./../../../assets/komunitas/artikel.svg" alt="" /> Artikel
                                </label>
                            </div>
                            
                            <button type="submit" className="btn-publish bg-[#99FF33] border border-[#99FF33] py-2.5 px-6.25 font-medium cursor-pointer rounded-[20px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200">Terbitkan</button>
                        </div>
                    </div>

                    {[1, 2, 3].map((_, i) => (
                        <div className="post-card flex flex-col gap-2.5 bg-[#222] p-5 rounded-[15px]" key={i}>
                            <div className="post-profile flex items-center gap-2.5">
                                <div className="post-avatar">
                                    <img src="./../../../assets/komunitas/user-avatar.png" alt="Profile" className="avatar" />
                                </div>
                                <div className="post-user flex flex-col gap-0.5">
                                    <h6 className="text-white font-light text-[13px]">Dewi Lestari</h6>
                                    <p className="text-[#888] text-[9px]">3 JAM YANG LALU</p>
                                </div>
                            </div>

                            <div className="post-content flex flex-col gap-5 text-[#adaaaa] font-normal">
                                <p className="text-[14px]">Baru saja menerapkan sistem manajemen inventaris baru di gudang kami di Bandung. Efisiensi meningkat 30% dalam minggu pertama! Kuncinya adalah integrasi data real-time. Ada yang butuh rekomendasi software logistik lokal? 🚀</p>
                                <img src="./../../../assets/komunitas/post-img.png" alt="" className="post-imgw-full max-w-full h-auto rounded-4 object-cover" />
                            </div>

                            <div className="post-btn mt-2.75">
                                <div className="post-options flex gap-2.25 items-center bg-transparent text-[#adaaaa] cursor-pointer">
                                    <button className="post-opt-btn">
                                        <img src="./../../../assets/komunitas/like.svg" alt="" /> 124
                                    </button>

                                    <button className="post-opt-btn">
                                        <img src="./../../../assets/komunitas/comment.svg" alt="" /> 42
                                    </button>

                                    <button className="post-opt-btn">
                                        <img src="./../../../assets/komunitas/share.svg" alt="" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}