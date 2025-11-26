import React, { useEffect } from "react";
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

    // Logic to check status
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
        buttonText = "Booked ✅";
        isDisabled = true;
        buttonVariant = "secondary";
    } else if (isFull) {
        buttonText = "Full 🚫";
        buttonVariant = "secondary";
    }

    return (
        <div className="group h-full">
            <Card className="flex flex-col h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white rounded-2xl">
                <Link
                    to={`/rides/${ride.id}`}
                    className="flex-grow flex flex-col"
                >
                    {/* Image Section with Overlay Gradient */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                        <img
                            src={ride.vehiclePhotoUrl}
                            alt="Vehicle"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "https://placehold.co/600x400?text=No+Image";
                            }}
                        />

                        {/* Floating Badges */}
                        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
                                    ride.seatsAvailable > 0
                                        ? "bg-white/90 text-indigo-600"
                                        : "bg-red-500/90 text-white"
                                }`}
                            >
                                {ride.seatsAvailable > 0
                                    ? `${ride.seatsAvailable} Seats`
                                    : "Full"}
                            </div>
                        </div>

                        {/* Price on Image (More prominent) */}
                        <div className="absolute bottom-3 left-3 z-20">
                            <span className="bg-indigo-600/90 backdrop-blur text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
                                {formatPrice(ride.cost)}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3
                                    className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1"
                                    title={ride.destination}
                                >
                                    {ride.destination}
                                </h3>
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                    <span className="text-indigo-400">📍</span>
                                    <span
                                        className="truncate max-w-[150px]"
                                        title={ride.pickupPoint}
                                    >
                                        {ride.pickupPoint}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {ride.driver.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                    {ride.driver.name}
                                </p>
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                    🗓 {formattedTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="px-5 pb-5 mt-auto">
                    <Button
                        variant={buttonVariant}
                        fullWidth
                        className={`rounded-xl py-2.5 font-semibold transition-all active:scale-95 ${
                            !isDisabled
                                ? "shadow-md hover:shadow-lg"
                                : "opacity-70 cursor-not-allowed"
                        }`}
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
        </div>
    );
};
