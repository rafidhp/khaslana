import { usePage, router } from "@inertiajs/react";
import { ThumbsUp, MessageCircleMore, Trash } from "lucide-react";
import { useState } from "react";
import ProfileIcon from "@/assets/icons/default-profile.png";

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
    // const { user } = useAuth();
    const { product } = usePage().props as unknown as ProductDetailProps;
    const reviews = product.reviews || [];

    const [isUploaded, setIsUploaded] = useState(false);
    const [reviewText, setReviewText] = useState('');

    const handleSubmitReview = () => {
            if (!reviewText.trim()) {
                alert("Ulasan tidak boleh kosong!")
                return;
            }
    
            router.post(`/community/${product.id}/comment`, {
                comment: reviewText,
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setReviewText("");
                    setIsUploaded(true);
    
                    setTimeout(() => {
                        setIsUploaded(false);
                        router.visit(`/community/${product.id}`, {
                            preserveScroll: false
                        })
                    }, 3000)
                }
            })
        };
    
        const handleCancelReview = () => {
            setReviewText('');
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
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div>{review.comment}</div>
                    ))
                ) : (
                    <div className="flex w-full justify-center text-[#adaaaa]">Belum ada ulasan terkait produk ini :(</div>
                )}
            </div> 
        </div>
    )
}