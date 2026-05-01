import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import "@/components/khaslana/css/logged-in-navbar.css";

import cartIcon from "@/assets/images/katalog/cart.png";
import notifIcon from "@/assets/images/katalog/notif.svg";
import profilePic from "@/assets/images/katalog/profile.png";
import hamburger from "@/assets/images/landing-page/hamburger.png";
import logo from "@/assets/images/landing-page/khaslana-logo-green.png";

export function LoggedInNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { url } = usePage();

    const menus = [
        { name: "Beranda", href: "/" },
        { name: "Katalog", href: "/catalog " },
        { name: "UMKM", href: "/umkm" },
        { name: "Komunitas", href: "/community" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleToggle = () => setMenuOpen(!menuOpen);
    const handleCloseMenu = () => setMenuOpen(false);

    return (
        <nav
            className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
                menuOpen ? "menu-open" : ""
            }`}
        >
            <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-[55px]">
                
                {/* Bagian Kiri */}
                <div className="navbar-left">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Logo Khaslana"
                            className="navbar-logo"
                        />
                        <div className="logo-name">Khaslana</div>
                    </Link>
                </div>

                {/* Bagian Tengah */}
                <div className="navbar-mid">
                    <ul>
                        <li className="mobile-profile">
                            <img src={profilePic} alt="user profile" />
                            <span>My Profile</span>
                        </li>
                        
                        {menus.map((menu) => {
                            // Ambil path bersih tanpa query string
                            const currentPath = url.split('?')[0];
                            
                            // Cek apakah menu ini aktif
                            const isActive = menu.href === "/" 
                                ? currentPath === "/" 
                                : currentPath.startsWith(menu.href);

                            return (
                                <li key={menu.name}>
                                    <Link
                                        href={menu.href}
                                        onClick={handleCloseMenu}
                                        // Class ini yang memicu warna hijau di CSS UTS lu
                                        className={isActive ? "navbar-active" : ""}
                                    >
                                        {menu.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Bagian Kanan */}
                <div className="navbar-right">
                    <Link href="#">
                        <img src={notifIcon} alt="notification" className="cursor-pointer" />
                    </Link>
                    <Link href="#">
                        <img src={cartIcon} alt="cart png" className="cursor-pointer" />
                    </Link>
                    <Link href="#" className="desktop-only">
                        <img src={profilePic} className="profile" alt="user profile" />
                    </Link>
                    
                    <div className="navbar-toggle" onClick={handleToggle}>
                        <img src={hamburger} alt="menu" />
                    </div>
                </div>
            </div>
        </nav>
    );
}