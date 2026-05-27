import { router, usePage } from "@inertiajs/react";
import { Image, X, ThumbsUp, MessageCircleMore, Trash } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import ProfileIcon from "@/assets/icons/default-profile.png";

interface SharedProps {
    auth:  {
        user: {
            id: number;
            name: string;
        } | null;
    };
}

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface PostImage {
    id: number;
    post_id: number;
    image: string;
}

interface PostLike {
    id: number;
    user_id: number;
    post_id: number;
}

interface Comment {
    id: number;
    post_id: number;
}

interface Post {
    id: number;
    user_id: number;
    umkm_id?: number | null;
    content: string;
    post_date: string;
    created_at: string;

    user: User;
    post_images: PostImage[];
    post_likes: PostLike[];
    comments?: Comment[];
    is_liked: boolean;
}

interface IndexProps {
    posts: Post[];
}

export default function CommunityIndex() {
    const { auth } = usePage().props as unknown as SharedProps;
    const currentUser = auth.user;

    const { posts } = usePage().props as unknown as IndexProps;

    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isUploaded, setIsUploaded] = useState(false);

    const PostOptions = [
        { id: 1, label: "Gambar", src: <Image />, accept: "image/*"},
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

    const handleLike = (postId: number) => {
        router.post(`/community/${postId}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Toggle like sukses!");
            },
            onError: (err) => {
                console.error("Gagal melakukan like: ", err)
            }
        })
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
                }, 3000);
            }
        });
    }

    return (
        <div className="flex flex-col items-center pt-20 md:pt-28 px-6 md:px-12 lg:px-[70px] w-full min-h-screen">
            {isUploaded &&  (
                <div className="w-full bg-[#99FF33]/20 border border-[#99FF33] text-[#99FF33] p-4 rounded-[15px] text-sm font-medium">Postingan berhasil diupload!</div>
            )}

            <section className="community-header flex flex-col w-full pt-8 pb-[40px] max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Terhubung, Berkolaborasi, dan Berdaya Bersama.</h2>
                <p className="text-[#adaaaa] font-light text-md max-md:text-md">Bagikan perjalanan bisnismu, temukan solusi bersama, dan tumbuh lebih kuat dalam ekosistem komunitas Khaslana</p>
            </section>
            
            <div className="community-container flex flex-col gap-5 w-full py-5 mb-10 box-border">
                <div className="posts w-full flex flex-col gap-5">
                    
                    <div className="create-post flex flex-col w-full bg-[#222] p-8 gap-10 rounded-[15px]">
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

                    {posts && posts.length > 0 ? (
                        posts.map((post) => {
                            const isMyPost = currentUser && post.user_id === currentUser.id;

                        return (
                            <div key={post.id} className="post-card w-full flex flex-col gap-4 bg-[#222] p-8 rounded-[15px]">
                                <div className="flex flex-col gap-4">
                                    <div className="post-profile flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="post-avatar">
                                                <img src={ProfileIcon} alt="Profile" className="avatar w-10 h-10 rounded-full object-cover" />
                                            </div>
                                            <div className="post-user flex flex-col">
                                                <h6 className="text-white font-medium text-lg">{post.user?.name || "Anggota Khaslana"}</h6>
                                                <p className="text-[#888] text-sm">
                                                    {post.post_date ? new Date(post.post_date).toLocaleDateString('id-ID', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    }) : "Baru saja"}
                                                </p>
                                            </div>
                                        </div>
                                        {isMyPost && (
                                            <div className="post-options hover:text-[#99ff33] cursor-pointer">
                                                <Trash className="w-4"/>
                                            </div>
                                        )}
                                    </div>

                                    <div className="post-content flex flex-col gap-5 text-[#adaaaa] font-normal">
                                        <p className="text-md whitespace-pre-line">{post.content}</p>
                                        
                                        {post.post_images && post.post_images.map((imgData) => (
                                            <img 
                                                key={imgData.id}
                                                src={`/storage/${imgData.image}`} 
                                                alt="Post Content" 
                                                className="w-full max-w-md h-auto rounded-xl" 
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="post-btn mt-2.75">
                                    <div className="post-options flex gap-4 items-center bg-transparent text-[#adaaaa] cursor-pointer">
                                        <button type="button" onClick={() => handleLike(post.id)} className={`post-opt-btn flex items-center gap-2 text-sm cursor-pointer transition-all duration-100 ${post.is_liked ? 'text-[#99ff33]' : ''}`}>
                                            <ThumbsUp className={`w-4 h-4`} /> 
                                            {post.post_likes.length}
                                        </button>
                                        <button className="post-opt-btn flex items-center gap-2 text-sm">
                                            <MessageCircleMore className="w-4 h-4"/>
                                            {post.comments?.length}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})
                    ) : (
                        <p className="text-center text-[#888] py-10 text-sm">Belum ada data postingan di komunitas :(</p>
                    )}

                </div>
            </div>
        </div>
    );
}