import { router, Link } from "@inertiajs/react";
import {
    ThumbsUp,
    MessageCircleMore,
    MessageCircleX,
    Trash,
    Plus,
} from "lucide-react";
import { useState } from "react";

import ProfileIcon from "@/assets/icons/default-profile.png";
import DeleteConfirmationDialog from "@/components/khaslana/delete-confirmation-dialog";
import { useAuth } from "@/hooks/use-auth";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { create } from "@/routes/community";
import { like, destroy, show } from "@/routes/community";
import type { Post } from "@/types/post";

interface CommunityIndexProps {
    posts: Post[];
}

export default function CommunityIndex({
    posts,
}: CommunityIndexProps) {
    const { user } = useAuth();
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleLike = (postId: number, is_liked: boolean) => {
        router.post(like(postId).url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if(!is_liked) {
                    showSuccessToast("Berhasil menyukai postingan");
                }
            },
            onError: (err) => {
                console.error("Gagal melakukan like: ", err);
                showErrorToast("Gagal menyukai postingan");
            }
        })
    }

    const handleDeletePost = () => {
        if (!selectedPostId) return;

        router.delete(destroy(selectedPostId).url, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccessToast("Postingan berhasil dihapus");
                setIsDeleteDialogOpen(false);
                setSelectedPostId(null);
            },
            onError: () => {
                showErrorToast("Gagal menghapus postingan");
            },
        });
    };

    const openDeleteDialog = (postId: number) => {
        setSelectedPostId(postId);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="relative flex flex-col items-center pt-20 md:pt-28 px-6 md:px-12 lg:px-17.5 w-full min-h-screen">
            <div className="flex flex-col md:flex-row justify-between w-full pt-8 pb-10 max-md:pb-5 gap-3">
                <section className="community-header flex flex-col w-full gap-2">
                    <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">
                        Terhubung, Berkolaborasi, dan Berdaya Bersama.
                    </h2>
                    <p className="text-[#adaaaa] font-light text-md max-md:text-md">
                        Bagikan perjalanan bisnismu, temukan solusi bersama, dan tumbuh lebih kuat dalam ekosistem komunitas Khaslana
                    </p>
                </section>
                <div className="flex items-start">
                    <Link
                        href={create()}
                        className="
                            flex items-center
                            border border-[#99FF33] rounded-xl
                            bg-[#99FF33] hover:bg-transparent
                            py-2.5 px-5 gap-2 h-fit
                            font-medium text-black hover:text-[#99ff33]
                            text-sm md:text-base
                            cursor-pointer whitespace-nowrap
                            transition-all duration-200
                        "
                    >
                        <Plus className="h-5 w-5 md:h-6 md:w-6" />
                        Buat Postingan
                    </Link>
                </div>
            </div>
            
            <div className="community-container flex flex-col gap-5 w-full py-5 mb-10 box-border">
                <div className="posts w-full flex flex-col gap-5">

                    {posts && posts.length > 0 ? (
                        posts.map((post) => {
                            const isMyPost = user && post.user_id === user.id;

                            return (
                                <Link
                                    href={show(post.id)}
                                    key={post.id}
                                    className="w-full flex flex-col gap-4 bg-[#222] p-6 rounded-[15px]"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center ps-2 gap-4">
                                                <img
                                                    src={
                                                        post.user.profile?.profile_photo ?
                                                        `storage/${post.user.profile?.profile_photo}` :
                                                        ProfileIcon
                                                    }
                                                    alt="Profile"
                                                    className="w-11 h-11 border border-white/10 rounded-full object-cover"
                                                />
                                                <div className="post-user flex flex-col">
                                                    <h6 className="text-white font-medium text-base md:text-lg">
                                                        {post.user.name}
                                                    </h6>
                                                    <p className="text-[#888] text-xs md:text-sm">
                                                        {post.post_date ? new Date(post.post_date).toLocaleDateString('id-ID', {
                                                            year: 'numeric', month: 'long', day: 'numeric'
                                                        }) : "Baru saja"}
                                                    </p>
                                                </div>
                                            </div>
                                            {isMyPost && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        openDeleteDialog(post.id)
                                                    }}
                                                    className="
                                                        flex items-center justify-center
                                                        rounded-full aspect-square
                                                        h-9 w-9 p-2
                                                        hover:bg-white/20 hover:text-red-400
                                                        transition-all duraion-300
                                                        cursor-pointer
                                                    "
                                                >
                                                    <Trash className="w-4 aspect-square"/>
                                                </button>
                                            )}
                                        </div>

                                        <div className="post-content flex flex-col ps-3 gap-5 text-[#adaaaa] font-normal">
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

                                    <div className="mt-2.75">
                                        <div className="flex gap-1 items-center bg-transparent text-[#adaaaa]">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleLike(post.id, post.is_liked)
                                                }}
                                                className={`
                                                    group
                                                    flex items-center gap-2
                                                    px-3 py-2
                                                    rounded-xl
                                                    text-sm font-medium
                                                    cursor-pointer
                                                    transition-all duration-300
                                                    hover:bg-[#99FF33]/10
                                                    active:scale-95
                                                    ${post.is_liked ?
                                                        'text-[#99FF33] bg-[#99FF33]/10 shadow-[0_0_15px_rgba(153,255,51,0.15)]'
                                                    : 'text-[#adaaaa]'}
                                                `}
                                            >
                                                <ThumbsUp
                                                    className={`
                                                        w-4 h-4
                                                        transition-all duration-300
                                                        group-hover:-translate-y-0.5
                                                        group-hover:scale-125
                                                        ${ post.is_liked ?
                                                            "fill-[#99FF33] scale-110"
                                                        : ""}
                                                    `}
                                                />
                                                <span className="transition-all duration-300 group-hover:translate-x-0.5">
                                                    {post.post_likes.length}
                                                </span>
                                            </button>
                                            <button
                                                className="
                                                        group
                                                        flex items-center gap-2
                                                        px-3 py-2
                                                        rounded-xl
                                                        text-sm font-medium
                                                        text-[#adaaaa]
                                                        hover:bg-white/5
                                                        hover:text-white
                                                        active:scale-95
                                                        transition-all duration-300
                                                        cursor-pointer
                                                "
                                            >
                                                <MessageCircleMore className="w-4 h-4"/>
                                                {post.comments?.length}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full py-12">
                            <MessageCircleX className='h-32 w-32 text-center text-[#99FF33] mb-8' />
                            <p className="text-center text-white/80 text-sm md:text-base">
                                Belum ada postingan di Komunitas, Ayo buat postingan pertama Anda!.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* delete dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                title="Hapus Postingan"
                description="Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan."
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPostId(null);
                }}
                onConfirm={handleDeletePost}
            />
        </div>
    );
}