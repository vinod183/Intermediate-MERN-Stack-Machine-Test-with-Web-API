import { useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const adminName = localStorage.getItem('adminName');
        if (!adminName) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            {/* Dashboard Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-lg text-gray-500 mt-2">Manage your platform and users effectively.</p>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white border-4 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center shadow-sm">
                        <div className="text-center">
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to the Admin Panel</h2>
                            <p className="text-lg text-gray-600">Here you can manage employees, view analytics, and monitor system activities.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
