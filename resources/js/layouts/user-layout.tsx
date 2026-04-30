import Footer from "@/components/khaslana/footer"
import Navbar from "@/components/khaslana/navbar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen overflow-x-hidden">
            <Navbar />
            <div className="min-h-screen h-auto">
                {children}
            </div>
            <Footer />
        </div>
    )
}