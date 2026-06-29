import { router } from "@inertiajs/react";
import { X, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import DefaultProduct from "@/assets/images/product/default-product.png";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { login } from "@/routes";
import { dialogStore } from "@/routes/order";
import type { ProductVariant } from "@/types/attribute";
import type { Product } from "@/types/product";

interface VariantDialogProps {
    product: Product;
    open: boolean;
    onClose: () => void;
    actionType: "buy-now" | "add-cart";
}

export default function VariantDialog({
    product,
    open,
    onClose,
    actionType,
}: VariantDialogProps) {
    const { user } = useAuth();
    
    const groupedAttributes = useMemo(() => {
        const result: Record<string, string[]> = {};

        product.product_variants?.forEach((variant) => {
            variant.attribute_values?.forEach((attr) => {
                const key = attr.attribute?.name ?? "";

                if (!result[key]) {
                    result[key] = [];
                }

                if (!result[key].includes(attr.value)) {
                    result[key].push(attr.value);
                }
            });
        });
        return result;
    }, [product]);
    const hasVariants = Object.keys(groupedAttributes).length > 0;

    const [quantity, setQuantity] = useState(1);
    const [selectedAttributes, setSelectedAttributes] =
        useState<Record<string, string>>(() => {
            const initial: Record<string, string> = {};
            const result: Record<string, string[]> = {};

            product.product_variants?.forEach((variant) => {
                variant.attribute_values?.forEach((attr) => {
                    const key = attr.attribute?.name ?? "";

                    if (!result[key]) {
                        result[key] = [];
                    }

                    if (!result[key].includes(attr.value)) {
                        result[key].push(attr.value);
                    }
                });
            });

            Object.entries(result).forEach(
                ([attributeName, values]) => {
                    if (values.length > 0) {
                        initial[attributeName] = values[0];
                    }
                }
            );
            return initial;
        });

    const selectedVariant = useMemo<ProductVariant | undefined>(() => {
        return product.product_variants?.find((variant) => {
            return Object.entries(selectedAttributes).every(
                ([attributeName, selectedValue]) =>
                    variant.attribute_values?.some(
                        (attributeValue) =>
                            attributeValue.attribute?.name === attributeName &&
                            attributeValue.value === selectedValue
                    )
            );
        });
    }, [
        product.product_variants,
        selectedAttributes,
    ]);

    // --- LOGIKA PERHITUNGAN HARGA PROMO ---
    const originalPrice = selectedVariant?.price ?? 0;
    const stock = selectedVariant?.stock ?? 0;
    const isPurchasable = selectedVariant !== undefined && stock > 0;
    
    let finalPrice = originalPrice;
    const isPromoActive = product.promo && product.promo.status === 'BERLANGSUNG';
    
    if (isPromoActive && product.promo?.type === 'DISKON' && product.promo?.discount_percent) {
        finalPrice = originalPrice - (originalPrice * (Number(product.promo.discount_percent) / 100));
    }
    // --------------------------------------

    const formatPrice = (value: number) => new Intl.NumberFormat("id-ID").format(value);
    const image = product.product_images?.[0]?.image;

    const handleAttributeSelect = (
        attributeName: string,
        value: string
    ) => {
        const nextAttributes = {
            ...selectedAttributes,
            [attributeName]: value,
        };

        setSelectedAttributes(nextAttributes);

        const nextVariant = product.product_variants?.find((variant) =>
            Object.entries(nextAttributes).every(
                ([attributeName, selectedValue]) =>
                    variant.attribute_values?.some(
                        (attributeValue) =>
                            attributeValue.attribute?.name === attributeName &&
                            attributeValue.value === selectedValue
                    )
            )
        );

        const nextStock = nextVariant?.stock ?? 0;

        setQuantity((prev) => Math.min(Math.max(prev, 1), Math.max(nextStock, 1)));
    };

    const handleQuantityChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value = e.target.value;

        value = value.replace(/\D/g, "");
        value = value.replace(/^0+/, "");

        if (value === "") {
            setQuantity(1);
            return;
        }
        let qty = Number(value);

        if (qty < 1) qty = 1;
        if (qty > stock) qty = stock;

        setQuantity(qty);
    };

    const handleSubmit = () => {
        if (!user) {
            router.visit(login());
            return;
        }

        if (!selectedVariant) {
            return;
        }

        console.log(selectedVariant);
        console.log(selectedAttributes);

        console.log({
            actionType,
            product_id: product.id,
            variant_id: selectedVariant.id,
            quantity,
            attributes: selectedAttributes,
        });

        if (actionType === "add-cart") {
            router.post(
                "/cart/add",
                {
                    product_variant_id: selectedVariant.id,
                    quantity,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        showSuccessToast(
                            "Berhasil ditambahkan",
                            "Produk masuk ke keranjang"
                        );
                        onClose();
                    },
                    onError: (errors) => {
                        const firstError = Object.values(errors)[0];
                        if (firstError) {
                            showErrorToast("Gagal", String(firstError));
                        }
                    },
                }
            );
            return;
        }

        if (actionType === "buy-now") {
            router.post(dialogStore(product.id).url,
                {
                    variant_id: selectedVariant.id,
                    quantity,
                },
                {
                    preserveScroll: true,
                    onError: (errors) => {
                        const firstError = Object.values(errors)[0];
                        if (firstError) {
                            showErrorToast("Gagal", String(firstError));
                        }
                    },
                }
            )
        }
    };

    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                bg-black/70 backdrop-blur-sm
                flex items-center justify-center
                p-4
            "
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    w-full max-w-3xl
                    bg-[#1E1B26]
                    border border-[#2E2A39]
                    rounded-3xl
                    overflow-hidden
                "
            >
                {/* header section */}
                <div
                    className="
                        flex items-center justify-between
                        px-6 py-5
                        border-b border-[#2E2A39]
                    "
                >
                    <h2 className="text-white text-xl font-semibold">
                        Pilih Detail Produk
                    </h2>
                    <button
                        onClick={onClose}
                        className="
                            h-10 w-10
                            rounded-full
                            flex items-center justify-center
                            hover:bg-white/10
                            transition
                            cursor-pointer
                        "
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-5">
                        <div
                            className="
                                h-28 w-28
                                rounded-2xl
                                overflow-hidden
                                bg-white
                                shrink-0
                            "
                        >
                            <img
                                src={
                                    image
                                        ? `/storage/${image}`
                                        : DefaultProduct
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            {/* --- UPDATE TAMPILAN HARGA PROMO --- */}
                            <div className="flex items-end gap-3">
                                <h3
                                    className="
                                        text-[#99FF33]
                                        text-3xl
                                        font-bold
                                    "
                                >
                                    Rp {formatPrice(finalPrice)}
                                </h3>
                                {isPromoActive && originalPrice > finalPrice && (
                                    <span className="text-gray-500 line-through text-lg font-medium mb-0.5">
                                        Rp {formatPrice(originalPrice)}
                                    </span>
                                )}
                            </div>
                            {/* ----------------------------------- */}
                            <p className="text-white text-xl mt-2 font-medium">
                                {product.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-gray-400 mt-2">
                                    Stok tersedia:
                                    <span className="text-white font-medium ml-1">
                                        {stock} pcs
                                    </span>
                                </p>
                                {!isPurchasable && (
                                    <p className="mt-3 text-red-400 bg-amber-900/30 px-2 rounded-full text-sm">
                                        Varian ini sedang habis
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* attribute selector */}
                    {hasVariants && (
                        <div className="mt-8 flex flex-col gap-6">
                            {Object.entries(groupedAttributes).map(
                                ([attributeName, values]) => (
                                    <div key={attributeName}>
                                        <p
                                            className="
                                                text-white
                                                font-medium
                                                mb-3
                                            "
                                        >
                                            {attributeName}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {values.map((value) => {
                                                const isSelected =
                                                    selectedAttributes[
                                                        attributeName
                                                    ] === value;

                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => handleAttributeSelect(attributeName, value)}
                                                        className={`
                                                            px-4 py-2
                                                            rounded-xl
                                                            border
                                                            transition
                                                            cursor-pointer
                                                            ${isSelected
                                                                    ? `
                                                                        border-[#99FF33]
                                                                        bg-[#99FF33]/10
                                                                        text-[#99FF33]
                                                                    `
                                                                    : `
                                                                        border-[#3A3547]
                                                                        text-white
                                                                        hover:border-[#99FF33]
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* variant section */}
                    {hasVariants && (
                        <div className="mt-8 bg-[#25212F] rounded-2xl p-4">
                            <p className="text-sm text-gray-400">
                                Varian Dipilih
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Object.entries(
                                    selectedAttributes
                                ).map(([key, value]) => (
                                    <span
                                        key={key}
                                        className="
                                            px-3 py-1
                                            rounded-full
                                            bg-[#99FF33]/10
                                            text-[#99FF33]
                                            text-sm
                                        "
                                    >
                                        {key}: {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-8 flex items-center justify-between">
                        <span className="text-white font-medium">
                            Jumlah
                        </span>
                        <div
                            className="
                                flex items-center
                                border border-[#3A3547]
                                rounded-2xl
                                overflow-hidden
                            "
                        >
                            <button
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                disabled={stock <= 1}
                                className={`
                                    w-12 h-12
                                    flex items-center justify-center
                                    text-white
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:text-white/50
                                    ${quantity <= 1 && 'text-white/50 hover:cursor-not-allowed'}
                                `}
                            >
                                <Minus size={18} />
                            </button>
                            <input
                                type="text"
                                inputMode="numeric"
                                disabled={!isPurchasable}
                                value={quantity}
                                onChange={handleQuantityChange}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="
                                    w-16 h-12
                                    bg-transparent
                                    text-center text-white
                                    font-semibold outline-none
                                    disabled:text-muted-foreground
                                    disabled:cursor-not-allowed
                                "
                            />
                            <button
                                onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
                                disabled={stock <= 0 || quantity >= stock}
                                className="
                                    w-12 h-12
                                    flex items-center justify-center
                                    text-white
                                    cursor-pointer
                                    disabled:cursor-not-allowed
                                    disabled:text-white/50
                                "
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={!isPurchasable}
                            className={`
                                w-full
                                btn-primary-khaslana
                                ${!isPurchasable
                                    ? "opacity-50 cursor-not-allowed hover:bg-[#99FF33] hover:text-[#1E1B26]"
                                    : "cursor-pointer"
                                }
                            `}
                        >
                            {actionType === "buy-now"
                                ? "Beli Sekarang"
                                : "Tambah ke Keranjang"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}