import { router, usePage, Link } from "@inertiajs/react";
import { ThumbsUp, MessageCircleMore, Trash, Plus } from "lucide-react";
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

    const handleDeletePost = (postId: number) => {
        if (confirm('Yakin ingin menghapus postingan ini?')) {
            router.delete(`/community/${postId}`);
        }
    }

    return (
        <div className="relative flex flex-col items-center pt-20 md:pt-28 px-6 md:px-12 lg:px-17.5 w-full min-h-screen">

            <Link href="/community/create-post" className="create-post fixed border-2 border-[#99ff33] bg-[#97ff2e] hover:bg-transparent text-black hover:text-[#99ff33] p-2 rounded-[999px] bottom-15 right-15 transition-all duration-200">
                <Plus className="size-15"/>
            </Link>

            <section className="community-header flex flex-col w-full pt-8 pb-10 max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Terhubung, Berkolaborasi, dan Berdaya Bersama.</h2>
                <p className="text-[#adaaaa] font-light text-md max-md:text-md">Bagikan perjalanan bisnismu, temukan solusi bersama, dan tumbuh lebih kuat dalam ekosistem komunitas Khaslana</p>
            </section>
            
            <div className="community-container flex flex-col gap-5 w-full py-5 mb-10 box-border">
                <div className="posts w-full flex flex-col gap-5">
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
                                            <button onClick={() => handleDeletePost(post.id)}
                                                className="post-options hover:text-[#99ff33] cursor-pointer">
                                                <Trash className="w-4"/>
                                            </button>
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