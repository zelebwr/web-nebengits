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
        // Dark Navbar: slate-900 with transparency
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 fixed w-full z-30 top-0 left-0 border-t-4 border-t-primary-600 shadow-lg transition-all">
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
                                <span className="font-extrabold text-xl text-white tracking-tight leading-none mb-1">
                                    Nebeng
                                    <span className="text-primary-400">
                                        Its
                                    </span>
                                </span>
                                <span className="text-[0.65rem] font-semibold text-eco-400 uppercase tracking-wider leading-none">
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
                                    className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white focus:outline-none group transition-colors"
                                >
                                    <div className="w-9 h-9 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center text-primary-400 font-bold shadow-sm group-hover:border-primary-500 transition-all">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </div>
                                    <span className="hidden sm:block font-semibold">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform ${
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

                                {/* Dropdown Menu - Dark Mode */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl py-2 ring-1 ring-white/10 focus:outline-none animate-fade-in-up z-50 border border-white/10">
                                        <div className="px-4 py-3 border-b border-white/10 bg-slate-800/50">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                                                Signed in as
                                            </p>
                                            <p className="text-sm font-medium text-white truncate mt-0.5">
                                                {user.email}
                                            </p>

                                            {/* Green Points Display */}
                                            <div className="mt-3 flex items-center justify-between bg-slate-900/50 border border-eco-900/30 px-3 py-1.5 rounded-lg shadow-inner">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-lg">
                                                        🌱
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        Wallet
                                                    </span>
                                                </div>
                                                <span className="text-sm font-extrabold text-eco-400">
                                                    {user.greenPoints || 0} GP
                                                </span>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">👤</span>{" "}
                                                Your Profile
                                            </Link>
                                            <Link
                                                to="/my-rides"
                                                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">🚘</span>{" "}
                                                My Posted Rides
                                            </Link>
                                            <Link
                                                to="/my-bookings"
                                                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            >
                                                <span className="mr-2">🎟️</span>{" "}
                                                My Booked Rides
                                            </Link>
                                        </div>

                                        <div className="border-t border-white/10 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors font-medium"
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
                                        className="bg-transparent text-white border-white/30 hover:bg-white/10"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="bg-primary-600 hover:bg-primary-500 border-none text-white shadow-lg shadow-primary-900/50"
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
