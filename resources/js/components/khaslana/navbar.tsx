import { Link, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    ShoppingCart,
    Store,
} from "lucide-react";
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
    cart,
    logout,
} from "@/routes";
import { profile } from "@/routes";
import { myPosts } from "@/routes/community";
import { tracking } from "@/routes/umkm";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user } = useAuth();
    const { url } = usePage();
    const menus = user
        ? [
            { id: 1, name: "Beranda", href: home().url },
            { id: 2, name: "UMKM", href: umkm().url },
            { id: 3, name: "Katalog", href: catalog().url },
            { id: 4, name: "Komunitas", href: community().url },
            { id: 5, name: "Stay Point", href: tracking().url },
            // ...(user.is_umkm
            //     ? [{ id: 5, name: "Kelola Toko", href: dashboard().url }]
            //     : []),
        ]
        : [
            { id: 1, name: "UMKM", href: umkm().url },
            { id: 2, name: "Katalog", href: catalog().url },
            { id: 3, name: "Komunitas", href: community().url },
            { id: 4, name: "Tentang Kami", href: about().url },
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
                                <div className="flex flex-col-reverse min-[970px]:flex-row items-end min-[970px]:items-center justify-center gap-4 md:gap-8">
                                    <div className="hidden cursor-pointer min-[970px]:block">
                                        <Link href={cart()}>
                                            <ShoppingCart className="h-6 w-6 hover:text-[#99FF33] transition-colors duration-200 hidden min-[970px]:block" />
                                        </Link>
                                    </div>
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
                                                href={cart()}
                                                className="nav-link hidden min-[970px]:block"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={profile()}
                                                className="nav-link"
                                            >
                                                Profile
                                                <User className="w-5 h-5" />
                                            </Link>
                                            {user.is_umkm === true && (
                                                <Link
                                                    href={dashboard()}
                                                    className="nav-link"
                                                >
                                                    Kelola Toko
                                                    <Store className="w-5 h-5" />
                                                </Link>
                                            )}
                                            <Link
                                                href={myPosts()}
                                                className="nav-link"
                                            >
                                                Postingan
                                                <LayoutDashboard className="w-5 h-5" />
                                            </Link>
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
                                                        href={profile()}
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

                                                    {user.is_umkm == 1 && (
                                                        <Link
                                                            href={dashboard()}
                                                            className="
                                                                flex items-center gap-3
                                                                px-5 py-4
                                                                text-white
                                                                transition
                                                                hover:bg-white/5
                                                                border-b border-white/5
                                                            "
                                                        >
                                                            <Store className="w-5 h-5" />
                                                            <span>
                                                                Kelola Toko
                                                            </span>
                                                        </Link>
                                                    )}

                                                    <Link
                                                        href={myPosts()}
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
                                                            Postingan
                                                        </span>
                                                    </Link>
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