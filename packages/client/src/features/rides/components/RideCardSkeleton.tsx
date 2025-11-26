import React from "react";
import { Card } from "../../../components";

export const RideCardSkeleton = () => {
    return (
        <Card className="flex flex-col h-full overflow-hidden border-gray-100">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse relative">
                <div className="absolute top-2 right-2 w-20 h-6 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow space-y-4">
                {/* Title & Price */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-2/3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="space-y-1 w-1/4 flex flex-col items-end">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-1 w-1/2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                </div>

                {/* Button */}
                <div className="mt-auto pt-2">
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
            </div>
        </Card>
    );
};
