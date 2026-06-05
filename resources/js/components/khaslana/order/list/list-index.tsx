import type { Order } from "@/types/order"

interface ListIndexProps {
    orders: Order[];
}

export default function ListIndex({
    orders,
}: ListIndexProps) {
    console.log(orders);
    return (
        <div className="flex flex-col w-full px-6 pt-32 lg:px-17.5 mx-auto">List Order</div>
    )
}