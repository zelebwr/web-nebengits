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
        setTimeout(() => setIsRefreshing(false), 500); // Artificial delay for UX
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Profile
                    </h1>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                    >
                        Refresh Data
                    </Button>
                </div>

                {/* Profile Card */}
                <Card className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </h2>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role}
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                                📞 {user.phone || "No phone number added"}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Wallet Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Green Points Wallet */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full opacity-50 blur-2xl"></div>

                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Green Wallet
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-green-600">
                                {user.greenPoints}
                            </span>
                            <span className="text-green-600 font-medium">
                                GP
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Earn points by driving or taking eco-friendly rides.
                        </p>
                        <div className="mt-4 pt-4 border-t border-green-50">
                            <button className="text-sm text-green-700 font-medium hover:underline">
                                Redeem Rewards &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Stats Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Your Impact
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    CO2 Saved (Est.)
                                </span>
                                <span className="font-medium text-gray-900">
                                    {(user.greenPoints * 0.5).toFixed(1)} kg
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Rides Taken
                                </span>
                                <span className="font-medium text-gray-900">
                                    --
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Rides Given
                                </span>
                                <span className="font-medium text-gray-900">
                                    --
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
