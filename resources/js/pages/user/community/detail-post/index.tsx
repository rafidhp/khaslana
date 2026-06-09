import { router, Head } from '@inertiajs/react';
import { ThumbsUp, MessageCircleMore, Trash } from "lucide-react";
import { useState } from 'react';

import ProfileIcon from "@/assets/icons/default-profile.png";
import DeleteConfirmationDialog from "@/components/khaslana/delete-confirmation-dialog";
import { useAuth } from '@/hooks/use-auth';
import UnusedNavLayout from '@/layouts/unused-nav-layout';
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { community } from '@/routes';
import { like, destroy, show } from "@/routes/community";
import type { BreadcrumbItem } from '@/types';
import type { Post } from '@/types/post';

interface DetailProps {
    post: Post;
}

export default function DetailPost({
    post,
}: DetailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Komunitas',
            href: community().url,
        },
        {
            title: 'Detail Postingan',
            href: show(post.id).url,
        },
    ];

    const { user } = useAuth();
    const isMyPost = user && post.user_id === user.id;
    const isMyComment = (commentUserId: number) => {
        return user && commentUserId === user.id;
    }
    const [commentText, setCommentText] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
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
        router.delete(destroy(post.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccessToast("Postingan berhasil dihapus");
                setIsDeleteDialogOpen(false);
            },
            onError: () => {
                showErrorToast("Gagal menghapus postingan");
            },
        });
    };

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const handleSubmitComment = () => {
        if (!commentText.trim()) {
            showErrorToast('Komentar tidak boleh kosong!')
            return;
        }

        router.post(`/community/${post.id}/comment`, {
            comment: commentText,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setCommentText("");
                setIsUploaded(true);

                setTimeout(() => {
                    setIsUploaded(false);
                    router.visit(`/community/${post.id}`, {
                        preserveScroll: false
                    })
                }, 3000)
            }
        })
    };

    const handleCancelComment = () => {
        setCommentText('');
    }

    const handleDeleteComment = (commentId: number, postId: number) => {
        if (confirm('Yakin ingin menghapus komentar ini?')) {
            router.delete(`/community/${postId}/comment/${commentId}`);
        }
    }

    const handleLikeComment = (postId: number, commentId: number) => {
        router.post(`/community/${postId}/comment/${commentId}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Toggle like comment sukses!");
            },
            onError: (err) => {
                console.error("Gagal melakukan like comment: ", err);
            }
        })
    }

    if (isUploaded) {
        showSuccessToast('Selamat! Komentar Anda berhasil di upload!!!');
        setIsUploaded(false);
    }

    return (
        <UnusedNavLayout backHref={community().url} breadcrumbs={breadcrumbs}>
            <Head title='Detail Postingan'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className='flex flex-col gap-10 justify-between mb-20 lg:mx-20 md:mx-14'>

                {/* detail post section */}
                <div key={post.id} className="post-card w-full flex flex-3 flex-col gap-4 bg-[#222] p-6 rounded-[15px]">
                    <div className="flex flex-col gap-4">
                        <div className="post-profile flex items-center justify-between gap-4">
                            <div className="flex items-center ps-2 gap-4">
                                <img
                                    src={
                                        post.user.profile?.profile_photo
                                        ? `/storage/${post.user.profile?.profile_photo}`
                                        : ProfileIcon
                                    }
                                    alt="Profile"
                                    className="w-11 h-11 border border-white/10 rounded-full object-cover"
                                />
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
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        openDeleteDialog()
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
                        <div className="post-content flex flex-col gap-5 ps-3 text-[#adaaaa] font-normal">
                            <p className="text-sm md:text-base text-white whitespace-pre-line">
                                {post.content}
                            </p>
                            {post.post_images && post.post_images.map((imgData) => (
                                <img 
                                    key={imgData.id}
                                    src={`/storage/${imgData.image}`} 
                                    alt="Post Content" 
                                    className="w-full max-w-3xl rounded-xl" 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="post-btn mt-2.75">
                        <div className="post-options flex gap-1 items-center bg-transparent text-[#adaaaa]">
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
                </div>

                <div className='flex flex-col flex-2 gap-7'>
                    <h2 className={`text-2xl sm:text-3xl text-[#99ff33] ${post.has_comment && 'mb-12'}`}>
                        {post.comments?.length}
                        <span className='text-white'> Komentar</span>
                    </h2>

                    {/* create comment section */}
                    {!post.has_comment && (
                        <div className="relative flex flex-col items-center w-full">
                            <div className="create-comment flex flex-col justify-between w-full p-3 gap-4 rounded-[15px]">
                                <div className="flex items-center gap-5 w-full">
                                    <img
                                        src={user.profile_photo ?? ProfileIcon}
                                        alt="Profile"
                                        className="w-11 h-11 border border-white/10 rounded-full object-cover"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bagikan komentar Anda..."
                                        className="main-input flex flex-1 bg-transparent border-b border-white/30 w-full outline-0 text-white focus:border-[#99ff33] transition-all duration-200"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}/>
                                </div>
                                <div
                                    className={`
                                        post-bottom flex relative items-center justify-end gap-3 duration-200 transition-all
                                        ${commentText !== '' ?
                                            'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-3'}
                                    `}
                                >
                                    <button
                                        type='button'
                                        onClick={() => handleCancelComment()}
                                        className='btn-publish bg-muted py-2.5 px-8 font-medium cursor-pointer rounded-[999px] text-muted-foreborder-muted-foreground hover:bg-muted-foreground hover:text-black transition-all duration-200'
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type='submit'
                                        onClick={() => handleSubmitComment()}
                                        className='btn-publish bg-[#99FF33] border border-[#99FF33] py-2.5 px-8 font-medium cursor-pointer rounded-[999px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200'
                                    >
                                        Kirim
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* comment list section */}
                    <div className={`flex flex-col gap-10 transition-all duration-200 ${commentText == '' ? '-translate-y-10' : ''}`} >
                        {post.comments && post.comments.length > 0 ? (
                            post.comments
                            .slice()
                            .sort((a, b) => {
                                const isMeA = user && a.user.id === user.id ? 1 : 0;
                                const isMeB = user && b.user.id === user.id ? 1 : 0;

                                const sortByMe = isMeB - isMeA;

                                if (sortByMe !== 0) return sortByMe;

                                const likesA = a.comment_likes?.length || 0;
                                const likesB = b.comment_likes?.length || 0;

                                return likesB - likesA;
                            })
                            .map((comment) => (
                                <div key={comment.id} className='flex flex-col gap-4 mx-3'>
                                    <div className="flex items-start gap-5 ps-2 w-full justify-between">
                                        <div className='flex gap-5 items-center'>
                                            <div className="post-avatar">
                                                <img
                                                    src={
                                                        comment.user.profile?.profile_photo ?
                                                        `/storage/${comment.user.profile?.profile_photo}`
                                                        : ProfileIcon
                                                    }
                                                    alt="Profile"
                                                    className="w-11 h-11 border border-white/10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="post-user flex flex-col">
                                                <h6 className="text-white font-medium text-lg">{comment.user.name || "Anggota Khaslana"}</h6>
                                                <p className="text-[#888] text-sm">
                                                    {comment.created_at ? new Date(comment.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    }) : "Baru saja"}
                                                </p>
                                            </div>
                                        </div>
                                        {isMyComment(comment.user.id) && (
                                            <button
                                                onClick={() =>
                                                    handleDeleteComment(comment.id, post.id)
                                                }
                                                className='
                                                    flex items-center justify-center
                                                    rounded-full aspect-square
                                                    h-9 w-9 p-2
                                                    hover:bg-white/20 hover:text-red-400
                                                    transition-all duraion-300
                                                    cursor-pointer
                                                '
                                            >
                                                <Trash className="w-4 aspect-square"/>
                                            </button>
                                        )}
                                    </div>
                                    <span className='text-sm md:text-base ps-3 text-white'>
                                        {comment.comment}
                                    </span>
                                    <button
                                        type="submit"
                                        onClick={() => 
                                            handleLikeComment(post.id, comment.id)
                                        }
                                        className={`
                                            group
                                            flex items-center gap-2
                                            px-3 py-2 w-fit
                                            rounded-xl
                                            text-sm font-medium
                                            cursor-pointer
                                            transition-all duration-300
                                            hover:bg-[#99FF33]/10
                                            active:scale-95
                                            ${comment.is_liked ?
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
                                                ${comment.is_liked ?
                                                    "fill-[#99FF33] scale-110"
                                                : ""}
                                            `}
                                        />
                                        <span className="transition-all duration-300 group-hover:translate-x-0.5">
                                            {comment.comment_likes.length}
                                        </span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className='w-full text-center text-white/40'>Belum ada komentar</p>
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
                    }}
                    onConfirm={handleDeletePost}
                />
            </div>
        </UnusedNavLayout>
    );
}
