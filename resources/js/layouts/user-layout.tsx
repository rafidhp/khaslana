import Footer from "@/components/khaslana/footer"
import Navbar from "@/components/khaslana/navbar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}