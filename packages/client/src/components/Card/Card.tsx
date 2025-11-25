import React, { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = "",
    onClick,
    hover = false,
}) => {
    const hoverClasses = hover
        ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        : "";

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100 overflow-hidden ${hoverClasses} ${className}`}
        >
            {children}
        </div>
    );
};
