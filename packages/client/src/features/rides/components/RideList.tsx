import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";
import { RideCard } from "./RideCard";
import { Toast } from "../../../components";

export const RideList = () => {
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [bookingId, setBookingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    // Ref for the intersection observer
    const observer = useRef<IntersectionObserver | null>(null);

    const fetchRides = async (pageNum: number, isLoadMore = false) => {
        try {
            if (!isLoadMore) setLoading(true);
            else setLoadingMore(true);

            console.log("Fetching rides page:", pageNum);

            const { data } = await apiClient.get<{
                success: boolean;
                data: ApiRide[];
                meta: { totalPages: number };
            }>(ENDPOINTS.RIDES.LIST, {
                params: { page: pageNum, limit: 9 },
            });

            if (data.success && Array.isArray(data.data)) {
                if (isLoadMore) {
                    setRides((prev) => [...prev, ...data.data]);
                } else {
                    setRides(data.data);
                }
                setHasMore(pageNum < data.meta.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch rides", error);
            setToast({ message: "Failed to load rides", type: "error" });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchRides(1);
    }, []);

    // The callback ref for the last element
    const lastRideElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading || loadingMore) return;

            // Disconnect previous observer
            if (observer.current) observer.current.disconnect();

            // Create new observer
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchRides(nextPage, true);
                        return nextPage;
                    });
                }
            });

            // Observe the new node
            if (node) observer.current.observe(node);
        },
        [loading, loadingMore, hasMore]
    );

    const handleBook = async (rideId: string) => {
        if (!confirm("Are you sure you want to book this ride?")) return;

        setBookingId(rideId);
        try {
            const { data } = await apiClient.post(ENDPOINTS.RIDES.BOOK(rideId));
            setToast({
                message: `Success! Your ticket code is: ${data.data.ticketCode}`,
                type: "success",
            });
            // Reset to page 1 to refresh data properly
            fetchRides(1);
            setPage(1);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to book ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setBookingId(null);
        }
    };

    if (loading && page === 1) {
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

            <div className="space-y-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride, index) => {
                        // Attach ref to the last element
                        if (rides.length === index + 1) {
                            return (
                                <div ref={lastRideElementRef} key={ride.id}>
                                    <RideCard
                                        ride={ride}
                                        onBook={handleBook}
                                        isBooking={bookingId === ride.id}
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <div key={ride.id}>
                                    <RideCard
                                        ride={ride}
                                        onBook={handleBook}
                                        isBooking={bookingId === ride.id}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>

                {/* Loading indicator at the bottom */}
                {loadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && rides.length > 0 && (
                    <p className="text-center text-gray-400 text-sm">
                        You've reached the end of the list.
                    </p>
                )}
            </div>
        </>
    );
};
