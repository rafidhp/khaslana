import { Head } from "@inertiajs/react"
import Footer from "@/components/khaslana/footer"
import Navbar from "@/components/khaslana/navbar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <Navbar />
            <div className="min-h-screen h-auto">
                {children}
            </div>
            <Footer />
        </div>
    )
}