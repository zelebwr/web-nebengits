import React from "react";
import { Link } from "react-router-dom";
import { MainLayout, Button } from "../../components";
import { RideList } from "./components/RideList";
import { useAuth } from "../auth/hooks/useAuth";

export const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <MainLayout>
            {/* Background decorative blobs - Added for visual interest */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-20 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-0 w-72 h-72 bg-eco-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section - Using brand colors explicitly */}
            <div className="relative bg-gradient-to-br from-primary-800 via-primary-600 to-eco-600 rounded-3xl overflow-hidden shadow-xl shadow-primary-900/20 mb-10 text-white border border-white/10 z-10">
                {/* Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(#fff 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                ></div>

                <div className="relative px-8 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-5 max-w-2xl z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-eco-200">
                            <span className="w-2 h-2 rounded-full bg-eco-400 animate-pulse"></span>
                            ITS Green Campus Initiative
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Hi, {user?.name?.split(" ")[0] || "Student"}! 👋
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
                                Let's ride together.
                            </span>
                        </h1>
                        <p className="text-lg text-primary-100 max-w-lg font-light leading-relaxed">
                            Save money, cut emissions, and connect with the ITS
                            community. Every shared ride counts towards a
                            greener future.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link to="/rides/create">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl border-none font-bold px-8"
                                >
                                    Offer a Ride 🚗
                                </Button>
                            </Link>
                            <a
                                href="#available-rides"
                                className="inline-flex items-center justify-center px-6 py-3 border border-white/30 rounded-xl text-base font-medium text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Find a Ride
                            </a>
                        </div>
                    </div>

                    {/* Decorative Illustration */}
                    <div className="hidden md:block relative z-10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-72 h-72 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/20 relative group">
                            <div className="text-9xl drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                🚙
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                                <div className="bg-eco-100 p-2 rounded-full text-xl">
                                    🌿
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">
                                        Total Impact
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                        -12kg CO2
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div id="available-rides" className="space-y-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-end border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Available Rides
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Latest trips posted by ITS students around you.
                        </p>
                    </div>
                </div>

                <RideList />
            </div>
        </MainLayout>
    );
};
