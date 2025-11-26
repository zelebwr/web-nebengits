import React, { useEffect } from "react";
import { Check, TriangleAlert } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // Colors
    const bgColor = type === "success" ? "bg-eco-600" : "bg-red-600";
    const icon = type === "success" ? <Check /> : <TriangleAlert />;

    return (
        // z-50 ensures it is above the Navbar (which is z-30)
        // top-4 right-4 places it in the top right corner
        <div
            className={`fixed top-20 right-4 z-50 flex items-center w-full max-w-xs p-4 space-x-3 text-white ${bgColor} rounded-lg shadow-2xl transition-all duration-300 animate-fade-in-up border border-white/10`}
        >
            <div className="text-xl">{icon}</div>
            <div className="text-sm font-semibold">{message}</div>
            <button
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 bg-white/20 text-white rounded-lg p-1.5 hover:bg-white/30 inline-flex h-8 w-8 items-center justify-center"
            >
                <span className="sr-only">Close</span>
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                </svg>
            </button>
        </div>
    );
};
