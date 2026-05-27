import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import "@/components/khaslana/css/navbar.css";
import DefaultProfile from "@/assets/icons/default-profile.png";
import hamburger from "@/assets/icons/hamburger.png";
import logo from "@/assets/icons/khaslana-logo-green.png";
import { useAuth } from "@/hooks/use-auth";
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import {
    login,
    home,
    catalog,
    community,
    about,
    umkm,
    dashboard,
    logout
} from "@/routes";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user } = useAuth();
    const { url } = usePage();
    const menus = user
        ? [
            { name: "Beranda", href: home().url },
            { name: "UMKM", href: umkm().url },
            { name: "Katalog", href: catalog().url },
            { name: "Komunitas", href: community().url },
            ...(user.is_umkm
                ? [{ name: "Kelola Toko", href: dashboard().url }]
                : []),
        ]
        : [
            { name: "UMKM", href: umkm().url },
            { name: "Katalog", href: catalog().url },
            { name: "Komunitas", href: community().url },
            { name: "Tentang Kami", href: about().url },
        ];
    const navRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
            
            if (
                navRef.current &&
                !navRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        }
        document.addEventListener(
            'click',
            handleClickOutside
        );
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    const cleanup = useMobileNavigation();
    
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <nav
            ref={navRef}
            className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
                menuOpen ? "menu-open" : ""
            }`}
        >
            <div className="navbar-left">
                <Link
                    href={home()}
                    onClick={handleCloseMenu}
                    className="flex items-center gap-3"
                >
                    <img
                        src={logo}
                        alt="Logo Khaslana"
                        className="navbar-logo"
                    />
                    <div className="font-semibold">Khaslana</div>
                </Link>
            </div>
            <div 
                className="navbar-toggle relative" 
            >
                <img 
                    src={hamburger}
                    alt="menu" 
                    onClick={handleToggle}
                />
            </div>
            <div className={`flex justify-center items-center w-full navbar-right ${user ? "navbar-right-auth" : ""}`}>
                <ul className={`
                    ${user ? "navbar-authenticated" : ""}
                    ${user ? "navbar-mobile-auth" : ""}
                    ${user ? "max-[900px]:mb-8" : ""}
                    `}>
                    {menus.map((menu) => (
                        <li key={menu.name}>
                            <Link
                                href={menu.href}
                                onClick={handleCloseMenu}
                                className={`nav-link ${
                                    menu.href === '/'
                                    ? url === '/'
                                        ? 'navbar-active'
                                        : ''
                                    : url.startsWith(menu.href)
                                        ? 'navbar-active'
                                        : ''
                                }`}
                            >
                                {menu.name}
                            </Link>
                        </li>
                    ))}
                    <li className={user ? "navbar-profile-item" : ""}>
                        {
                            user ? (
                                <div className="navbar-mobile-profile-actions relative" ref={profileRef}>
                                    <motion.button
                                        whileHover={{
                                            scale: 1.05,
                                        }}
                                        whileTap={{
                                            scale: 0.96,
                                        }}
                                        transition={{
                                            duration: 0.2,
                                        }}
                                        onClick={() =>
                                            setProfileOpen(!profileOpen)
                                        }
                                        className="
                                            flex items-center gap-2
                                            hover:cursor-pointer
                                        "
                                    >
                                        <motion.img
                                            src={
                                                user.profile_photo ??
                                                DefaultProfile
                                            }
                                            alt={user.name}
                                            className="
                                                w-12 h-12
                                                rounded-full
                                                object-cover
                                                border border-white/10
                                                transition
                                            "
                                            whileHover={{
                                                boxShadow:
                                                    "0 0 0 4px rgba(153,255,51,0.15)",
                                            }}
                                        />
                                        <ChevronDown
                                            className={`
                                                chevron-display
                                                w-4 h-4 text-[#989898]
                                                transition-transform duration-300
                                                ${
                                                    profileOpen
                                                        ? 'rotate-180'
                                                        : ''
                                                }
                                            `}
                                        />
                                    </motion.button>
                                    <div className="navbar-mobile-links">
                                        <Link
                                            href="/profile"
                                            className="nav-link"
                                        >
                                            Profile
                                            <User className="w-5 h-5" />
                                        </Link>
                                        {!user.is_umkm && (
                                            <Link
                                                href="/dashboard"
                                                className="nav-link"
                                            >
                                                Dashboard
                                                <LayoutDashboard className="w-5 h-5" />
                                            </Link>
                                        )}
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                            onClick={handleLogout}
                                            className="logout"
                                        >
                                            Logout
                                            <LogOut className="w-5 h-5" />
                                        </Link>
                                    </div>
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: -10,
                                                    scale: 0.96,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -10,
                                                    scale: 0.96,
                                                }}
                                                transition={{
                                                    duration: 0.2,
                                                }}
                                                className="
                                                    navbar-dropdown-desktop
                                                    absolute right-0 mt-3
                                                    min-w-55
                                                    rounded-2xl
                                                    bg-[#1F1D2B]/95
                                                    backdrop-blur-xl
                                                    shadow-2xl
                                                    overflow-hidden
                                                    z-50
                                                    border border-white/10
                                                "
                                            >
                                                <Link
                                                    href="/profile"
                                                    className="
                                                        flex items-center gap-3
                                                        px-5 py-4
                                                        text-white
                                                        transition
                                                        hover:bg-white/5
                                                        border-b border-white/5
                                                    "
                                                >
                                                    <User className="w-5 h-5" />
                                                    <span>
                                                        Profile
                                                    </span>
                                                </Link>
                                                {!user.is_umkm && (
                                                    <Link
                                                        href="/dashboard"
                                                        className="
                                                            flex items-center gap-3
                                                            px-5 py-4
                                                            text-white
                                                            transition
                                                            hover:bg-white/5
                                                            border-b border-white/5
                                                        "
                                                    >
                                                        <LayoutDashboard className="w-5 h-5" />
                                                        <span>
                                                            Dashboard
                                                        </span>
                                                    </Link>
                                                )}
                                                <Link
                                                    href={logout()}
                                                    method="post"
                                                    as="button"
                                                    onClick={handleLogout}
                                                    className="
                                                        flex items-center gap-3
                                                        w-full
                                                        px-5 py-4
                                                        text-red-400
                                                        transition
                                                        hover:bg-red-500/10
                                                        hover:cursor-pointer
                                                    "
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    <span>
                                                        Logout
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href={login()}
                                    className="btn-primary-khaslana"
                                >
                                    Ayo Mulai
                                </Link>
                            )
                        }
                    </li>
                </ul>
            </div>
        </nav>
    );
}