import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { useAuth } from "../../features/auth/hooks/useAuth";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-primary-100 fixed w-full z-30 top-0 left-0 border-t-4 border-t-primary-600 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center gap-2 group"
                        >
                            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">
                                🚙
                            </span>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl text-primary-700 tracking-tight leading-none mb-1">
                                    Nebeng
                                    <span className="text-primary-500">
                                        Its
                                    </span>
                                </span>
                                <span className="text-[0.65rem] font-semibold text-eco-600 uppercase tracking-wider leading-none">
                                    Green Campus
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-700 focus:outline-none group transition-colors"
                                >
                                    <div className="w-9 h-9 bg-primary-50 border-2 border-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shadow-sm group-hover:border-primary-300 transition-all">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </div>
                                    <span className="hidden sm:block font-semibold">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-transform ${
                                            isDropdownOpen ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                                                Signed in as
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
                                                {user.email}
                                            </p>

                                            {/* Green Points Display */}
                                            <div className="mt-3 flex items-center justify-between bg-white border border-eco-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-lg">
                                                        🌱
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-600">
                                                        Wallet
                                                    </span>
                                                </div>
                                                <span className="text-sm font-extrabold text-eco-600">
                                                    {user.greenPoints || 0} GP
                                                </span>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">👤</span>{" "}
                                                Your Profile
                                            </Link>
                                            <Link
                                                to="/my-rides"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">🚘</span>{" "}
                                                My Posted Rides
                                            </Link>
                                            <Link
                                                to="/my-bookings"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">🎟️</span>{" "}
                                                My Booked Rides
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                        >
                                            <span className="mr-2">🚪</span>{" "}
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="text-primary-700 hover:bg-primary-50 border-primary-200"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/30"
                                    >
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
