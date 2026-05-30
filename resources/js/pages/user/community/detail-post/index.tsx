import { usePage, router } from '@inertiajs/react';
import { ThumbsUp, MessageCircleMore, Trash, SendHorizontal } from "lucide-react";
import { useState } from 'react';
import ProfileIcon from "@/assets/icons/default-profile.png";
import UnusedNavLayout from '@/layouts/unused-nav-layout';


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

interface CommentLike {
    id: number;
    comment_id: number;
    user_id: number;
}

interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
    }
    post_id: number;
    comment: string;
    comment_likes: CommentLike[];
    is_liked: boolean;
    created_at: string;
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

interface DetailProps {
    post: Post;
}

export default function DetailPost() {
    const { auth } = usePage().props as unknown as SharedProps;
    const currentUser = auth.user;

    const { post } = usePage().props as unknown as DetailProps;

    const isMyPost = currentUser && post.user_id === currentUser.id;

    const [commentText, setCommentText] = useState('');

    const [isUploaded, setIsUploaded] = useState(false);

    const handleLike = (postId: number) => {
        router.post(`/community/${postId}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Toggle like sukses!");
            },
            onError: (err) => {
                console.error("Gagal melakukan like: ", err);
            }
        })
    }

    const handleDeletePost = (postId: number) => {
        if (confirm('Yakin ingin menghapus postingan ini?')) {
            router.delete(`/community/${postId}`);
        }
    };

    const handleSubmitComment = () => {
        if (!commentText.trim()) {
            alert("Komentar tidak boleh kosong!")
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

    return (
        <UnusedNavLayout backHref='/community'>
            <div className='flex flex-col gap-10 justify-between mb-20 lg:mx-20 md:mx-14'>
                <div key={post.id} className="post-card w-full flex flex-3 flex-col gap-4 bg-[#222] p-6 rounded-[15px]">
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
                                    className="post-options h-full justify-start flex hover:text-[#99ff33] cursor-pointer">
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
                                    className="w-full max-w-sm h-auto rounded-xl" 
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

                <div className='flex flex-col flex-2 gap-7'>
                    <h2 className='text-2xl sm:text-3xl text-[#99ff33]'>{post.comments?.length} <span className='text-white'>Komentar</span></h2>

                    <div className="relative flex flex-col items-center w-full">        
                        {isUploaded &&  (
                            <div className="w-full bg-[#99FF33]/20 border border-[#99FF33] text-[#99FF33] p-4 rounded-[15px] text-sm font-medium">Komentar berhasil diupload!</div>
                        )}
            
                        <div className="create-comment flex justify-between w-full p-3 gap-10 rounded-[15px]">
                            <div className="post-top flex items-center gap-5 w-full">
                                <img src={ProfileIcon} alt="Profile" className="w-10 max-md:w-7" />
                                <input type="text" placeholder="Bagikan komentar Anda..." className="main-input flex flex-1 bg-transparent border-b border-white/30 w-full outline-0 text-white focus:border-[#99ff33] transition-all duration-200"
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)}/>
                            </div>
                            <button onClick={() => handleSubmitComment()}
                                className='hover:text-[#99ff33] transition-all duration-200 cursor-pointer'>
                                <SendHorizontal />
                            </button>
                        </div>
                    </div>

                    {post.comments && post.comments.length > 0 ? (
                        post.comments
                        .slice()
                        .sort((a, b) => {
                            const isMeA = currentUser && a.user.id === currentUser.id ? 1 : 0;
                            const isMeB = currentUser && b.user.id === currentUser.id ? 1 : 0;

                            const sortByMe = isMeB - isMeA;

                            if (sortByMe !== 0) return sortByMe;

                            const likesA = a.comment_likes?.length || 0;
                            const likesB = b.comment_likes?.length || 0;

                            return likesB - likesA;
                        })
                        .map((comment) => (
                            <div key={comment.id} className='flex flex-col gap-5 mx-3'>
                                <div className="flex items-center gap-5 w-full justify-between">
                                    <div className='flex gap-5 items-center'>
                                        <div className="post-avatar">
                                            <img src={ProfileIcon} alt="Profile" className="avatar w-10 h-10 max-md:w-8 max-md:h-8 rounded-full object-cover" />
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
                                    <button onClick={() => handleDeleteComment(comment.id, post.id)} className='hover:text-[#99ff33] duration-200 transition-all cursor-pointer'>
                                        <Trash className="w-4"/>
                                    </button>
                                </div>
                                {comment.comment}
                                <button type="button" onClick={() => handleLikeComment(post.id, comment.id)} className={`post-opt-btn flex items-center gap-2 text-sm cursor-pointer transition-all duration-100 ${comment.is_liked ? 'text-[#99ff33]' : ''}`}>
                                    <ThumbsUp className={`w-4 h-4`} /> 
                                    {comment.comment_likes.length}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className='w-full text-center text-white/40'>Belum ada komentar</p>
                    )}
                </div>
            </div>
        </UnusedNavLayout>
    );
}
