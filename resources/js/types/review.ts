import type { User } from "@/types/user";

export interface Review {
    id: number,
    user_id: number,
    umkm_id: number,
    product_id: number,
    rating: number,
    comment: string,
    created_at: string,
    updated_at: string,
    is_liked: boolean,

    user: User;
    review_likes: ReviewLike[];
}

export interface ReviewLike {
    id: number,
    review_id: number,
    user_id: number,
}