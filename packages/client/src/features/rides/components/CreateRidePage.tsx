import React from "react";
import { MainLayout } from "../../../components/Layout/MainLayout";
import { CreateRideForm } from "./CreateRideForm";

export const CreateRidePage = () => {
    return (
        <MainLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Offer a Ride
                </h1>
                <p className="text-gray-500 mt-1">
                    Going somewhere? Share your empty seats and earn Green
                    Points.
                </p>
            </div>

            <CreateRideForm />
        </MainLayout>
    );
};
