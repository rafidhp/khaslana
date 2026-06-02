import { usePage, router } from "@inertiajs/react";
import { ThumbsUp, Trash } from "lucide-react";
import { useState } from "react";
import ProfileIcon from "@/assets/icons/default-profile.png";
import { useAuth } from "@/hooks/use-auth";

interface ReviewLike {
    id: number;
    review_id: number;
    user_id: number;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    user: {
        id: number;
        name: string;
    };
    review_likes: ReviewLike[];
    is_liked: boolean;
    created_at: string;
}

interface ProductDetailProps {
    product: {
        id: number;
        name: string;
        reviews: Review[];
    }
}

export default function ReviewSection() {
    const { user } = useAuth();
    const { product } = usePage().props as unknown as ProductDetailProps;
    const reviews = product.reviews || [];

    const isMyReview = (reviewUserId: number) => {
        return user && reviewUserId === user.id
    }

    const [isUploaded, setIsUploaded] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState<number>(5);

    const handleSubmitReview = () => {
        if (!reviewText.trim()) {
            alert("Ulasan tidak boleh kosong!")
            return;
        }

        router.post(`/catalog/${product.id}/review`, {
            comment: reviewText,
            rating: rating,
        }, {
            forceFormData: true,
            onSuccess: () => {
                setReviewText("");
                setRating(5);
                setIsUploaded(true);

                setTimeout(() => {
                    setIsUploaded(false);
                }, 3000);
            }
        })
    };

    const handleCancelReview = () => {
        setReviewText('');
    }

    const handleDeleteReview = (reviewId: number, productId: number) => {
        if (confirm('Yakin ingin menghapus ulasan ini?')) {
            router.delete(`/catalog/${productId}/review/${reviewId}`, {
                preserveScroll: true
            });
        }
    } 

    const handleLikeReview = (reviewId: number, productId: number) => {
        router.post(`/catalog/${productId}/review/${reviewId}/like`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Toggle like ulasan sukses!");
            },
            onError: (err) => {
                console.error("Gagal melakukan like ulasan: ", err);
            }
        })
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h3 className="font-bold text-3xl">Ulasan Pembeli</h3>
                <p className="font-medium text-[#adaaaa]">Apa kata mereka tentang kualitas produk ini.</p>
            </div>

            <div>
                <div className="relative flex flex-col items-center w-full">        
                    {isUploaded &&  (
                        <div className="w-full bg-[#99FF33]/20 border border-[#99FF33] text-[#99FF33] p-4 rounded-[15px] text-sm font-medium mb-8">Ulasan berhasil diupload!</div>
                    )}
        
                    <div className="create-comment flex flex-col justify-between w-full p-3 gap-4 rounded-[15px]">
                        <div className="rating flex justify-center gap-1 w-full">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform active:scale-95 cursor-pointer text-6xl"
                                >
                                        {star <= rating ? (
                                            <span className="text-yellow-400">★</span>
                                        ) : (
                                            <span className="text-gray-600">★</span>
                                        )}
                                </button>
                            ))}
                        </div>

                        <div className="post-top flex items-center gap-5 w-full">
                            <img src={ProfileIcon} alt="Profile" className="w-10 max-md:w-7" />
                            <input type="text" placeholder="Bagikan ulasan Anda..." className="main-input flex flex-1 bg-transparent border-b border-white/30 w-full outline-0 text-white focus:border-[#99ff33] transition-all duration-200"
                            value={reviewText} 
                            onChange={(e) => setReviewText(e.target.value)}/>
                        </div>

                        <div className={`post-bottom flex relative items-center justify-end gap-3 duration-200 transition-all ${reviewText !== '' ? 'opacity-100 translate-y-0' : 
                                    'opacity-0 -translate-y-3'
                        }`}>
                            <button onClick={() => handleCancelReview()} className='btn-publish bg-muted py-2.5 px-8 font-medium cursor-pointer rounded-[999px] text-muted-foreborder-muted-foreground hover:bg-muted-foreground hover:text-black transition-all duration-200'>Batal</button>
                            <button onClick={() => handleSubmitReview()} className='btn-publish bg-[#99FF33] border border-[#99FF33] py-2.5 px-8 font-medium cursor-pointer rounded-[999px] text-black hover:bg-transparent hover:text-[#99ff33] transition-all duration-200'>Kirim</button>
                        </div>
                    </div>
                </div>

                <div className={`flex flex-col gap-5 duration-200 transition-all ${reviewText !== '' ? "translate-y-5" : "-translate-y-10"}`}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className='flex flex-col gap-5 mx-3 bg-[#222] p-8 rounded-3xl'>
                                <div className="flex items-center gap-5 w-full justify-between">
                                    <div className='flex gap-5 items-center'>
                                        <div className="post-avatar">
                                            <img src={ProfileIcon} alt="Profile" className="avatar w-10 h-10 max-md:w-8 max-md:h-8 rounded-full object-cover" />
                                        </div>
                                        <div className="post-user flex flex-col">
                                            <h6 className="text-white font-medium text-lg">{review.user.name || "Anggota Khaslana"}</h6>
                                            <p className="text-[#888] text-sm">
                                                {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                }) : "Baru saja"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex text-[#99ff33]">
                                        {"★".repeat(review.rating)}
                                    </div>
                                </div>

                                {review.comment}
                                
                                <div className="flex justify-between">
                                    <button type="button" onClick={() => handleLikeReview(review.id, product.id)} className={`post-opt-btn flex items-center gap-2 text-sm cursor-pointer transition-all duration-100 ${review.is_liked ? 'text-[#99ff33]' : ''}`}>
                                        <ThumbsUp className={`w-4 h-4`} /> 
                                        {review.review_likes.length}
                                    </button>

                                    {isMyReview(review.user.id) && (
                                        <button onClick={() => handleDeleteReview(review.id, product.id)} className='hover:text-[#99ff33] duration-200 transition-all cursor-pointer'>
                                            <Trash className="w-4"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex w-full justify-center text-[#adaaaa]">Belum ada ulasan terkait produk ini :(</div>
                    )}
                </div>
            </div> 
        </div>
    )
}