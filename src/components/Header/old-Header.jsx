import { useRef, useState, useEffect } from 'react'
import Fox from "../../assets/fox.png";
import { FaSignInAlt, FaSearch, FaHouseUser } from "react-icons/fa";

import { TbShoppingBagHeart, TbShoppingBagX } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { VscTriangleDown } from "react-icons/vsc";


import { ThemeToggleButton } from "../ThemeChanger/Theme"
import Container from "../Container/Container.jsx";
import Cart from "../Cart/Cart.jsx";

export default function Navbar() {
    const sideMenuRef = useRef();
    const dropdownRef = useRef();

    // ✅ Cart count state
    const [cartCount, setCartCount] = useState(69);

    // ✅ Dropdown state
    const [authOpen, setAuthOpen] = useState(false);

    const openMenu = () => {
        sideMenuRef.current.style.transform = 'translateX(-16rem)';
    }

    const closeMenu = () => {
        sideMenuRef.current.style.transform = 'translateX(16rem)';
    }

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setAuthOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="w-full bg-[#F5F5F5] dark:bg-[#37474F] shadow-sm">
                <Container className="flex items-center justify-between py-2">

                    {/* LOGO */}
                    <a href="#" className="flex items-center gap-2 mr-14">
                        <img src={Fox} alt="Logo" className="w-7" />
                        <span className="text-md font-semibold tracking-wide text-gray-800 dark:text-gray-100">
                            AL-Dhib
                        </span>
                    </a>

                    {/* THEME BUTTON */}
                    <ThemeToggleButton />

                    {/* SEARCH */}
                    <div className="flex items-center w-full lg:w-1/3 mx-auto">
                        {/* Category Dropdown */}
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-300 dark:bg-gray-300 text-sm rounded-l-full hover:bg-gray-400 dark:hover:bg-[#a8c7fa] transition">
                             All <VscTriangleDown />
                        </button>

                        {/* Search Input */}
                        <input type="text" placeholder="Search here..." className="flex-1 px-3 py-1.5 bg-[#E0E0E0] dark:bg-gray-200 text-black dark:text-gray-900 outline-none text-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600" />

                        {/* Search Button */}
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-300 dark:bg-gray-300 text-sm rounded-r-full hover:bg-gray-400 dark:hover:bg-[#a8c7fa] transition">
                            <FaSearch /> Search
                        </button>
                    </div>


                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-4">

                        {/* CART */}
                       <Cart count={cartCount} onClick={() => console.log("Go to cart")} />

                        {/* ORDER / RETURN */}
                        <div className="inline-flex border dark:border-white rounded-full overflow-hidden text-sm">
                            <button className="flex items-center gap-1 px-3 py-1 font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                                <TbShoppingBagHeart /> Order
                            </button>

                            <button className="flex items-center gap-1 px-3 py-1 font-medium bg-gray-700 text-white hover:bg-red-200 hover:text-black transition">
                                <TbShoppingBagX /> Return
                            </button>
                        </div>

                        {/* account Dropdown */}
                        <div className="relative hidden lg:block group">

                            {/* Trigger */}
                            <button className="flex items-center gap-1 px-3 py-1 text-black dark:text-white border border-black rounded-full hover:bg-gray-100 dark:border-white dark:hover:bg-gray-700 text-sm"> <FaHouseUser /> Account
                            </button>

                            {/* Dropdown */}
                            <div className="absolute right-0 mt-2 w-auto bg-white dark:bg-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200" >
                                <button className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 "> <LuNotebookPen /> Sign up </button>

                                {/* Divider */}
                                <div className="h-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                                <button className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 "> <FaSignInAlt /> Log in </button>
                            </div>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button className="block md:hidden ml-3" onClick={openMenu}>
                            <img src="./assets/menu-black.png" alt="" className="w-6 dark:hidden" />
                            <img src="./assets/menu-white.png" alt="" className="w-6 hidden dark:block" />
                        </button>
                    </div>

                    {/* MOBILE MENU */}
                    <ul ref={sideMenuRef} className="flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-rose-50 transition duration-500 font-Ovo dark:bg-darkHover dark:text-white" >
                        <div className="absolute right-6 top-6" onClick={closeMenu}>
                            <img src="./assets/close-black.png" alt="" className="w-5 cursor-pointer dark:hidden" />
                            <img src="./assets/close-white.png" alt="" className="w-5 cursor-pointer hidden dark:block" />
                        </div>

                        <li><a href="#top" onClick={closeMenu}>Home</a></li>
                        <li><a href="#about" onClick={closeMenu}>About</a></li>
                        <li><a href="#services" onClick={closeMenu}>Services</a></li>
                        <li><a href="#work" onClick={closeMenu}>Work</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                    </ul>

                </Container>
            </header>
        </>
    )
}