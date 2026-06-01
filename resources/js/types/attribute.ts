export interface Attribute {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string;
    additional_price: number;
    created_at: string;
    updated_at: string;

    attribute?: Attribute;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    stock: number;
    created_at: string;
    updated_at: string;

    attribute_values?: AttributeValue[];
}