import { useForm } from "@inertiajs/react";
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
import { showErrorToast } from "@/lib/toast";
import { store, update } from "@/routes/product";
import { Product } from "@/types/product";
import { Promo } from "@/types/promo";

interface CreateIndexProps {
    categories: {
        id: number;
        name: string;
    }[];
    product?: Product;
    promos?: Promo[];
}

export default function CreateIndex({
    categories,
    product,
    promos = [],
}: CreateIndexProps) {
    console.log(promos)
    const [images, setImages] = useState<
        (
            | File
            | {
                id: number;
                image: string;
            }
        )[]
    >(product?.product_images ?? []);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm({
        category_id: product?.category_id ? String(product.category_id) : '',
        promo_id: product?.promo_id ? String(product.promo_id) : 'none',
        name: product?.name ?? '',
        description: product?.description ?? '',
        images: [] as File[],
        existing_images:
            product?.product_images?.map(
                image => image.id
            ) ?? [],
        attributes: [] as {
            name: string;
            values: string[];
        }[],
        variants: [] as {
            attributes: {
                attribute: string;
                value: string;
            }[];
            price: number;
            stock: number;
        }[],
    });
    const initialAttributes = (() => {
        if (!product) {
            return [
                {
                    name: '',
                    values: [''],
                },
            ];
        }
        const attributeMap = new Map<string, Set<string>>();

        product.product_variants?.forEach(
            (variant) => {
                variant.attribute_values?.forEach(
                    (attributeValue) => {
                        const attributeName = attributeValue.attribute?.name;

                        if (!attributeName) return;

                        if (
                            !attributeMap.has(attributeName)
                        ) {
                            attributeMap.set(attributeName, new Set());
                        }

                        attributeMap
                            .get(attributeName)
                            ?.add(attributeValue.value);
                    }
                );
            }
        );

        return Array.from(
            attributeMap.entries()
        ).map(([name, values]) => ({
            name,
            values: [
                ...Array.from(values),
                '',
            ],
        }));
    })();
    const [attributes, setAttributes] = useState(initialAttributes);
    const normalizedNames = attributes
        .map(attr => attr.name.trim().toLowerCase())
        .filter(Boolean);

    const duplicateNames = normalizedNames.filter(
        (name, index) => normalizedNames.indexOf(name) !== index
    );

    const duplicateAttributeValues = attributes.reduce<
        Record<number, string[]>
    >((acc, attribute, attributeIndex) => {
        const normalizedValues = attribute.values
            .map(v => v.trim().toLowerCase())
            .filter(Boolean);

        const duplicates = normalizedValues.filter(
            (value, index) => normalizedValues.indexOf(value) !== index
        );

        if (duplicates.length > 0) {
            acc[attributeIndex] = duplicates;
        }
        return acc;
    }, {});

    const hasDuplicateAttributes = duplicateNames.length > 0;
    const hasDuplicateAttributeValues = Object.keys(duplicateAttributeValues).length > 0;

    const disableVariants = hasDuplicateAttributes || hasDuplicateAttributeValues;;

    console.log({
        duplicateNames,
        hasDuplicateAttributes,
        attributes,
    });

    const initialVariantData = (() => {
        if (!product) return {};

        const variantState: Record<
            string,
            {
                price: string;
                stock: string;
            }
        > = {};

        product.product_variants?.forEach(
            (variant) => {
                const key = variant.attribute_values
                    ?.map((value) => `${value.attribute?.name}:${value.value}`)
                    .join('|') ?? '';

                variantState[key] = {
                    price: String(variant.price),
                    stock: String(variant.stock),
                };
            }
        );
        return variantState;
    })();
    const [variantData, setVariantData] = useState(initialVariantData);

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
        valueIndex: number,
        value: string,
    ) => {
        const targetAttribute = attributes[valueIndex]

        const isDuplicate = targetAttribute.values.some((attribute, index) => {
            return (
                value.trim().toLowerCase() !== "" && 
                attribute.toLowerCase().trim() === value.toLowerCase().trim() &&
                valueIndex !== index
            )
        })

        if (isDuplicate) {
            showErrorToast(`Nilai ${value} sudah digunakan, coba nama lain`)
            setIsAttributeNameDuplicate(true);
        } else {
            setIsAttributeNameDuplicate(false);
        }

        setAttributes((prev) =>
            prev.map((attr, i) =>
                i === valueIndex
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
        const targetAttribute = attributes[attributeIndex]
        
        const isDuplicate = targetAttribute.values.some((attribute, index) => {
            return (
                value.trim().toLowerCase() !== "" && 
                attribute.toLowerCase().trim() === value.toLowerCase().trim() &&
                index !== valueIndex
            )
        })

        if (isDuplicate) {
            showErrorToast(`Nilai ${value} sudah digunakan, coba nama lain`)
            setIsAttributeValueDuplicate(true);
        } else {
            setIsAttributeValueDuplicate(false);
        }
        
        setAttributes((prev) =>
            prev.map((attr, i) => {
                if (i !== attributeIndex) return attr;

                const values = [
                    ...attr.values,
                ];
                values[valueIndex] = value;

                const isLast = valueIndex === values.length - 1;
                if (
                    isLast && value.trim() !== ""
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

    const generateVariantCombinations = () => {
        const validAttributes = attributes
            .filter(
                (attribute) => attribute.name.trim() !== ""
            )
            .map((attribute) => ({
                name: attribute.name,
                values: attribute.values.filter(
                    (value) => value.trim() !== ""
                ),
            }))
            .filter(
                (attribute) => attribute.values.length > 0
            );

        if (
            validAttributes.length === 0
        ) {
            return [];
        }

        let combinations = validAttributes[0].values.map(
            (value) => [
                {
                    attribute: validAttributes[0].name,
                    value,
                },
            ]
        );

        for (
            let i = 1;
            i < validAttributes.length;
            i++
        ) {
            const currentAttribute =
                validAttributes[i];

            const newCombinations: {
                attribute: string;
                value: string;
            }[][] = [];

            combinations.forEach(
                (combination) => {
                    currentAttribute.values.forEach(
                        (value) => {
                            newCombinations.push([
                                ...combination,
                                {
                                    attribute:
                                        currentAttribute.name,
                                    value,
                                },
                            ]);
                        }
                    );
                }
            );
            combinations = newCombinations;
        }

        return combinations.map(
            (combination) => ({
                attributes:
                    combination,
                key: combination
                    .map(
                        (item) =>
                            `${item.attribute}:${item.value}`
                    )
                    .join("|"),
            })
        );
    };

    const generatedVariants = generateVariantCombinations();

    const updateVariantData = (
        key: string,
        field: "price" | "stock",
        value: string
    ) => {
        setVariantData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value,
            },
        }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(
            e.target.files || []
        );
        if (!files.length) return;

        const oversizedFiles = files.filter(
            (file) => file.size > 1 * 1024 * 1024
        );

        if (oversizedFiles.length > 0) {
            showErrorToast(`${oversizedFiles[0].name} melebihi batas 1 MB`);
        }

        const validFiles = files.filter(
            (file) => file.size <= 1 * 1024 * 1024
        );
        if (!validFiles.length) return;
        setImages((prev) => [
            ...prev,
            ...validFiles,
        ]);
        form.setData(
            "images",
            [
                ...form.data.images,
                ...validFiles,
            ]
        );
    };

    const removeImage = (index: number) => {
        const removedImage = images[index];
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        form.setData(
            "images",
            updatedImages.filter(
                (image): image is File => image instanceof File
            )
        );

        if (!(removedImage instanceof File)) {
            form.setData(
                "existing_images",
                form.data.existing_images.filter(
                    id => id !== removedImage.id
                )
            );
        }
    };

    const formatRupiah = (value: string | number) => {
        return new Intl.NumberFormat(
            "id-ID"
        ).format(Number(value));
    };

    const parseRupiah = (value: string) => {
        return value.replace(/\D/g, "");
    };

    const handleSubmit = () => {
        if (hasDuplicateAttributes) {
            showErrorToast(
                'Nama atribut duplikat',
                'Nama atribut harus berbeda satu sama lain'
            );
            return;
        }

        const formattedAttributes = attributes
            .filter(attribute => attribute.name.trim() !== "")
            .map(
                (attribute) => ({
                    name: attribute.name,
                    values: attribute.values.filter((value) => value.trim() !== ""),
                })
            )
            .filter(attribute => attribute.values.length > 0);

        const formattedVariants = generatedVariants.map(variant => ({
            attributes: variant.attributes,
            price: Number(
                variantData[variant.key]?.price || 0
            ),
            stock: Number(
                variantData[variant.key]?.stock || 0
            ),
        }));

        form.transform(data => ({
            ...data,
            attributes: formattedAttributes,
            variants: formattedVariants,
        }));

        const submitUrl = product ? update(product.id).url : store().url;

        if (product) {
            form.put(submitUrl,
                {
                    forceFormData: true,
                    preserveScroll: true,
                }
            );
        } else {
            form.post(submitUrl,
                {
                    forceFormData: true,
                    preserveScroll: true,
                }
            );
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-transparent border-2 border-[#99FF33]/50">
                <CardContent className="space-y-2">
                    <div>
                        <h2 className="text-lg font-semibold text-[#99FF33]">
                            {product
                                ? "Edit Produk"
                                : "Tambah Produk"
                            }
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
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
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
                        {form.errors.name && (
                            <p className="text-xs text-red-500">
                                {form.errors.name}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Deskripsi <span className="text-red-400"> *</span>
                        </Label>
                        <Textarea
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
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
                        {form.errors.description && (
                            <p className="text-xs text-red-500">
                                {form.errors.description}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Promo Toko (Opsional)
                        </Label>
                        <Select
                            value={form.data.promo_id}
                            onValueChange={(value) =>
                                form.setData("promo_id", value)
                            }
                        >
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
                                <SelectValue placeholder="Pilih promo (jika ada)" />
                            </SelectTrigger>
                            <SelectContent
                                className="
                                    border-gray-500/30
                                    bg-[#191720]
                                    text-white
                                    my-2
                                "
                            >
                                <SelectItem value="none" disabled>
                                    {promos.length <= 0 ? (
                                        'Tidak ada promo'
                                    ) : (
                                        'Pilih Promo'
                                    )}
                                </SelectItem>
                                {promos.map(
                                    (promo) => (
                                        <SelectItem
                                            key={promo.id}
                                            value={String(promo.id)}
                                        >
                                            {promo.name} {promo.type === 'DISKON' && promo.discount_percent ? `(-${promo.discount_percent}%)` : ''}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        {form.errors.promo_id && (
                            <p className="text-xs text-red-500">
                                {form.errors.promo_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Kategori <span className="text-red-400"> *</span>
                        </Label>
                        <Select
                            value={form.data.category_id}
                            onValueChange={(value) =>
                                form.setData("category_id", value)
                            }
                        >
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
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        {form.errors.category_id && (
                            <p className="text-xs text-red-500">
                                {form.errors.category_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-3">
                        <Label>
                            Foto Produk <span className="text-red-400"> *</span>
                        </Label>
                        <div
                            onClick={() => inputRef.current?.click()}
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
                                    <ImagePlus className="h-7 w-7 text-[#99FF33]" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Klik untuk upload foto
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        PNG, JPG, JPEG • Maks 1MB per foto
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

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((image, index) => (
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
                                            src={image instanceof File
                                                ? URL.createObjectURL(image)
                                                : `/storage/${image.image}`
                                            }
                                            alt={image instanceof File ? image.name : "product-image"}
                                            className="h-40 w-full object-cover" />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="
                                                absolute
                                                top-2 right-2
                                                h-8 w-8
                                                rounded-full
                                                bg-black/70
                                                text-white
                                                flex items-center justify-center
                                                opacity-0
                                                group-hover:opacity-100 transition-all
                                            "
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {form.errors.images && (
                            <p className="text-xs text-red-500">
                                {form.errors.images}
                            </p>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mt-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#99FF33]">
                                    Atribut Produk
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Contoh: Warna, Ukuran, Tingkat Pedas, Kemasan, dll
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
                                    transition-colors duration-200
                                    cursor-pointer
                                "
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Atribut
                            </Button>
                        </div>

                        {attributes.map(
                            (attribute, attributeIndex) => (
                                <div
                                    key={attributeIndex}
                                    className="border border-[#99FF33]/20 rounded-xl p-4 space-y-4"
                                >
                                    <div>
                                        <Label>
                                            Nama Atribut
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            value={attribute.name}
                                            onChange={(e) =>
                                                updateAttributeName(
                                                    attributeIndex,
                                                    e.target.value,
                                                    
                                                )
                                            }
                                            placeholder="Contoh: Warna"
                                            className="
                                                mt-2
                                                border-gray-500/30
                                                focus-visible:border-[#99FF33]
                                                focus-visible:ring-0
                                                transition-colors duration-200
                                            "
                                        />
                                        {hasDuplicateAttributes && duplicateNames.includes(
                                            attribute.name.trim().toLowerCase()
                                        ) && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Nama atribut tidak boleh sama dengan atribut sebelumnya
                                            </p>
                                        )}
                                        {form.errors[`attributes.${attributeIndex}.name`] && (
                                            <p className="text-xs text-red-500">
                                                {form.errors[`attributes.${attributeIndex}.name`]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Isi Atribut
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </Label>

                                        {attribute.values.map(
                                            (value, valueIndex) => (
                                                <div key={valueIndex} className="flex flex-col gap-1">
                                                    <Input
                                                        value={value}
                                                        onChange={(e) =>
                                                            updateAttributeValue(attributeIndex, valueIndex, e.target.value)
                                                        }
                                                        placeholder={`Contoh: Merah ${valueIndex +
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
                                                    {duplicateAttributeValues[
                                                        attributeIndex
                                                    ]?.includes(
                                                        value.trim().toLowerCase()
                                                    ) && value.trim() !== '' && (
                                                        <p className="text-xs text-red-500">
                                                            Isi atribut tidak boleh sama
                                                        </p>
                                                    )}
                                                    {form.errors[
                                                        `attributes.${attributeIndex}.values.${valueIndex}`
                                                    ] && (
                                                            <p className="text-xs text-red-500">
                                                                {
                                                                    form.errors[
                                                                    `attributes.${attributeIndex}.values.${valueIndex}`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {attributes.length >
                                        1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeAttribute(attributeIndex)
                                                }
                                            >
                                                Hapus Atribut
                                            </Button>
                                        )}
                                </div>
                            )
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-[#99FF33] mt-6">
                                Variant Produk
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Tentukan harga dan stok setiap variasi produk
                            </p>
                        </div>

                        {!disableVariants && generatedVariants.map(
                            (variant, index) => (
                                <div
                                    key={variant.key}
                                    className="border border-[#99FF33]/20 rounded-xl p-4 space-y-4"
                                >
                                    <div
                                        className="text-sm font-medium text-[#99FF33]">
                                        {form.data.name ||
                                            "Produk"}{" "}
                                        •{" "}
                                        {variant.attributes
                                            .map((item) => `${item.attribute}: ${item.value}`)
                                            .join(" | ")}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>
                                                Harga
                                            </Label>
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={formatRupiah(variantData[variant.key]?.price || "")}
                                                onChange={(e) =>
                                                    updateVariantData(
                                                        variant.key,
                                                        "price",
                                                        parseRupiah(e.target.value)
                                                    )
                                                }
                                                placeholder="100.000"
                                                className="
                                                    mt-2
                                                    border-gray-500/30
                                                    focus-visible:border-[#99FF33]
                                                    focus-visible:ring-0
                                                    [appearance:textfield]
                                                    [&::-webkit-outer-spin-button]:appearance-none
                                                    [&::-webkit-inner-spin-button]:appearance-none
                                                "
                                            />
                                            {form.errors[`variants.${index}.price`] && (
                                                <p className="text-xs text-red-500">
                                                    {form.errors[`variants.${index}.price`]}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label>
                                                Stok
                                            </Label>
                                            <Input
                                                type="number"
                                                value={variantData[variant.key]?.stock || ""}
                                                onChange={(e) =>
                                                    updateVariantData(
                                                        variant.key,
                                                        "stock",
                                                        e.target.value
                                                    )
                                                }
                                                min={0}
                                                className="
                                                    mt-2
                                                    border-gray-500/30
                                                    focus-visible:border-[#99FF33]
                                                    focus-visible:ring-0
                                                    [appearance:textfield]
                                                    [&::-webkit-outer-spin-button]:appearance-none
                                                    [&::-webkit-inner-spin-button]:appearance-none
                                                "
                                            />
                                            {form.errors[`variants.${index}.stock`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {form.errors[`variants.${index}.stock`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                        {disableVariants && (
                            <div className="rounded-lg border border-red-500/30 p-4">
                                <p className="text-sm text-red-500">
                                    Perbaiki nama atribut yang duplikat terlebih dahulu untuk menghasilkan variant produk.
                                </p>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing || hasDuplicateAttributes}
                        className="
                            mt-4
                            bg-[#99FF33]
                            border border-[#99FF33]
                            text-[#1E1B26]
                            hover:bg-[#1E1B26]
                            hover:text-[#99FF33]
                            transition-colors duration-200
                            cursor-pointer disabled:cursor-not-allowed!
                            disabled:pointer-events-auto disabled:bg-[#99FF33]
                            disabled:text-[#1E1B26]
                        "
                    >
                        {form.processing
                            ? "Menyimpan..." : product
                                ? "Update Produk" : "Simpan Produk"
                        }
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}