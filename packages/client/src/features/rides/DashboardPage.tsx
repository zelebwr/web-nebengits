import React from "react";
import { Link } from "react-router-dom";
import { MainLayout, Button } from "../../components";
import { RideList } from "./components/RideList";
import { useAuth } from "../auth/hooks/useAuth";

export const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <MainLayout>
            {/* DARK MODE Background Blobs 
                - Changed mix-blend-multiply to mix-blend-screen/normal for dark mode visibility
                - Using brighter colors to glow against dark bg
            */}
            <div
                className="fixed inset-0 overflow-hidden pointer-events-none"
                style={{ zIndex: 0 }}
            >
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-primary-600 rounded-full filter blur-[120px] opacity-20 animate-blob"></div>
                <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-eco-600 rounded-full filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[800px] h-[800px] bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-900 via-slate-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 mb-12 text-white border border-white/10 z-10">
                {/* Dot Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                ></div>

                <div className="relative px-8 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-2xl z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-medium text-eco-300">
                            <span className="w-2 h-2 rounded-full bg-eco-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                            ITS Green Campus Initiative
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
                            Hi, {user?.name?.split(" ")[0] || "Student"}! 👋
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-eco-300">
                                Let's ride together.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-lg font-medium leading-relaxed opacity-90">
                            Save money, cut emissions, and connect with the ITS
                            community.
                        </p>

                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link to="/rides/create">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="bg-eco-400 text-slate-900 hover:bg-eco-300 shadow-lg shadow-white/5 border-none font-bold px-8 py-4 h-auto transform hover:-translate-y-1 transition-all"
                                >
                                    Offer a Ride 🚗
                                </Button>
                            </Link>
                            <a
                                href="#available-rides"
                                className="inline-flex items-center justify-center px-8 py-4 border border-white/20 rounded-xl text-base font-bold text-white hover:bg-white/5 transition-all backdrop-blur-sm"
                            >
                                Find a Ride
                            </a>
                        </div>
                    </div>

                    {/* 3D Illustration Area */}
                    <div className="hidden md:block relative z-10">
                        <div className="relative w-80 h-80">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border-t border-l border-white/20 rotate-6 hover:rotate-0 transition-all duration-700 group">
                                <div className="text-[8rem] drop-shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-500">
                                    🚙
                                </div>

                                {/* Floating Eco Badge */}
                                <div className="absolute -bottom-8 -left-8 bg-slate-800/90 backdrop-blur border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow z-20">
                                    <div className="bg-eco-900/50 p-3 rounded-full text-2xl text-eco-400">
                                        🌿
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            Total Impact
                                        </p>
                                        <p className="text-base font-black text-white">
                                            -12kg CO2
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div id="available-rides" className="space-y-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-end pb-2">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                            Available Rides
                            <span className="px-2.5 py-0.5 rounded-full bg-primary-900/50 border border-primary-700 text-primary-300 text-sm font-bold align-middle">
                                New
                            </span>
                        </h2>
                        <p className="text-slate-400 mt-2 text-base">
                            Latest trips posted by ITS students around you.
                        </p>
                    </div>
                </div>

                <RideList />
            </div>
        </MainLayout>
    );
};
