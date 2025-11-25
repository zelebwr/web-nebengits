import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Button } from "../Button/Button";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <span className="text-xl font-bold text-indigo-600">
                                NebengIts
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                    <span className="mx-2 text-gray-300">
                                        |
                                    </span>
                                    <span className="text-green-600 font-bold">
                                        {user.greenPoints} pts
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" size="sm">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
