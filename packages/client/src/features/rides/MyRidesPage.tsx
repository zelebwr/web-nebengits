import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout, Button } from "../../components";
import { apiClient } from "../../lib/apiClient";
import { type ApiRide } from "@web-nebengits/shared";
import { RideCard } from "./components/RideCard";
import { useAuth } from "../auth/hooks/useAuth";

export const MyRidesPage = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRides = async () => {
            try {
                // Calls the endpoint that filters by current user's driverId
                const { data } = await apiClient.get<{
                    success: boolean;
                    data: ApiRide[];
                }>("/rides/posted");
                setRides(data.data);
            } catch (error) {
                console.error("Failed to fetch my rides", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyRides();
    }, []);

    const handleBook = (id: string) => {
        navigate(`/rides/${id}`);
    };

    if (loading)
        return (
            <MainLayout>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </MainLayout>
        );

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    My Posted Rides
                </h1>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/rides/create")}
                >
                    + Create New
                </Button>
            </div>

            {rides.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">
                        You haven't posted any rides yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride) => (
                        <RideCard
                            key={ride.id}
                            ride={ride}
                            onBook={handleBook}
                            currentUserId={user?.id}
                        />
                    ))}
                </div>
            )}
        </MainLayout>
    );
};
