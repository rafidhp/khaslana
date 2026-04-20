import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import "@/components/khaslana/css/navbar.css";
import hamburger from "@/assets/icons/hamburger.png";
import logo from "@/assets/icons/khaslana-logo-green.png";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const { url } = usePage();

    const menus = [
        { name: "UMKM", href: "/umkm" },
        { name: "Katalog", href: "/katalog" },
        { name: "Komunitas", href: "/komunitas" },
        { name: "Tentang Kami", href: "/tentang-kami" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav
            className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
                menuOpen ? "menu-open" : ""
            }`}
        >
            <div className="navbar-left">
                <img
                    src={logo}
                    alt="Logo Khaslana"
                    className="navbar-logo"
                />
                <div className="logo-name">Khaslana</div>
            </div>
            <div 
                className="navbar-toggle" 
                onClick={handleToggle}
            >
                <img 
                    src={hamburger}
                    alt="menu" 
                />
            </div>
            <div className="navbar-right">
                <ul>
                    {menus.map((menu) => (
                        <li key={menu.href}>
                            <Link
                                href={menu.href}
                                onClick={handleCloseMenu}
                                className={`nav-link ${
                                    url.startsWith(menu.href)
                                        ? "navbar-active"
                                        : ""
                                }`}
                            >
                                {menu.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/register"
                            className="btn-primary-khaslana"
                            onClick={handleCloseMenu}
                        >
                            Ayo Mulai
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}