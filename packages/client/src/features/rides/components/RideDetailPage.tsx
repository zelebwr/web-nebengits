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
            fetchRide(); // Refresh data to update passenger list
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to book ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setBooking(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (
            !confirm(
                "Are you sure you want to delete this ride? This cannot be undone."
            )
        )
            return;

        try {
            await apiClient.delete(`${ENDPOINTS.RIDES.LIST}/${id}`);
            setToast({ message: "Ride deleted successfully", type: "success" });
            setTimeout(() => navigate("/"), 1000);
        } catch (error: any) {
            const msg =
                error.response?.data?.message || "Failed to delete ride";
            setToast({ message: msg, type: "error" });
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

    const isOwner = user?.id === ride.driverId;

    return (
        <MainLayout>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate("/")}
                    size="sm"
                >
                    ← Back to Rides
                </Button>

                {isOwner && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/rides/${id}/edit`)}
                        >
                            Edit Ride
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete Ride
                        </Button>
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto">
                <RideDetailCard
                    ride={ride}
                    onBook={handleBook}
                    isBooking={booking}
                    isOwner={isOwner}
                    currentUserId={user?.id} // Pass User ID Here
                />

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
                    </ol>
                </div>
            </div>
        </MainLayout>
    );
};
