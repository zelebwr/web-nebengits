import React from "react";
import { Link } from "react-router-dom";
import { type ApiRide } from "@web-nebengits/shared";
import { Button } from "../../../components";
import { MapPin, Calendar } from "lucide-react"; // Import Icons

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
            <div className="flex flex-col h-full overflow-hidden border border-eco-500/30 shadow-lg hover:shadow-eco-500/20 transition-all duration-300 transform group-hover:-translate-y-1 bg-eco-950/60 backdrop-blur-md rounded-2xl ring-1 ring-white/5">
                <Link
                    to={`/rides/${ride.id}`}
                    className="flex-grow flex flex-col"
                >
                    <div className="h-48 bg-slate-800 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-eco-950 via-transparent to-transparent z-10 opacity-90" />

                        <img
                            src={ride.vehiclePhotoUrl}
                            alt="Vehicle"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "https://placehold.co/600x400?text=No+Image";
                            }}
                        />

                        <div className="absolute top-3 right-3 z-20">
                            <div
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 border border-white/10 ${
                                    ride.seatsAvailable > 0
                                        ? "bg-eco-900/80 text-eco-100"
                                        : "bg-red-900/80 text-red-200"
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        ride.seatsAvailable > 0
                                            ? "bg-eco-400 animate-pulse"
                                            : "bg-red-400"
                                    }`}
                                ></span>
                                {ride.seatsAvailable > 0
                                    ? `${ride.seatsAvailable} Seats`
                                    : "Full"}
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-3 z-20">
                            <div className="bg-eco-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg border border-white/10">
                                {formatPrice(ride.cost)}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                        <div className="mb-4">
                            <h3
                                className="text-lg font-bold text-white leading-tight group-hover:text-eco-400 transition-colors line-clamp-1"
                                title={ride.destination}
                            >
                                {ride.destination}
                            </h3>

                            <div className="flex items-start gap-2 mt-3 text-sm text-slate-300 bg-eco-900/30 p-3 rounded-xl border border-eco-500/20">
                                <MapPin className="w-4 h-4 text-eco-400 mt-0.5" />
                                <div className="flex-1">
                                    <span className="text-xs text-eco-400 font-bold uppercase tracking-wider">
                                        Pickup Point
                                    </span>
                                    <p
                                        className="text-slate-100 font-medium truncate mt-0.5"
                                        title={ride.pickupPoint}
                                    >
                                        {ride.pickupPoint}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-eco-500/20">
                            <div className="w-10 h-10 bg-eco-900/50 rounded-full flex items-center justify-center text-eco-400 font-bold text-sm ring-1 ring-eco-500/30 shadow-sm">
                                {ride.driver.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-200 text-sm truncate">
                                    {ride.driver.name}
                                </p>
                                <p className="text-slate-400 text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    {formattedTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="px-5 pb-5 pt-2">
                    <Button
                        variant={buttonVariant}
                        fullWidth
                        className={`rounded-xl py-3 font-bold text-sm shadow-lg transition-all duration-200 border ${
                            !isDisabled
                                ? "bg-eco-600 hover:bg-eco-500 text-white border-transparent hover:shadow-eco-500/20 active:scale-[0.98]"
                                : "bg-slate-800 text-slate-500 border-white/5 cursor-not-allowed"
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
            </div>
        </div>
    );
};
