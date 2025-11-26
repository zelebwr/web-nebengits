import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";
import { RideCard } from "./RideCard";
import { RideCardSkeleton } from "./RideCardSkeleton";
import { EmptyState } from "../../../components/Loaders/EmptyState";
import { Toast, Input } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export const RideList = () => {
    const { user, isLoading: authLoading } = useAuth(); // Get auth loading state
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Search State
    const [destinationQuery, setDestinationQuery] = useState("");
    const [pickupQuery, setPickupQuery] = useState("");
    const [debouncedDestination, setDebouncedDestination] = useState("");
    const [debouncedPickup, setDebouncedPickup] = useState("");

    const [bookingId, setBookingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const navigate = useNavigate();
    const observer = useRef<IntersectionObserver | null>(null);

    // Debugging: Check if user is loaded
    useEffect(() => {
        console.log("RideList Auth State:", { user, authLoading });
    }, [user, authLoading]);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedDestination(destinationQuery);
            setDebouncedPickup(pickupQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [destinationQuery, pickupQuery]);

    // Fetch Rides
    const fetchRides = async (pageNum: number, isLoadMore = false) => {
        try {
            if (!isLoadMore) setLoading(true);
            else setLoadingMore(true);

            const { data } = await apiClient.get<{
                success: boolean;
                data: ApiRide[];
                meta: { totalPages: number };
            }>(ENDPOINTS.RIDES.LIST, {
                params: {
                    page: pageNum,
                    limit: 9,
                    destination: debouncedDestination,
                    pickupPoint: debouncedPickup,
                },
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

    useEffect(() => {
        setPage(1);
        fetchRides(1, false);
    }, [debouncedDestination, debouncedPickup]);

    const lastRideElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading || loadingMore) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchRides(nextPage, true);
                        return nextPage;
                    });
                }
            });
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
            fetchRides(1, false);
            setPage(1);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to book ride";
            setToast({ message: msg, type: "error" });
        } finally {
            setBookingId(null);
        }
    };

    // Combine loading states?
    // Ideally we show skeletons if EITHER fetching rides OR fetching auth is happening
    // But for now let's just rely on rides loading
    if (loading && page === 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <RideCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (rides.length === 0) {
        return (
            <EmptyState
                title="No rides found"
                description={
                    debouncedDestination || debouncedPickup
                        ? "Try adjusting your search filters."
                        : "Looks like no one is driving right now. Be the first!"
                }
                actionLabel={
                    debouncedDestination || debouncedPickup
                        ? "Clear Search"
                        : "Offer a Ride"
                }
                onAction={() => {
                    if (debouncedDestination || debouncedPickup) {
                        setDestinationQuery("");
                        setPickupQuery("");
                    } else {
                        navigate("/rides/create");
                    }
                }}
                icon="🔍"
            />
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

            <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Where to?"
                        placeholder="Search destination (e.g., Galaxy Mall)"
                        value={destinationQuery}
                        onChange={(e) => setDestinationQuery(e.target.value)}
                    />
                    <Input
                        label="Pickup From?"
                        placeholder="Search pickup (e.g., Asrama)"
                        value={pickupQuery}
                        onChange={(e) => setPickupQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride, index) => {
                        const isLast = rides.length === index + 1;
                        return (
                            <div
                                ref={isLast ? lastRideElementRef : null}
                                key={ride.id}
                            >
                                <RideCard
                                    ride={ride}
                                    onBook={handleBook}
                                    isBooking={bookingId === ride.id}
                                    // Ensure this passes correctly.
                                    // If user is null, this is undefined, which causes the bug.
                                    currentUserId={user?.id}
                                />
                            </div>
                        );
                    })}
                </div>

                {loadingMore && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {[1, 2, 3].map((i) => (
                            <RideCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!hasMore && rides.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-medium">
                            You've reached the end of the list 🏁
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};
