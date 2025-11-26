import React, { useEffect, useState, useRef, useCallback } from "react";
import { apiClient } from "../../../lib/apiClient";
import { ENDPOINTS } from "../../../lib/constants";
import { type ApiRide } from "@web-nebengits/shared";
import { RideCard } from "./RideCard";
import { RideCardSkeleton } from "./RideCardSkeleton";
import { EmptyState } from "../../../components/Loaders/EmptyState";
import { Toast } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export const RideList = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [rides, setRides] = useState<ApiRide[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedDestination(destinationQuery);
            setDebouncedPickup(pickupQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [destinationQuery, pickupQuery]);

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

    // Solid Dark Input Style
    const inputDarkClass =
        "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-slate-600";

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
            <>
                <div className="mb-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-primary-400">🔍</span> Find your
                        ride
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Destination
                            </label>
                            <input
                                type="text"
                                placeholder="Where to? (e.g. Galaxy Mall)"
                                value={destinationQuery}
                                onChange={(e) =>
                                    setDestinationQuery(e.target.value)
                                }
                                className={inputDarkClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                Pickup Point
                            </label>
                            <input
                                type="text"
                                placeholder="From where? (e.g. Asrama)"
                                value={pickupQuery}
                                onChange={(e) => setPickupQuery(e.target.value)}
                                className={inputDarkClass}
                            />
                        </div>
                    </div>
                </div>

                <EmptyState
                    title="No rides found"
                    description={
                        debouncedDestination || debouncedPickup
                            ? "Try adjusting your search filters to find more results."
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
            </>
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

            {/* DARK SOLID FILTER SECTION */}
            <div className="mb-8 bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 transition-all hover:shadow-primary-500/5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="bg-slate-700 p-1.5 rounded-lg text-primary-400">
                            🔍
                        </span>
                        Filter Rides
                    </h3>
                    {(destinationQuery || pickupQuery) && (
                        <button
                            onClick={() => {
                                setDestinationQuery("");
                                setPickupQuery("");
                            }}
                            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Search Destination..."
                            value={destinationQuery}
                            onChange={(e) =>
                                setDestinationQuery(e.target.value)
                            }
                            className={inputDarkClass}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Search Pickup Point..."
                            value={pickupQuery}
                            onChange={(e) => setPickupQuery(e.target.value)}
                            className={inputDarkClass}
                        />
                    </div>
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
                                className="h-full"
                            >
                                <RideCard
                                    ride={ride}
                                    onBook={handleBook}
                                    isBooking={bookingId === ride.id}
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
                        <span className="bg-slate-800 border border-slate-700 text-slate-400 px-6 py-2 rounded-full text-xs font-medium shadow-sm">
                            You've reached the end of the list 🏁
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};
