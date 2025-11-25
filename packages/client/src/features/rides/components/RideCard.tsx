import React from "react";
import { type ApiRide } from "@web-nebengits/shared";
import { Card, Button } from "../../../components";

interface RideCardProps {
    ride: ApiRide;
    onBook: (rideId: string) => void;
    isBooking?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({
    ride,
    onBook,
    isBooking,
}) => {
    const formattedTime = new Date(ride.departureTime).toLocaleString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Image Section */}
            <div className="h-48 bg-gray-200 relative">
                <img
                    src={ride.vehiclePhotoUrl}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400?text=No+Image";
                    }}
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow">
                    {ride.seatsAvailable} seats left
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {ride.destination}
                        </h3>
                        <p className="text-sm text-gray-500">
                            From: {ride.pickupPoint}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">
                            {formatPrice(ride.cost)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {ride.driver.name.charAt(0)}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">
                            {ride.driver.name}
                        </p>
                        <p className="text-gray-500 text-xs">{formattedTime}</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => onBook(ride.id)}
                        disabled={isBooking || ride.seatsAvailable === 0}
                        isLoading={isBooking}
                    >
                        {ride.seatsAvailable === 0 ? "Full" : "Book Seat"}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
