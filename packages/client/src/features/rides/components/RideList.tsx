import React, { useEffect, useState } from "react";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide, type ApiRideListResponse } from "@web-nebengits/shared";
import { RideCard } from "./RideCard";
import { Toast } from "../../../components";

export const RideList = () => {
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const fetchRides = async () => {
        try {
            setLoading(true);
            // We explicitly type the response data
            const { data } = await apiClient.get<{
                success: boolean;
                data: ApiRide[];
            }>(ENDPOINTS.RIDES.LIST);
            // Based on your controller, the array is in data.data
            setRides(data.data);
        } catch (error) {
            console.error("Failed to fetch rides", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const handleBook = async (rideId: string) => {
        if (!confirm("Are you sure you want to book this ride?")) return;

        setBookingId(rideId);
        try {
            const { data } = await apiClient.post(ENDPOINTS.RIDES.BOOK(rideId));
            setToast({
                message: `Success! Your ticket code is: ${data.data.ticketCode}`,
                type: "success",
            });
            fetchRides(); // Refresh list to update seat count
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to book ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setBookingId(null);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-80 bg-gray-100 animate-pulse rounded-xl"
                    ></div>
                ))}
            </div>
        );
    }

    if (rides.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                    No available rides found.
                </p>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rides.map((ride) => (
                    <RideCard
                        key={ride.id}
                        ride={ride}
                        onBook={handleBook}
                        isBooking={bookingId === ride.id}
                    />
                ))}
            </div>
        </>
    );
};
