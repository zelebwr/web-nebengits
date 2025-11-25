import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Toast } from "../../../components";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";

export const CreateRideForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    // Form State
    const [destination, setDestination] = useState("");
    const [pickupPoint, setPickupPoint] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [seatsAvailable, setSeatsAvailable] = useState(3);
    const [cost, setCost] = useState(10000);
    const [photo, setPhoto] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!photo) {
            setToast({
                message: "Please upload a vehicle photo",
                type: "error",
            });
            return;
        }

        setIsLoading(true);
        setToast(null);

        try {
            // 1. Prepare FormData for file upload
            const formData = new FormData();
            formData.append("destination", destination);
            formData.append("pickupPoint", pickupPoint);
            formData.append(
                "departureTime",
                new Date(departureTime).toISOString()
            );
            formData.append("seatsAvailable", seatsAvailable.toString());
            formData.append("cost", cost.toString());
            formData.append("vehiclePhoto", photo); // Key must match backend middleware

            // 2. Send Request
            await apiClient.post(ENDPOINTS.RIDES.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Important!
                },
            });

            setToast({
                message: "Ride created successfully!",
                type: "success",
            });

            // 3. Redirect after short delay
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error: any) {
            console.error("Create ride failed", error);
            const msg =
                error.response?.data?.message || "Failed to create ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <Input
                    label="Destination"
                    placeholder="e.g. Galaxy Mall"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />

                {/* Pickup Point */}
                <Input
                    label="Pickup Point"
                    placeholder="e.g. Asrama Mahasiswa"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    required
                />

                {/* Date & Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time
                    </label>
                    <input
                        type="datetime-local"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Seats */}
                    <Input
                        label="Seats Available"
                        type="number"
                        min={1}
                        max={6}
                        value={seatsAvailable}
                        onChange={(e) =>
                            setSeatsAvailable(Number(e.target.value))
                        }
                        required
                    />

                    {/* Cost */}
                    <Input
                        label="Cost (IDR)"
                        type="number"
                        min={0}
                        step={1000}
                        value={cost}
                        onChange={(e) => setCost(Number(e.target.value))}
                        required
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Photo (Required for verification)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
                        required
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                    >
                        Post Ride
                    </Button>
                </div>
            </form>
        </div>
    );
};
