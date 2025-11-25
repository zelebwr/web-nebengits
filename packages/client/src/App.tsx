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
import { RegisterPage } from "./features/auth/RegisterPage";
import { MainLayout } from "./components/Layout/MainLayout";

// --- IMPORT THE REAL DASHBOARD HERE ---
import { DashboardPage } from "./features/rides/DashboardPage";

// --- RIDE COMPONENTS ---
import { CreateRidePage } from "./features/rides/components/CreateRidePage";
import { RideDetailPage } from "./features/rides/components/RideDetailPage";
import { EditRidePage } from "./features/rides/components/EditRidePage";

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
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route
                            path="/rides/create"
                            element={<CreateRidePage />}
                        />
                        <Route path="/rides/:id" element={<RideDetailPage />} />
                        <Route
                            path="/rides/:id/edit"
                            element={<EditRidePage />}
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
