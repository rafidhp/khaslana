import { Image, Video, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import ProfileIcon from "@/assets/icons/default-profile.png";

export default function CommunityIndex() {
    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

    const PostOptions = [
        { id: 1, label: "Gambar", src: <Image />, accept: "image/*"},
        { id: 2, label: "Video", src: <Video />, accept: "video/*"},
    ]

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            setMediaFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            if (file.type.startsWith("image/")) {
                setMediaType("image");
            } else if (file.type.startsWith("video/")) {
                setMediaType("video");
            }
        }
    }

    const handleRemoveFile = () => {
        setMediaFile(null);
        setMediaType(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    }

    const handlePublish = () => {
        if (!content.trim() && !mediaFile) {
            alert("Postingan tidak boleh kosong")
            return;
        }

        console.log("Data teks yang dikirim:", content);
        console.log("Data file yang dikirim:", mediaFile);
    }

    return (
        <div className="flex flex-col items-center pt-20 md:pt-28 px-6 lg:px-[70px] w-full">
            
            <section className="community-header flex flex-col w-full pt-8 pb-[40px] max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Terhubung, Berkolaborasi, dan Berdaya Bersama.</h2>
                <p className="text-[#adaaaa] font-light text-[16.5px] max-md:text-md">Bagikan perjalanan bisnismu, temukan solusi bersama, dan tumbuh lebih kuat dalam ekosistem komunitas Khaslana</p>
            </section>
            
            <div className="community-container flex flex-wrap justify-between gap-5 h-auto min-h-screen w-full py-5 mb-10 border-box">
                <div className="posts w-full flex flex-col gap-5">
                    <div className="create-post flex flex-col w-full bg-[#222] p-8 gap-10 rounded-[15px]">
                        <div className="post-top flex items-center gap-3.75">
                            <img src={ProfileIcon} alt="Profile" className="w-12 max-md:w-8" />
                            <input type="text" placeholder="Bagikan strategi pertumbuhan Anda hari ini..." className="main-input flex flex-1 bg-transparent border-0 outline-0 text-white" />
                        </div>

                        {previewUrl && (
                            <div className="flex relative w-full">
                                {mediaType === "image" ? (
                                    <img src={previewUrl} alt="Pratinjau Gambar" 
                                        className="relative w-100 rounded-2xl"/>
                                ) : (
                                    <video src={previewUrl} controls 
                                        className="relative w-100 rounded-2xl"/>
                                )}

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="cursor-pointer absolute top-4 left-4">
                                        <div className="bg-red-700 rounded-4xl p-0.5">
                                            <X className="w-4 h-4" />
                                        </div>
                                </button>
                            </div>
                        )}

                        <div className="post-bottom flex justify-between items-center">
                            <div className="post-options flex gap-3.75">
                                {PostOptions.map((item) => (
                                    <label key={item.id} className="opt-btn bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px] md:text-[15px]">
                                        <input type="file" className="hidden" accept={item.accept} 
                                        onChange={handleFileChange}
                                        onClick={(e) => setContent(e.currentTarget.value)}/>
                                        {item.src} {item.label}
                                    </label>
                                ))}
                            </div>
                            
                            <button type="submit" 
                            onClick={handlePublish} className="btn-publish bg-[#99FF33] border border-[#99FF33] py-2.5 px-6.25 font-medium cursor-pointer rounded-[20px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200">Terbitkan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}