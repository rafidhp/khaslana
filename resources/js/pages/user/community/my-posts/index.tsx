import { usePage, Link, router, Head } from "@inertiajs/react";
import { Plus, Trash } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import UnusedNavLayout from "@/layouts/unused-nav-layout";

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

interface MyPostsProps {
    posts: Post[];
}

export default function MyPosts() {
    const { user } = useAuth();

    const { posts } = usePage().props as unknown as MyPostsProps;

    const handleDeletePost = (postId: number) => {
        if (confirm('Yakin ingin menghapus postingan ini?')) {
            router.delete(`/community/${postId}`);
        }
    };

    return (
        <UnusedNavLayout backHref="/community">
            <Head title='Postingan Anda'>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <section className="community-header flex justify-between w-full pb-10 max-md:pb-5 gap-2">
                <h2 className="text-[#99ff33] font-medium text-2xl md:text-5xl">Kelola Postingan</h2>
                <Link href="/community/create-post"
                    className="bg-[#99FF33] flex gap-2 items-center border border-[#99FF33] py-2.5 px-5 font-medium cursor-pointer rounded-[20px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200">
                    <Plus />
                    Buat Postingan
                </Link>
            </section>
            {posts && posts.length > 0 ? (
                posts.map((post) => {
                    const isMyPost = user && post.user_id === user.id;

                return (
                    <Link href={`/community/${post.id}`} key={post.id} className="post-card w-full flex flex-col gap-4 bg-[#222] p-8 rounded-[15px]">
                        <div className="flex flex-col gap-4">
                            <div className="post-profile flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
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
                                        className="w-full max-w-50 h-auto rounded-xl" 
                                    />
                                ))}
                            </div>
                        </div>
                    </Link>
                )})
            ) : (
                <p className="text-center text-[#888] py-10 text-sm">Belum ada data postingan di komunitas :(</p>
            )}
        </UnusedNavLayout>
    )
}