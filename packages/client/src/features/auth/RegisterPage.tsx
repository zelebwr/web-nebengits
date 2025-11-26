import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Toast } from "../../components";
import { apiClient } from "../../lib/apiClient";
import { Car } from "lucide-react";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);

        if (
            !formData.email.endsWith("@student.its.ac.id") &&
            !formData.email.endsWith("@its.ac.id")
        ) {
            setToast({
                message: "Email must be a valid ITS email (@student.its.ac.id)",
                type: "error",
            });
            return;
        }
        if (formData.password.length < 6) {
            setToast({
                message: "Password must be at least 6 characters",
                type: "error",
            });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setToast({ message: "Passwords do not match", type: "error" });
            return;
        }

        setIsLoading(true);

        try {
            await apiClient.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            setToast({
                message: "Registration successful! Redirecting...",
                type: "success",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "Registration failed. Please try again.";
            setToast({ message: errorMessage, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-eco-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
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
                        <Car className="w-12 h-12 text-eco-500" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-white">
                    Join NebengIts
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    The eco-friendly ride sharing platform for ITS Students.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="e.g. Budi Santoso"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="ITS Email"
                            type="email"
                            name="email"
                            placeholder="nrp@student.its.ac.id"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="WhatsApp Number"
                            type="tel"
                            name="phone"
                            placeholder="e.g. 08123456789"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                fullWidth
                                variant="primary"
                                isLoading={isLoading}
                                className="bg-eco-600 hover:bg-eco-500 text-white shadow-lg shadow-eco-900/20"
                            >
                                Create Account
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
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
