import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";


import Fox from "../../assets/fox.png";
import { FiSearch, FiShoppingCart, FiLogIn, FiUserPlus } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";

import { ThemeToggleButton } from "../ThemeChanger/Theme";
import Container from "../Container/Container.jsx";

const categories = ["All Categories", "Electronics", "Fashion", "Home", "Books"];

// thin vertical divider between sections
const Divider = () => (
    <span className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-slate-500/50 to-transparent" />
);

// shared glassy pill style
const pill =
    "flex items-center gap-2 rounded-full border border-slate-500/40 bg-gradient-to-b from-[#16264a] to-[#0b1630] " +
    "text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-sky-400/60 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] transition";

export default function Navbar() {
    const sideMenuRef = useRef();
    const dropdownRef = useRef();

    const [cartCount] = useState(3);
    const [catOpen, setCatOpen] = useState(false);
    const [category, setCategory] = useState(categories[0]);

    const openMenu = () => (sideMenuRef.current.style.transform = "translateX(-16rem)");
    const closeMenu = () => (sideMenuRef.current.style.transform = "translateX(16rem)");

    // close category dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setCatOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header
            className="w-full bg-gradient-to-r from-[#050b1a] via-[#0a1530] to-[#050b1a]
                       border-b border-amber-500/20 shadow-[0_4px_30px_rgba(234,179,8,0.12)]"
        >
            <Container className="flex items-center justify-between gap-4 py-3">

                {/* LOGO */}
                <a href="#" className="flex items-center gap-2 shrink-0">
                    <img src={Fox} alt="Logo" className="w-9 drop-shadow-[0_0_6px_rgba(125,211,252,0.6)]" />
                    <span className="font-serif text-lg tracking-wide text-sky-200">AL - Dhib</span>
                </a>

                <Divider />

                {/* SEARCH BAR (category + input + button) */}
                <div className="flex flex-1 max-w-3xl items-center rounded-full border border-slate-500/40
                                bg-gradient-to-b from-[#16264a] to-[#0b1630]
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">

                    {/* Category */}
                    <div ref={dropdownRef} className="relative hidden sm:block">
                        <button
                            onClick={() => setCatOpen((o) => !o)}
                            className="flex items-center gap-3 pl-4 pr-4 py-2.5 text-slate-100 text-sm"
                        >
                            <LuBoxes className="text-2xl text-cyan-400" />
                            <span className="whitespace-nowrap">{category}</span>
                            <FaChevronDown className={`text-xs transition ${catOpen ? "rotate-180" : ""}`} />
                        </button>

                        {catOpen && (
                            <ul className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-slate-600/50
                                           bg-[#0b1630] shadow-xl z-50 overflow-hidden">
                                {categories.map((c) => (
                                    <li key={c}>
                                        <button
                                            onClick={() => { setCategory(c); setCatOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#16264a]"
                                        >
                                            {c}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <span className="hidden sm:block h-7 w-px bg-slate-500/50" />

                    {/* Input */}
                    <div className="flex flex-1 items-center gap-3 px-4">
                        <FiSearch className="text-lg text-slate-200" />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full bg-transparent py-2.5 text-sm text-slate-100 placeholder-slate-400 outline-none"
                        />
                    </div>

                    {/* Search button */}
                    <button className={`${pill} m-1 px-5 py-2 text-sm`}>
                        <FiSearch className="text-sm" /> search
                    </button>
                </div>

                <Divider />

                {/* CART */}
                <button className="relative flex items-center gap-2 text-slate-100 text-sm shrink-0">
                    <span className={`${pill} p-2.5`}>
                        <FiShoppingCart className="text-lg" />
                    </span>
                    <span className="absolute -top-1 left-7 flex h-5 min-w-5 items-center justify-center rounded-full
                                     bg-gradient-to-b from-amber-300 to-amber-500 px-1 text-[11px] font-bold text-slate-900
                                     shadow-[0_0_8px_rgba(251,191,36,0.7)]">
                        {cartCount}
                    </span>
                    <span className="hidden lg:inline">Cart</span>
                </button>

                <Divider />

                {/* AUTH BUTTONS */}
                <div className="hidden md:flex items-center gap-3 shrink-0">
                    <Link to="/login" className={`${pill} px-5 py-2 text-sm`} > <FiLogIn /> Login </Link>
                    <Link to="/registration" className={`${pill} px-5 py-2 text-sm`} > <FiUserPlus className="text-base" /> Register </Link>
                </div>

                {/* THEME TOGGLE */}
                <ThemeToggleButton />

                {/* MOBILE MENU BUTTON */}
                <button className="block md:hidden" onClick={openMenu}>
                    <img src="./assets/menu-white.png" alt="menu" className="w-6" />
                </button>

                {/* MOBILE MENU */}
                <ul
                    ref={sideMenuRef}
                    className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen
                               bg-[#0a1530] text-slate-100 transition duration-500"
                >
                    <div className="absolute right-6 top-6 cursor-pointer" onClick={closeMenu}>
                        <img src="./assets/close-white.png" alt="close" className="w-5" />
                    </div>
                    <li><a href="#top" onClick={closeMenu}>Home</a></li>
                    <li> <Link to="/login" onClick={closeMenu} className="flex gap-2 items-center" > <FiLogIn /> Login </Link> </li>
                    <li className="flex gap-2 items-center"><FiUserPlus /> Register</li>
                </ul>
            </Container>
        </header>
    );
}