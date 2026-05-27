import { router } from "@inertiajs/react";
import { Image, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import ProfileIcon from "@/assets/icons/default-profile.png";

export function CreatePost() {
    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isUploaded, setIsUploaded] = useState(false);

    const PostOptions = [
        { id: 1, label: "Gambar", src: <Image className="w-5"/>, accept: "image/*"},
    ]

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            setMediaFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    const handleRemoveFile = () => {
        setMediaFile(null);
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
    
            router.post("/community", {
                content: content,
                images: mediaFile ? [mediaFile] : [],
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setContent("");
                    setMediaFile(null);
                    if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                    }
    
                    setIsUploaded(true);
    
                    setTimeout(() => {
                        setIsUploaded(false);
                        router.visit("/community", {
                            preserveScroll: false
                        })
                    }, 3000);
                }
            });
        }

    return (
        <div className="relative flex flex-col items-center pt-20 md:pt-28 px-6 md:px-12 lg:px-17.5 w-full min-h-screen">
            <section className="community-header flex flex-col w-full pt-8 pb-10 max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Buat Postingan</h2>
            </section>

            {isUploaded &&  (
                <div className="w-full bg-[#99FF33]/20 border border-[#99FF33] text-[#99FF33] p-4 rounded-[15px] text-sm font-medium">Postingan berhasil diupload!</div>
            )}

            <div className="create-post flex flex-col w-full bg-[#222] md:p-8 p-5 gap-10 rounded-[15px] mb-20">
                <div className="post-top flex items-center gap-3.75">
                    <img src={ProfileIcon} alt="Profile" className="w-12 max-md:w-8" />
                    <input type="text" placeholder="Bagikan strategi pertumbuhan Anda hari ini..." className="main-input flex flex-1 bg-transparent border-0 outline-0 text-white"
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}/>
                </div>

                {previewUrl && (
                    <div className="flex relative w-full">
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="cursor-pointer absolute top-4 left-4 z-10">
                                <div className="bg-red-700 rounded-4xl p-0.5">
                                    <X className="w-4 h-4 text-white" />
                                </div>
                        </button>
                        <img src={previewUrl} alt="Pratinjau Gambar" className="w-100 rounded-2xl object-cover"/>
                    </div>
                )}

                <div className="post-bottom flex justify-between items-center">
                    <div className="post-options flex gap-3.75">
                        {PostOptions.map((item) => (
                            <label key={item.id} className="opt-btn bg-transparent border-0 text-[#888] cursor-pointer flex items-center gap-1.75 text-[12px] md:text-[15px]">
                                <input type="file" className="hidden" accept={item.accept} onChange={handleFileChange}/>
                                {item.src} {item.label}
                            </label>
                        ))}
                    </div>
                    <button type="button" onClick={handlePublish} className="btn-publish bg-[#99FF33] border border-[#99FF33] py-2.5 px-6.25 font-medium cursor-pointer rounded-[20px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200">Terbitkan</button>
                </div>
            </div>
        </div>
    )
}