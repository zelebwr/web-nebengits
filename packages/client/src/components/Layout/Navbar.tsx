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

    // Close dropdown when clicking outside
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
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center gap-2"
                        >
                            <span className="text-2xl">🚙</span>
                            <span className="font-bold text-xl text-indigo-600 tracking-tight">
                                NebengIts
                            </span>
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen(!isDropdownOpen)
                                    }
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        {user.name?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </div>
                                    <span className="hidden sm:block">
                                        {user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
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
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Signed in as
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.email}
                                            </p>
                                            {/* Green Points Display */}
                                            <div className="mt-2 flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold w-fit">
                                                <span>🌱</span>
                                                <span>
                                                    {user.greenPoints || 0} GP
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/my-rides"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            My Posted Rides
                                        </Link>
                                        <Link
                                            to="/my-bookings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                        >
                                            My Booked Rides
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login">
                                    <Button variant="secondary" size="sm">
                                        Log in
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">
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
