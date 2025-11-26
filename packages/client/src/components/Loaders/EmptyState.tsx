import React from "react";
import { Button } from "../Button/Button";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    actionLabel,
    onAction,
    icon,
}) => {
    return (
        <div className="text-center py-16 px-4">
            <div className="flex justify-center mb-6">
                {icon ? (
                    <div className="text-6xl">{icon}</div>
                ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                        📭
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">{description}</p>

            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
