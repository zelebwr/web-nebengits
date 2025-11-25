import React from "react";
import { Link } from "react-router-dom";
import { MainLayout, Button } from "../../components";
import { RideList } from "./components/RideList";

export const DashboardPage = () => {
    return (
        <MainLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Available Rides
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Find a ride or offer one to your peers.
                    </p>
                </div>
                <Link to="/rides/create">
                    <Button variant="primary" size="lg">
                        + Offer a Ride
                    </Button>
                </Link>
            </div>

            <RideList />
        </MainLayout>
    );
};
