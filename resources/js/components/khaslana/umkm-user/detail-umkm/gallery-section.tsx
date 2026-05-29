import type { Umkm } from "@/types/umkm"

interface GallerySectionProps {
    umkmData: Umkm;
}

export default function GallerySection({
    umkmData,
}: GallerySectionProps) {
    console.log(umkmData);
    return (
        <div className="flex flex-col mt-12 mb-4">
            <h1 className="text-xl md:text-2xl font-bold mb-6">
                Galeri Suasana
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {umkmData.umkm_images?.map((image) => (
                    <img
                        key={image.id}
                        src={`/storage/${image.image}`}
                        alt={umkmData.store_name}
                        className="w-full max-h-[400px] object-cover rounded-xl"
                    />
                ))}
            </div>
        </div>
    )
}