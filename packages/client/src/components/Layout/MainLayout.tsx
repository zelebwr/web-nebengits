import React, { type ReactNode } from "react";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        // 1. Removed 'bg-gray-50' -> Now transparent so body gradient shows!
        // 2. Added 'relative' and 'overflow-x-hidden' for safety
        <div className="min-h-screen flex flex-col relative overflow-x-hidden mt-16">
            <Navbar />

            {/* Added 'relative z-10'. 
               This lifts the text/cards ABOVE the background blobs we added in Dashboard.
            */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {children}
            </main>

            <footer className="bg-white/80 backdrop-blur-md border-t border-primary-100 mt-auto relative z-10">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; 2025 NebengIts. Built for Vibe Coding.
                    </p>
                </div>
            </footer>
        </div>
    );
};
