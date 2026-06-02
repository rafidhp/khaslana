import { ImagePlus, X, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";

interface CreateIndexProps {
    categories: {
        id: number;
        name: string;
    }[];
}

export default function CreateIndex({
    categories,
}: CreateIndexProps) {
    console.log(categories);
    const [images, setImages] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [attributes, setAttributes] = useState([
        {
            name: "",
            values: [""],
        },
    ]);

    const addAttribute = () => {
        setAttributes((prev) => [
            ...prev,
            {
                name: "",
                values: [""],
            },
        ]);
    };

    const removeAttribute = (
        index: number
    ) => {
        setAttributes((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    const updateAttributeName = (
        index: number,
        value: string
    ) => {
        setAttributes((prev) =>
            prev.map((attr, i) =>
                i === index
                    ? {
                        ...attr,
                        name: value,
                    }
                    : attr
            )
        );
    };

    const updateAttributeValue = (
        attributeIndex: number,
        valueIndex: number,
        value: string
    ) => {
        setAttributes((prev) =>
            prev.map((attr, i) => {
                if (
                    i !== attributeIndex
                )
                    return attr;

                const values = [
                    ...attr.values,
                ];

                values[valueIndex] =
                    value;

                const isLast =
                    valueIndex ===
                    values.length - 1;

                if (
                    isLast &&
                    value.trim() !== ""
                ) {
                    values.push("");
                }

                return {
                    ...attr,
                    values,
                };
            })
        );
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(
            e.target.files || []
        );

        if (!files.length) return;

        const validFiles = files.filter(
            (file) => file.size <= 10 * 1024 * 1024
        );
        setImages((prev) => [
            ...prev,
            ...validFiles,
        ]);
    };

    const removeImage = (index: number) => {
        setImages(
            images.filter(
                (_, i) => i !== index
            )
        );
    };
    
    return (
        <div className="space-y-6">
            <Card className="bg-transparent border-2 border-[#99FF33]/50">
                <CardContent className="space-y-2">
                    <div>
                        <h2 className="text-lg font-semibold text-[#99FF33]">
                            Tambah Produk
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola produk yang akan dijual
                        </p>
                    </div>
                    <div className="space-y-2 mt-6">
                        <Label>
                            Nama Produk <span className="text-red-400"> *</span>
                        </Label>
                        <Input
                            placeholder="Contoh: Ayam Geprek Original"
                            className="
                                mt-2
                                border-gray-500/30
                                focus-visible:border-[#99FF33]
                                focus-visible:ring-0
                                dark:bg-transparent
                                transition-colors duration-200
                            "
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Deskripsi <span className="text-red-400"> *</span>
                        </Label>
                        <Textarea
                            rows={5}
                            placeholder="Deskripsi produk..."
                            className="
                                mt-2
                                border-gray-500/30
                                focus-visible:border-[#99FF33]
                                focus-visible:ring-0
                                dark:bg-transparent
                                transition-colors duration-200
                            "
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Kategori <span className="text-red-400"> *</span>
                        </Label>
                        <Select>
                            <SelectTrigger
                                className="
                                    mt-2
                                    border-gray-500/30
                                    bg-transparent
                                    transition-all duration-200
                                    focus:ring-0
                                    focus:border-[#99FF33]
                                    data-[state=open]:border-[#99FF33]
                                    hover:border-[#99FF33]
                                "
                            >
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent
                                className="
                                    border-gray-500/30
                                    bg-[#191720]
                                    text-white
                                    my-2
                                "
                            >
                                {categories.map(
                                    (category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(
                                                category.id
                                            )}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                   <div className="space-y-3">
                        <Label>
                            Foto Produk
                            <span className="text-red-400">
                                *
                            </span>
                        </Label>

                        <div
                            onClick={() =>
                                inputRef.current?.click()
                            }
                            className="
                                border-2 border-dashed
                                border-[#99FF33]/40
                                hover:border-[#99FF33]
                                rounded-xl
                                p-6
                                cursor-pointer
                                transition-all duration-200
                                hover:bg-[#99FF33]/5
                            "
                        >
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div
                                    className="
                                        h-14 w-14 rounded-full
                                        bg-[#99FF33]/10
                                        flex items-center justify-center
                                    "
                                >
                                    <ImagePlus
                                        className="
                                            h-7 w-7
                                            text-[#99FF33]
                                        "
                                    />
                                </div>

                                <div>
                                    <p className="font-medium">
                                        Klik untuk upload foto
                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            text-muted-foreground
                                        "
                                    >
                                        PNG, JPG, JPEG
                                        • Maks 10MB
                                    </p>
                                </div>
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={
                                    handleImagesChange
                                }
                            />
                        </div>

                        {images.length > 0 && (
                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    md:grid-cols-4
                                    gap-4
                                "
                            >
                                {images.map(
                                    (
                                        image,
                                        index
                                    ) => (
                                        <div
                                            key={index}
                                            className="
                                                relative
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                border-[#99FF33]/30
                                                group
                                            "
                                        >
                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={
                                                    image.name
                                                }
                                                className="
                                                    h-40
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                                className="
                                                    absolute
                                                    top-2
                                                    right-2
                                                    h-8
                                                    w-8
                                                    rounded-full
                                                    bg-black/70
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    opacity-0
                                                    group-hover:opacity-100
                                                    transition-all
                                                "
                                            >
                                                <X
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-[#99FF33]">
                                    Attribute Produk
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Contoh:
                                    Warna, Ukuran,
                                    Tingkat Pedas,
                                    Kemasan, dll
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={addAttribute}
                                className="
                                    bg-[#99FF33]
                                    text-[#1E1B26]
                                    border border-[#99FF33]
                                    hover:bg-[#1E1B26]
                                    hover:text-[#99FF33]
                                    cursor-pointer
                                "
                            >
                                <Plus className="h-4 w-4" />
                                Attribute
                            </Button>
                        </div>

                        {attributes.map(
                            (
                                attribute,
                                attributeIndex
                            ) => (
                                <div
                                    key={attributeIndex}
                                    className="
                                        border
                                        border-[#99FF33]/20
                                        rounded-xl
                                        p-4
                                        space-y-4
                                    "
                                >
                                    <div>
                                        <Label>
                                            Nama Attribute
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>

                                        <Input
                                            value={
                                                attribute.name
                                            }
                                            onChange={(e) =>
                                                updateAttributeName(
                                                    attributeIndex,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Warna"
                                            className="
                                                mt-2
                                                border-gray-500/30
                                                focus-visible:border-[#99FF33]
                                                focus-visible:ring-0
                                            "
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Value Attribute
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>

                                        {attribute.values.map(
                                            (
                                                value,
                                                valueIndex
                                            ) => (
                                                <Input
                                                    key={
                                                        valueIndex
                                                    }
                                                    value={
                                                        value
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateAttributeValue(
                                                            attributeIndex,
                                                            valueIndex,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    placeholder={`Value ${
                                                        valueIndex +
                                                        1
                                                    }`}
                                                    className="
                                                        border-gray-500/30
                                                        focus-visible:border-[#99FF33]
                                                        focus-visible:ring-0
                                                    "
                                                    required={
                                                        valueIndex !==
                                                        attribute.values
                                                            .length -
                                                            1
                                                    }
                                                />
                                            )
                                        )}
                                    </div>

                                    {attributes.length >
                                        1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() =>
                                                removeAttribute(
                                                    attributeIndex
                                                )
                                            }
                                        >
                                            Hapus Attribute
                                        </Button>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                    <Button
                        className="
                            bg-[#99FF33]
                            border border-[#99FF33]
                            text-[#1E1B26]
                            hover:bg-[#1E1B26]
                            hover:text-[#99FF33]
                            transition-colors duration-200
                            cursor-pointer
                        "
                    >
                        Simpan Produk
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}