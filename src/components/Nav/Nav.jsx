import React, { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from './freshcart-logo.svg';
import { CounterContext } from "../Context/CounterContext";
import { UserContext } from "../Context/UserContext";
import { CartContext } from "../Context/CartContext";
import { WishContext } from "../Context/WishListContext";

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full focus:outline-none transition-colors duration-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default function Navbar() {
  const { wishCount } = useContext(WishContext);
  const { Counter } = useContext(CounterContext);
  const { UserLogin, setUserLogin } = useContext(UserContext);
  const { NumOfCartItem } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      localStorage.setItem('darkMode', prefersDark);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.removeItem("usreToken");
    setUserLogin(null);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
    }`;

  return (
    <nav className="fixed w-full z-50 bg-white shadow-sm dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={logo} alt="FreshCart" />
             
            </NavLink>
            
            {/* Desktop Navigation */}
            {UserLogin && (
              <div className="hidden  md:ml-6 md:flex  md:space-x-4">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="products" className={navLinkClass}>
                  Products
                </NavLink>
                <NavLink to="categories" className={navLinkClass}>
                  Categories
                </NavLink>
                <NavLink to="brands" className={navLinkClass}>
                  Brands
                </NavLink>
              </div>
            )}
          </div>

          {/* Right side items */}
          <div className="flex items-center">
            {/* Cart and Wishlist */}
            {UserLogin && (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink 
                  to="cart" 
                  className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {NumOfCartItem > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {NumOfCartItem}
                    </span>
                  )}
                </NavLink>

                <NavLink 
                  to="wishlist" 
                  className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {wishCount}
                    </span>
                  )}
                </NavLink>
              </div>
            )}

            {/* Dark mode toggle */}
            <div className="ml-2">
              <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </div>

            {/* Auth buttons */}
            <div className="hidden lg:ml-4 lg:flex lg:items-center">
              {UserLogin ? (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              ) : (
                <div className="flex space-x-2">
                  <NavLink
                    to="register"
                    className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus::text-white dark:text-green-100 dark:bg-green-700/30 dark:hover:bg-green-800/40 "
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="login"
                    className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:text-green-100 dark:bg-green-700/30 dark:hover:bg-green-800/40"
                  >
                    Login
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex md:flex-col items-center ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-800 shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4 flex flex-col">
            {UserLogin ? (
              <>
                <NavLink
                  to="/"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </NavLink>
                <NavLink
                  to="/categories"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/brands"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Brands
                </NavLink>
                <NavLink
                  to="/cart"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Cart ({NumOfCartItem})
                </NavLink>
                <NavLink
                  to="wishlist"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Wishlist ({wishCount})
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
          {UserLogin && (
            <div className="pt-2 pb-3 border-t border-neutral-200 dark:border-neutral-700 px-4">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}