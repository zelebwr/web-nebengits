import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../components";
import { CreateRideForm } from "./CreateRideForm";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";

export const EditRidePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ride, setRide] = useState<ApiRide | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchRide = async () => {
            try {
                const { data } = await apiClient.get<{ data: ApiRide }>(
                    `${ENDPOINTS.RIDES.LIST}/${id}`
                );
                setRide(data.data);
            } catch (error) {
                console.error("Failed to fetch ride", error);
                alert("Failed to load ride details.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchRide();
    }, [id, navigate]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    &larr; Back
                </button>
            </div>
            <CreateRideForm initialData={ride!} isEdit={true} />
        </MainLayout>
    );
};
