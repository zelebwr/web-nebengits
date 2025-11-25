import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Toast } from "../../components";
import { apiClient } from "../../lib/apiClient";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    // Error/Success State
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

        // 1. Frontend Validation
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
            // 2. API Call
            await apiClient.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            // 3. Success Handler
            setToast({
                message: "Registration successful! Redirecting to login...",
                type: "success",
            });

            // Redirect after a short delay so user sees the success message
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-4">
                    <span className="text-4xl">🚙</span>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Join NebengIts
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    The eco-friendly ride sharing platform for ITS Students.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
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

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="primary"
                                isLoading={isLoading}
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
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
