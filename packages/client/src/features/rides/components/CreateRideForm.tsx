import React, {
    useState,
    useEffect,
    type ChangeEvent,
    type FormEvent,
    type DragEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Toast } from "../../../components";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";

interface RideFormProps {
    initialData?: ApiRide;
    isEdit?: boolean;
}

export const CreateRideForm: React.FC<RideFormProps> = ({
    initialData,
    isEdit = false,
}) => {
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
    const [cost, setCost] = useState(5000);

    // File & Preview State
    const [photo, setPhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (isEdit && initialData) {
            setDestination(initialData.destination);
            setPickupPoint(initialData.pickupPoint);

            try {
                const date = new Date(initialData.departureTime);
                const offset = date.getTimezoneOffset() * 60000;
                const localISOTime = new Date(date.getTime() - offset)
                    .toISOString()
                    .slice(0, 16);
                setDepartureTime(localISOTime);
            } catch (e) {
                console.error("Date parsing error:", e);
            }

            setSeatsAvailable(initialData.seatsAvailable);
            setCost(initialData.cost);

            if (initialData.vehiclePhotoUrl) {
                setPreviewUrl(initialData.vehiclePhotoUrl);
            }
        }
    }, [isEdit, initialData]);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setToast({
                message: "Please upload an image file (PNG, JPG)",
                type: "error",
            });
            return;
        }

        // Max size 5MB
        if (file.size > 5 * 1024 * 1024) {
            setToast({
                message: "File size too large (Max 5MB)",
                type: "error",
            });
            return;
        }

        setPhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // --- Drag and Drop Handlers ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!isEdit && !photo) {
            setToast({
                message: "Please upload a vehicle photo",
                type: "error",
            });
            return;
        }

        setIsLoading(true);
        setToast(null);

        try {
            if (isEdit && initialData) {
                // Note: Image update not implemented in backend PATCH yet, just updating text fields
                await apiClient.patch(
                    `${ENDPOINTS.RIDES.LIST}/${initialData.id}`,
                    {
                        destination,
                        pickupPoint,
                        departureTime: new Date(departureTime).toISOString(),
                        seatsAvailable,
                        cost,
                    }
                );
                setToast({
                    message: "Ride updated successfully!",
                    type: "success",
                });
            } else {
                const formData = new FormData();
                formData.append("destination", destination);
                formData.append("pickupPoint", pickupPoint);
                formData.append(
                    "departureTime",
                    new Date(departureTime).toISOString()
                );
                formData.append("seatsAvailable", seatsAvailable.toString());
                formData.append("cost", cost.toString());
                if (photo) formData.append("vehiclePhoto", photo);

                await apiClient.post(ENDPOINTS.RIDES.CREATE, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setToast({
                    message: "Ride created successfully!",
                    type: "success",
                });
            }

            setTimeout(() => {
                navigate(isEdit ? `/rides/${initialData?.id}` : "/");
            }, 1500);
        } catch (error: any) {
            console.error("Operation failed", error);
            const msg = error.response?.data?.message || "Failed to save ride";
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

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEdit ? "Edit Ride Details" : "Offer a New Ride"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Destination"
                    placeholder="e.g. Galaxy Mall"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />

                <Input
                    label="Pickup Point"
                    placeholder="e.g. Asrama Mahasiswa"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    required
                />

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

                {/* File Upload Section with Preview */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Photo {isEdit ? "(Optional)" : "(Required)"}
                    </label>

                    {/* Image Preview Container */}
                    {previewUrl && (
                        <div className="mb-4 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={previewUrl}
                                alt="Vehicle Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPhoto(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-md"
                                title="Remove image"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    {!isEdit && !previewUrl && (
                        <div
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer relative
                                ${
                                    isDragging
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-gray-300 bg-gray-50 hover:bg-white hover:border-indigo-400"
                                }
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() =>
                                document.getElementById("file-upload")?.click()
                            } // Explicit click trigger
                        >
                            <div className="space-y-1 text-center pointer-events-none">
                                {" "}
                                {/* Prevent child clicks blocking parent */}
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        onClick={(e) => e.stopPropagation()} // Stop propagation to avoid double trigger
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            // required={!isEdit} // Removed to avoid browser tooltip issues
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
                        {isEdit ? "Save Changes" : "Post Ride"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
