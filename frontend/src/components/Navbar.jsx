import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
import SearchBar from './SearchBar.jsx';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    const { setShowSearchModal, getCartCount, navigate, token, setToken, setCartItems } =
        useContext(ShopContext);

    const logoutHandler = () => {
        navigate("/login");
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
    };

    return (
        <>
            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-400">
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 flex items-center justify-between py-2 font-medium">

                    {/* Logo */}
                    <Link to="/" className='flex items-center gap-4'>
                        <img src={assets.logo} alt="quick-logo" className="w-16" />
                    </Link>

                    {/* Center area: links + search (desktop only) */}
                    <div className='hidden sm:flex items-center gap-6 flex-1 justify-center'>
                            <nav className='flex items-center gap-6 text-sm'>
                            <Link to='/' className={`px-2 py-1 rounded ${location.pathname === '/' ? 'text-black font-semibold' : 'text-gray-700 hover:text-black'}`}>
                                HOME
                            </Link>

                            <Link to='/collection' className={`px-2 py-1 rounded ${location.pathname.startsWith('/collection') ? 'text-black font-semibold' : 'text-gray-700 hover:text-black'}`}>
                                COLLECTION
                            </Link>

                            {/* <NavLink to="/about" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'text-black font-semibold' : 'text-gray-700 hover:text-black'}`}>ABOUT</NavLink>
                            <NavLink to="/contact" className={({isActive}) => `px-2 py-1 rounded ${isActive ? 'text-black font-semibold' : 'text-gray-700 hover:text-black'}`}>CONTACT</NavLink> */}
                        </nav>

                        {/* Wider inline search (desktop-first) */}
                        <div className='ml-4 w-[320px] md:w-[420px]'>
                            <SearchBar inline={true} className="" />
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <img
                            src={assets.search_icon}
                            alt="Search"
                            onClick={() => setShowSearchModal(true)}
                            className="w-5 cursor-pointer sm:hidden"
                        />

                        {/* Profile */}
                        <div className="group relative">
                            <img
                                onClick={() => (token ? null : navigate("/login"))}
                                src={assets.profile_icon}
                                alt="User"
                                className="w-6 cursor-pointer"
                            />

                            {token && (
                                <div className="absolute hidden group-hover:block bg-white p-4 right-0">
                                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                                        <p className="cursor-pointer hover:text-black">My Profile</p>
                                        <p
                                            onClick={() => navigate("/orders")}
                                            className="cursor-pointer hover:text-black"
                                        >
                                            Orders
                                        </p>
                                        <p
                                            onClick={logoutHandler}
                                            className="cursor-pointer hover:text-black"
                                        >
                                            LogOut
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart (protective) */}
                        <button
                            onClick={() => token ? navigate('/cart') : navigate('/login')}
                            aria-label='Open cart'
                            className={`relative ${location.pathname === '/cart' ? 'ring-2 ring-black rounded-md' : ''}`}
                        >
                            <img src={assets.cart_icon} alt="Cart" className="w-6 min-w-6 cursor-pointer" />
                            <p className="absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[9px]">
                                {getCartCount()}
                            </p>
                        </button>

                        {/* Mobile Menu Icon */}
                        <img
                            onClick={() => setVisible(v => !v)}
                            src={assets.menu_icon}
                            alt="Menu"
                            aria-label="Open mobile menu"
                            aria-expanded={visible}
                            className="w-6 cursor-pointer sm:hidden"
                        />
                    </div>
                </div>
            
            {/* Mobile Sidebar */}
                <div
                    className={`fixed top-0 left-0 right-0 bottom-0 bg-white overflow-auto transition-transform duration-300 transform ${
                        visible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
                    } sm:hidden z-50`}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex flex-col text-gray-600">
                        <div
                            onClick={() => setVisible(false)}
                            className="flex items-center gap-5 p-3 cursor-pointer"
                        >
                            <img src={assets.dropdown_icon} className="h-4 rotate-180" />
                            <p>Back</p>
                        </div>

                        <Link onClick={() => setVisible(false)} to='/' className={`block w-full py-3 px-6 border ${location.pathname === '/' ? 'bg-gray-100 text-black' : 'text-gray-600'}`}>
                            HOME
                        </Link>
                        <Link
                            onClick={() => setVisible(false)}
                            to='/collection'
                            className={`block w-full py-3 px-6 border ${location.pathname.startsWith('/collection') ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                        >
                            COLLECTION
                        </Link>
                        <NavLink
                            onClick={() => setVisible(false)}
                            to="/about"
                            className={({isActive}) => `block w-full py-3 px-6 border ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                        >
                            ABOUT
                        </NavLink>
                        <NavLink
                            onClick={() => setVisible(false)}
                            to="/contact"
                            className={({isActive}) => `block w-full py-3 px-6 border ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                        >
                            CONTACT
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Spacer so content doesn't hide behind fixed navbar (mobile-first sizing) */}
            <div className="h-[72px] sm:h-[88px]"></div>
        </>
    );
};

export default Navbar;
