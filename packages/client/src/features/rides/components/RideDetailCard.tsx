import React, { useState } from "react";
import { Card, Button, Input, Toast } from "../../../components";
import { type ApiRide } from "@web-nebengits/shared";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { useAuth } from "../../auth/hooks/useAuth";

interface RideDetailCardProps {
    ride: ApiRide;
    onBook: () => void;
    isBooking?: boolean;
    isOwner?: boolean;
    currentUserId?: string;
}

export const RideDetailCard: React.FC<RideDetailCardProps> = ({
    ride,
    onBook,
    isBooking,
    isOwner,
    currentUserId,
}) => {
    const { refreshUser } = useAuth();
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Check if user is already a passenger
    const isAlreadyBooked =
        !!currentUserId &&
        Array.isArray(ride.passengerIds) &&
        ride.passengerIds.some((id) => String(id) === String(currentUserId));

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        setToast(null);

        try {
            const { data } = await apiClient.post(
                ENDPOINTS.RIDES.VERIFY(ride.id),
                { code }
            );
            setToast({
                type: "success",
                message: "Ride Verified! Points distributed.",
            });
            await refreshUser();
            setCode("");
        } catch (error: any) {
            setToast({
                type: "error",
                message: error.response?.data?.message || "Verification failed",
            });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Card className="overflow-hidden">
            {/* Image Section */}
            <div className="h-64 bg-gray-200 relative">
                <img
                    src={ride.vehiclePhotoUrl}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/800x400?text=No+Image";
                    }}
                />
                <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold shadow ${
                        ride.seatsAvailable > 0
                            ? "bg-eco-400 text-white"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {ride.seatsAvailable > 0
                        ? `${ride.seatsAvailable} Seats Left`
                        : "Full"}
                </div>
            </div>

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {ride.destination}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-1">
                            <span>📍</span> Pickup:{" "}
                            <span className="font-medium">
                                {ride.pickupPoint}
                            </span>
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-3xl font-bold text-indigo-600">
                            {formatPrice(ride.cost)}
                        </p>
                        <p className="text-sm text-gray-400">per person</p>
                    </div>
                </div>

                {/* TICKET CODE DISPLAY - NEW SECTION */}
                {isAlreadyBooked && ride.verificationCode && (
                    <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                        <p className="text-indigo-800 text-sm font-medium mb-1">
                            Your Ticket Code
                        </p>
                        <div className="text-4xl font-mono font-bold text-indigo-600 tracking-widest">
                            {ride.verificationCode}
                        </div>
                        <p className="text-indigo-600 text-xs mt-2">
                            Show this code to the driver to verify your ride.
                        </p>
                    </div>
                )}

                {/* Driver Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold">
                        {ride.driver.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Driver</p>
                        <p className="font-medium text-gray-900">
                            {ride.driver.name}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <a
                            href={`https://wa.me/${ride.driver.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
                        >
                            💬 Chat on WA
                        </a>
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    {toast && (
                        <div
                            className={`mb-4 p-3 rounded text-sm ${
                                toast.type === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {toast.message}
                        </div>
                    )}

                    {isOwner ? (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <h3 className="font-bold text-yellow-800 mb-2">
                                Driver Dashboard
                            </h3>
                            <p className="text-sm text-yellow-700 mb-4">
                                Has the passenger arrived? Enter their ticket
                                code here to complete the ride.
                            </p>
                            <form
                                onSubmit={handleVerify}
                                className="flex gap-2"
                            >
                                <Input
                                    placeholder="Enter 4-digit Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="bg-white"
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={verifying}
                                >
                                    Verify
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={onBook}
                            isLoading={isBooking}
                            disabled={
                                ride.seatsAvailable === 0 || isAlreadyBooked
                            }
                        >
                            {isAlreadyBooked
                                ? "You have booked this ride ✅"
                                : ride.seatsAvailable === 0
                                ? "Ride is Full"
                                : "Book This Ride"}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};
