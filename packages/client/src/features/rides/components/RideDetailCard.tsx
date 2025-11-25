import React from "react";
import { type ApiRide } from "@web-nebengits/shared";
import { Card, Button } from "../../../components";

interface RideDetailCardProps {
    ride: ApiRide;
    onBook: () => void;
    isBooking: boolean;
    isOwner: boolean;
}

export const RideDetailCard: React.FC<RideDetailCardProps> = ({
    ride,
    onBook,
    isBooking,
    isOwner,
}) => {
    const formattedTime = new Date(ride.departureTime).toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
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
        <Card className="overflow-hidden">
            <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 relative">
                    <img
                        src={ride.vehiclePhotoUrl}
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://placehold.co/600x400?text=No+Image";
                        }}
                    />
                </div>

                {/* Content Section */}
                <div className="p-6 md:w-1/2 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {ride.destination}
                            </h1>
                            <p className="text-gray-600">
                                From: {ride.pickupPoint}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">
                                {formatPrice(ride.cost)}
                            </p>
                            <p className="text-sm text-gray-500">per seat</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Ride Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Departure
                                </p>
                                <p className="font-medium">{formattedTime}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Seats Available
                                </p>
                                <p className="font-medium">
                                    {ride.seatsAvailable}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Driver
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {ride.driver.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {ride.driver.name}
                                </p>
                                <p className="text-sm text-green-600 font-medium">
                                    {ride.driver.greenPoints} Green Points
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        {isOwner ? (
                            <div className="text-center p-3 bg-gray-50 rounded-lg text-gray-600 italic">
                                You are the driver of this ride.
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                onClick={onBook}
                                disabled={
                                    isBooking || ride.seatsAvailable === 0
                                }
                                isLoading={isBooking}
                            >
                                {ride.seatsAvailable === 0
                                    ? "Full"
                                    : "Book Seat Now"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
