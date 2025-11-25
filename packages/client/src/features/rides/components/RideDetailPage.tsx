import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout, Button, Toast } from "../../../components";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";
import { RideDetailCard } from "./RideDetailCard";
import { useAuth } from "../../auth/hooks/useAuth";

export const RideDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ride, setRide] = useState<ApiRide | null>(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const fetchRide = async () => {
        if (!id) return;
        try {
            setLoading(true);
            // Call the new GET /rides/:id endpoint
            // We need to construct the URL manually since constants.ts might not have it as a function yet
            const { data } = await apiClient.get<{
                success: boolean;
                data: ApiRide;
            }>(`${ENDPOINTS.RIDES.LIST}/${id}`);
            setRide(data.data);
        } catch (error) {
            console.error("Failed to fetch ride details", error);
            setToast({ message: "Failed to load ride details", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRide();
    }, [id]);

    const handleBook = async () => {
        if (!ride || !id) return;
        if (!confirm("Are you sure you want to book this ride?")) return;

        setBooking(true);
        try {
            const { data } = await apiClient.post(ENDPOINTS.RIDES.BOOK(id));
            setToast({
                message: `Success! Your ticket code is: ${data.data.ticketCode}`,
                type: "success",
            });

            // Refresh ride data to update seat count
            fetchRide();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to book ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (!ride) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Ride not found
                    </h2>
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/")}
                        className="mt-4"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </MainLayout>
        );
    }

    // Check if current user is the driver (simple check)
    // Note: ApiRide.driver doesn't have ID yet, so this is a best-effort check based on name/email if available
    // Ideally, backend should return driverId in the ride object.
    // For now, we'll default to false or check against user name if unique enough.
    const isOwner = user?.name === ride.driver.name;

    return (
        <MainLayout>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-6">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/")}
                    size="sm"
                >
                    ← Back to Rides
                </Button>
            </div>

            <div className="max-w-4xl mx-auto">
                <RideDetailCard
                    ride={ride}
                    onBook={handleBook}
                    isBooking={booking}
                    isOwner={isOwner}
                />

                {/* Instructions Section */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        How it works
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                        <li>Book a seat for this ride.</li>
                        <li>
                            You will receive a unique{" "}
                            <strong>4-digit ticket code</strong>.
                        </li>
                        <li>
                            Meet the driver at the pickup point:{" "}
                            <strong>{ride.pickupPoint}</strong>.
                        </li>
                        <li>
                            Show the code to the driver when you arrive to
                            verify your ride.
                        </li>
                        <li>Enjoy your trip and earn Green Points!</li>
                    </ol>
                </div>
            </div>
        </MainLayout>
    );
};
