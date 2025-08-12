import { useEffect, useState } from "react";
import { deleteEmployeeData, getEmployeeList } from "../Services/Operations/EmployeeAPI";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { format } from 'date-fns';

export default function EmployeeList() {
    const [employeeList, setEmployeeList] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [reloadPage, setReloadPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state for better UX
    const [error, setError] = useState(null); // Error state to handle any API issues
    const navigate = useNavigate();

    // Fetch employee list on page load or when reloadPage state changes
    useEffect(() => {
        const fetchEmployeeList = async () => {
            try {
                const response = await getEmployeeList();
                setEmployeeList(response);
                setFilteredData(response);
            } catch (error) {
                setError("Failed to load employee data.");
            } finally {
                setIsLoading(false); // Turn off loading spinner after data is fetched
            }
        };

        fetchEmployeeList();
    }, [reloadPage]);

    // Check for admin authentication
    useEffect(() => {
        const adminName = localStorage.getItem("adminName");
        if (!adminName) {
            navigate("/");
        }
    }, [navigate]);

    // Search functionality to filter employees by name
    useEffect(() => {
        const result = employeeList.filter((data) =>
            data.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(result);
    }, [search, employeeList]);

    // Define table columns
    const columns = [
        {
            name: "ID",
            selector: (row) => row._id,
            width: "16rem",
        },
        {
            name: "Image",
            selector: (row) => <img src={row.image} alt="employee" className="w-24 h-auto" />,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
            width: "12rem",
        },
        {
            name: "Email",
            selector: (row) => row.email,
            width: "16rem",
        },
        {
            name: "Mobile No",
            selector: (row) => row.mobileNo,
            width: "7.5rem",
        },
        {
            name: "Designation",
            selector: (row) => row.designation,
            width: "7.5rem",
        },
        {
            name: "Gender",
            selector: (row) => row.gender,
            width: "6rem",
        },
        {
            name: "Course",
            selector: (row) => row.course,
            width: "8.9rem",
        },
        {
            name: "Created At",
            selector: (row) => format(new Date(row.createdAt), "dd-MMM-yyyy"),
            sortable: true,
            width: "9rem",
        },
        {
            name: "Action",
            width: "10rem",
            cell: (row) => (
                <div className="flex gap-x-3">
                    {/* Edit button */}
                    <button
                        onClick={() => {
                            localStorage.setItem("editData", JSON.stringify(row));
                            navigate("/edit");
                        }}
                        className="bg-blue-500 px-2 py-1 text-white rounded-md"
                    >
                        Edit
                    </button>
                    {/* Delete button */}
                    <button
                        onClick={() => {
                            deleteEmployeeData(row._id);
                            setReloadPage((prev) => !prev);
                        }}
                        className="bg-red-500 px-2 py-1 text-white rounded-md"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // Custom styles for the DataTable
    const customStyles = {
        rows: {
            style: {
                fontSize: "1rem",
            },
        },
        headCells: {
            style: {
                fontSize: "1rem",
                fontWeight: "bold",
            },
        },
        cells: {
            style: {
                borderStyle: "solid",
                borderWidth: "0.01rem",
            },
        },
    };

    // Display loading, error, or data table
    return (
        <div>
            <Navbar />
            <div className="flex justify-between p-2">
                <h1 className="text-2xl font-bold">Employee List</h1>

                <div className="flex gap-x-4 items-center">
                    <p className="text-lg font-semibold">Total: {employeeList.length}</p>
                    <Link to="/createEmployee" className="px-6 py-2 bg-blue-500 text-white rounded-md">
                        Create Employee
                    </Link>
                </div>
            </div>

            {/* Conditional Rendering: Loading spinner, error message, or DataTable */}
            {isLoading ? (
                <p className="text-center mt-5">Loading...</p>
            ) : error ? (
                <p className="text-center mt-5 text-red-500">{error}</p>
            ) : (
                <div>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        fixedHeader
                        highlightOnHover
                        subHeader
                        subHeaderComponent={
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={search}
                                className="border border-blue-400 p-2 rounded-md"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        }
                        customStyles={customStyles}
                    />
                </div>
            )}
        </div>
    );
}
