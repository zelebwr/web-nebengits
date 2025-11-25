import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./features/auth/hooks/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { MainLayout } from "./components/Layout/MainLayout";

// --- IMPORT THE REAL DASHBOARD HERE ---
import { DashboardPage } from "./features/rides/DashboardPage";

// --- Placeholder Pages (Keep these only if you haven't built them yet) ---
const CreateRidePage = () => (
    <MainLayout>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Offer a Ride</h2>
        <p>Form to create a ride goes here.</p>
    </MainLayout>
);

const RideDetailPage = () => (
    <MainLayout>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ride Details</h2>
        <p>Details for a specific ride.</p>
    </MainLayout>
);

// --- Route Guards ---
const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return user ? <Navigate to="/" replace /> : <Outlet />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/register"
                            element={
                                <div className="p-10 text-center">
                                    Register Page Coming Soon
                                </div>
                            }
                        />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        {/* Use the imported DashboardPage here */}
                        <Route path="/" element={<DashboardPage />} />
                        <Route
                            path="/rides/create"
                            element={<CreateRidePage />}
                        />
                        <Route path="/rides/:id" element={<RideDetailPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
