import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MainLayout } from "../../components";
import { apiClient } from "../../lib/apiClient";
import { type ApiRide } from "@web-nebengits/shared";
import { RideCard } from "./components/RideCard";
import { useAuth } from "../auth/hooks/useAuth";

export const MyBookingsPage = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await apiClient.get<{
                    success: boolean;
                    data: ApiRide[];
                }>("/rides/booked");
                setRides(data.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleView = (id: string) => {
        navigate(`/rides/${id}`);
    };

    if (loading)
        return (
            <MainLayout>
                <div>Loading...</div>
            </MainLayout>
        );

    return (
        <MainLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                My Booked Rides
            </h1>

            {rides.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">
                        You haven't booked any rides yet.
                    </p>
                    <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => navigate("/")}
                    >
                        Browse Rides
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride) => (
                        <RideCard
                            key={ride.id}
                            ride={ride}
                            onBook={handleView}
                            currentUserId={user?.id}
                        />
                    ))}
                </div>
            )}
        </MainLayout>
    );
};
