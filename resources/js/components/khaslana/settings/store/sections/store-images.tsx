import type { InertiaFormProps } from "@inertiajs/react";
import { ImagePlus, X } from "lucide-react";
import { useRef, useEffect } from "react";

import { type StoreFormData } from "@/components/khaslana/settings/store/types";
import { Label } from "@/components/ui/label";

interface Props {
    data: StoreFormData;
    setData: InertiaFormProps<StoreFormData>['setData'];
    errors: Record<string, string>;
    setIsValidImages: (value: boolean) => void;
}

export default function StoreImages({
    data,
    setData,
    errors,
    setIsValidImages,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleImagesChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        const validFiles = files.filter((file) => {
            return (
                file.size <= 1024 * 1024 &&
                file.name.length <= 100
            );
        });
        setData('images', [...data.images, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, i) => i !== index)
        );
    };

    const removeExistingImage = (id: number) => {
        setData(
            'deleted_existing_images',
            [...data.deleted_existing_images, id]
        );
        setData(
            'existing_images',
            data.existing_images.filter(
                (image) => image.id !== id
            )
        );
    };

    useEffect(() => {
        const totalImages = data.images.length + data.existing_images.length;
        setIsValidImages(totalImages > 0);
    }, [
        data.images,
        data.existing_images,
        setIsValidImages,
    ]);

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">
                    Foto Toko
                </h3>
                <p className="text-sm text-muted-foreground">
                    Upload foto-foto toko anda
                </p>
            </div>
            <div className="space-y-2">
                <Label>
                    Foto Toko
                    <span className="text-red-400"> *</span>
                </Label>
                <div
                    onClick={() => inputRef.current?.click()}
                    className="
                        border-2 border-dashed border-[#99FF33]/40
                        hover:border-[#99FF33]
                        transition-all duration-200
                        rounded-xl
                        p-6 mt-2
                        cursor-pointer
                        bg-transparent
                        hover:bg-[#99FF33]/5
                    "
                >
                    <div className="flex flex-col items-center justify-center text-center gap-3">
                        <div className="
                            h-14 w-14 rounded-full
                            bg-[#99FF33]/10
                            flex items-center justify-center
                        ">
                            <ImagePlus className="h-7 w-7 text-[#99FF33]" />
                        </div>
                        <div>
                            <p className="font-medium">
                                Klik untuk upload foto
                            </p>
                            <p className="text-sm text-muted-foreground">
                                PNG, JPG, JPEG • Maks 1MB
                            </p>
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImagesChange}
                    />
                </div>
                {errors.images && (
                    <p className="text-xs text-red-500">
                        {errors.images}
                    </p>
                )}
            </div>

            {(data.images.length > 0 || data.existing_images.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.images.map((image, index) => (
                        <div
                            key={index}
                            className="
                                relative overflow-hidden
                                rounded-xl border
                                border-[#99FF33]/30
                                group
                            "
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt={image.name}
                                className="
                                    h-40 w-full object-cover
                                "
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="
                                    absolute top-2 right-2
                                    h-8 w-8 rounded-full
                                    bg-black/70
                                    text-white
                                    flex items-center justify-center
                                    opacity-0 group-hover:opacity-100
                                    transition-all duration-200
                                "
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    {data.existing_images.map((image) => (
                        <div
                            key={image.id}
                            className="
                                relative overflow-hidden
                                rounded-xl border
                                border-[#99FF33]/30
                                group
                            "
                        >
                            <img
                                src={image.image}
                                alt={`store-image-${image.id}`}
                                className="
                                    h-40 w-full object-cover
                                "
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    removeExistingImage(image.id)
                                }
                                className="
                                    absolute top-2 right-2
                                    h-8 w-8 rounded-full
                                    bg-black/70
                                    text-white
                                    flex items-center justify-center
                                    opacity-0 group-hover:opacity-100
                                    transition-all duration-200
                                    hover:cursor-pointer hover:bg-gray-600/70
                                "
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}