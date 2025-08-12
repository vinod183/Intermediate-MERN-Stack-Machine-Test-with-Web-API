import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Services/Operations/Auth_API";

export default function Navbar() {
    const dashboardLink = [
        { title: "Home", link: "/dashboard" },
        { title: "Employee List", link: "/employeeList" },
        { title: "Create Employee", link: "/createEmployee" }
    ];

    const [adminName, setAdminName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userName = localStorage.getItem('adminName');
        if (userName) {
            setAdminName(userName);
        }
    }, []);

    return (
        <div className="bg-white shadow-lg py-4">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600 select-none">
                        Logo
                    </span>
                </div>

                {/* Links */}
                <div className="hidden md:flex space-x-8">
                    {dashboardLink.map((element, i) => (
                        <Link
                            to={element.link}
                            key={i}
                            className="text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-colors px-4 py-2 rounded-md text-lg font-medium"
                        >
                            {element.title}
                        </Link>
                    ))}
                </div>

                {/* User info & Logout */}
                <div className="flex items-center space-x-4">
                    {/* Admin Name */}
                    <span className="text-lg font-medium text-gray-900">
                        {adminName}
                    </span>

                    {/* Logout Button */}
                    <button
                        onClick={() => logout(navigate)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
}
