import type { Order } from "@/types/order"

interface ShowIndexProps {
    order: Order;
}

export default function ShowIndex({
    order,
}: ShowIndexProps) {
    console.log(order);
    return (
        <div className="flex flex-col w-full px-6 pt-32 lg:px-17.5 mx-auto">Show Order</div>
    )
}