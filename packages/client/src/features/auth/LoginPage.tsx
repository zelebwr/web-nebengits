import React, { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Button, Input } from "../../components";

export const LoginPage = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login({ email, password });
            // On success, the AuthProvider updates the user state,
            // and the PublicRoute wrapper automatically redirects to "/"
        } catch (err: any) {
            // Handle errors from the backend (e.g., "Invalid credentials")
            const message =
                err.response?.data?.message ||
                "Login failed. Please try again.";
            setError(message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* App Logo or Title */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to NebengIts
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <Link
                        to="/register"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <Input
                            label="Email address"
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="budi@student.its.ac.id"
                        />

                        {/* Password Field */}
                        <Input
                            label="Password"
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {error}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading}
                                variant="primary"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    {/* Demo Credentials Helper */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Demo Accounts
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("budi@student.its.ac.id");
                                    setPassword("123456");
                                }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Driver (Budi)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("siti@student.its.ac.id");
                                    setPassword("123456");
                                }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                Passenger (Siti)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
