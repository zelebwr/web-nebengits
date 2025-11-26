import React from "react";
import { Link } from "react-router-dom";
import { type ApiRide } from "@web-nebengits/shared";
import { Card, Button } from "../../../components";

interface RideCardProps {
    ride: ApiRide;
    onBook: (rideId: string) => void;
    isBooking?: boolean;
    currentUserId?: string;
}

export const RideCard: React.FC<RideCardProps> = ({
    ride,
    onBook,
    isBooking,
    currentUserId,
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

    // DEBUGGING: Log values to console
    console.log("RideCard Debug:", {
        rideId: ride.id,
        currentUserId: currentUserId,
        driverId: ride.driverId,
        passengerIds: ride.passengerIds,
        isOwnerCheck: String(currentUserId) === String(ride.driverId),
        isBookedCheck: ride.passengerIds?.some(
            (id) => String(id) === String(currentUserId)
        ),
    });

    // Robust Logic to check status
    const isOwner = String(currentUserId) === String(ride.driverId);

    const isAlreadyBooked =
        !!currentUserId &&
        Array.isArray(ride.passengerIds) &&
        ride.passengerIds.some((id) => String(id) === String(currentUserId));

    const isFull = ride.seatsAvailable === 0;

    let buttonText = "Book Seat";
    let isDisabled = isBooking || isFull;
    let buttonVariant: "primary" | "secondary" | "danger" | "outline" =
        "primary";

    if (isOwner) {
        buttonText = "Your Ride";
        isDisabled = true;
        buttonVariant = "secondary";
    } else if (isAlreadyBooked) {
        buttonText = "Booked";
        isDisabled = true;
        buttonVariant = "secondary";
    } else if (isFull) {
        buttonText = "Full";
        buttonVariant = "secondary";
    }

    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <Link
                to={`/rides/${ride.id}`}
                className="flex-grow flex flex-col group"
            >
                {/* Image Section */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                        src={ride.vehiclePhotoUrl}
                        alt="Vehicle"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                            <p className="text-gray-500 text-xs">
                                {formattedTime}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="p-4 pt-0 mt-auto">
                <Button
                    variant={buttonVariant}
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) onBook(ride.id);
                    }}
                    disabled={isDisabled}
                    isLoading={isBooking}
                >
                    {buttonText}
                </Button>
            </div>
        </Card>
    );
};
