import type { Umkm } from "@/types/umkm";

interface Review {
    id: number;
    product_id: number;
    rating: number;
    comment: string;
}

interface ReviewSectionProps {
    umkmData: Umkm;
    reviews: Review[];
}

export default function ReviewSection({
    umkmData,
    reviews,
}: ReviewSectionProps) {
    return (
        <div className="flex flex-col mt-12 mb-20 gap-2">
            <h2 className="text-xl md:text-2xl font-bold">
                Suara Komunitas
            </h2>
            <h3 className="text-muted-foreground text-sm md:text-base">
                Apa kata mereka tentang pengalaman di {umkmData.store_name}
            </h3>
            {reviews.length === 0 ? (
                <div className="w-full mt-8 flex items-center justify-center">
                    <p className="text-sm md:text-base text-center text-white/80">
                        Belum ada review tentang toko ini.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 mt-4">
                    {reviews.map((review, index) => (
                        <div
                            key={`${review.product_id}-${index}`}
                            className="border rounded-xl p-4 bg-card"
                        >
                            <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>
                                        {i < review.rating ? "⭐" : "☆"}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm md:text-base text-muted-foreground">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}