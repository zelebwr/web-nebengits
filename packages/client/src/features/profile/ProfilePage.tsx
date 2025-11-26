import React, { useState } from "react";
import { MainLayout, Card, Button } from "../../components";
import { useAuth } from "../auth/hooks/useAuth";

export const ProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!user) return null;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshUser();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header with Refresh */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            My Profile
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage your account and green points.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        ↻ Sync Data
                    </Button>
                </div>

                {/* Main Profile Card - Glassmorphism feel */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Banner Background */}
                    <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            {/* Avatar with Ring */}
                            <div className="relative">
                                <div className="w-32 h-32 bg-white p-1.5 rounded-full shadow-lg">
                                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-indigo-600 text-5xl font-bold overflow-hidden">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div
                                    className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full"
                                    title="Online"
                                ></div>
                            </div>

                            {/* Role Badge */}
                            <div className="mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-wider shadow-sm">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Personal Info */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {user.name}
                                    </h2>
                                    <p className="text-gray-500 font-medium">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Contact Details
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <span className="bg-white p-2 rounded-lg shadow-sm">
                                            📞
                                        </span>
                                        <span className="font-medium">
                                            {user.phone ||
                                                "No phone number added"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats / Wallet Column */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm">
                                    <h3 className="text-green-800 font-semibold mb-1">
                                        Green Wallet
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-black text-green-600">
                                            {user.greenPoints}
                                        </span>
                                        <span className="text-sm font-bold text-green-600">
                                            GP
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-700 leading-relaxed opacity-80">
                                        Points earned from eco-friendly trips.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-gray-800 font-semibold mb-4">
                                        Achievements
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">
                                                Impact
                                            </span>
                                            <span className="font-bold text-indigo-600">
                                                {(
                                                    user.greenPoints * 0.5
                                                ).toFixed(1)}{" "}
                                                kg CO2
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-500 h-2 rounded-full"
                                                style={{ width: "45%" }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 text-right">
                                            Next Level: 500 GP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
