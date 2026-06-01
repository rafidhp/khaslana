import { Head } from "@inertiajs/react";
import ChatbotIndex from "@/components/khaslana/chatbot/chatbot-index";
import UserLayout from "@/layouts/user-layout";

export default function Cart() {
    return (
        <UserLayout>
            <Head title="Help">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <ChatbotIndex />
        </UserLayout>
    )
}