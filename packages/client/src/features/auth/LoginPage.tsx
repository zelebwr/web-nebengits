import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Toast } from "../../components";
import { useAuth } from "./hooks/useAuth";
import { Car } from "lucide-react";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);

        try {
            await login({ email, password });
            // Login successful, navigation handled by useAuth or here
            navigate("/");
        } catch (err: any) {
            setToast({
                message:
                    err.response?.data?.message || "Invalid email or password",
                type: "error",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-eco-600/20 rounded-full blur-[100px]"></div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
                        <Car className="w-12 h-12 text-primary-500" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Sign in to your NebengIts account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="primary"
                                isLoading={isLoading}
                                className="shadow-lg shadow-primary-500/20"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-800 text-slate-400 rounded">
                                    New here?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/register"
                                className="font-medium text-eco-400 hover:text-eco-300 transition-colors"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
