import { Head, Link } from "@inertiajs/react"
import { BotMessageSquare } from "lucide-react"
import Footer from "@/components/khaslana/footer"
import Navbar from "@/components/khaslana/navbar"
import { chatbot } from "@/routes"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const isChatbotPage = typeof window !== "undefined" && window.location.pathname === chatbot().url
    return (
        <div className="w-full overflow-x-hidden z-0">
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <Navbar />
            {!isChatbotPage && (
                <Link
                    href={chatbot()}
                    className="
                        fixed border-2 border-[#99ff33]
                        bg-[#97ff2e] hover:bg-[#1E1B26]
                        text-[#1E1B26] hover:text-[#99ff33]
                        p-2 z-50
                        rounded-full bottom-5 md:bottom-15 right-5 md:right-15
                        transition-all duration-200
                    "
                >
                    <BotMessageSquare className="size-8"/>
                </Link>
            )}
            <div className="min-h-screen h-auto">
                {children}
            </div>
            <Footer />
        </div>
    )
}