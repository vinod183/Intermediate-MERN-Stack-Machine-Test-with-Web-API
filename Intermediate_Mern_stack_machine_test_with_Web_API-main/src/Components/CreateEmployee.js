import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { createEmployee } from "../Services/Operations/EmployeeAPI";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

export default function CreateEmployee() {
    const [formData, setFormData] = useState({
        Name: "",
        email: "",
        mobileNumber: "",
        designation: "",
        gender: "",
        courses: [],  // Change to an array to hold multiple courses
        image: ""
    });
    const navigate = useNavigate();
    const [selectImage, setSelectImage] = useState(null);

    useEffect(() => {
        const adminName = localStorage.getItem('adminName');
        if (!adminName) {
            navigate("/");
        }
    }, [navigate]);

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => {
            const courses = prevData.courses.includes(value)
                ? prevData.courses.filter((course) => course !== value) // Remove course if already selected
                : [...prevData.courses, value]; // Add course if not selected
            return { ...prevData, courses };
        });
    };

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setSelectImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectImage) {
            return alert("Image required");
        }
        formData.image = URL.createObjectURL(selectImage);

        if (formData.mobileNumber && (formData.mobileNumber.length > 10 || formData.mobileNumber.length < 10)) {
            alert("Number should be 10 digits.");
            return;
        }

        if (!formData.designation) {
            alert("Designation Required");
            return;
        }

        if (!formData.gender) {
            alert("Gender Required");
            return;
        }

        if (formData.courses.length === 0) {
            alert("At least one course is required");
            return;
        }

        if (!formData.image) {
            alert("Image Required");
            return;
        }

        try {
            const response = await createEmployee(formData, navigate);
            if (response?.data.message === 'Employee data already exist') {
                toast.error("Email Already Exists");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <section>
                <Navbar />
            </section>
            <form onSubmit={handleSubmit}
                className="w-[40%] mx-auto h-full my-10 border-2 p-3 rounded-md shadow-lg">
                <p className="text-center text-2xl font-bold mt-2">
                    Create Employee Data
                </p>
                {/* Name */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-base">Name</label>
                    <input
                        required
                        type="text"
                        name="Name"
                        id="name"
                        placeholder="Enter name"
                        className="inputTag"
                        value={formData.Name}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-base">Email Address</label>
                    <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email address"
                        className="inputTag"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="mobileNumber" className="text-base">Mobile Number</label>
                    <input
                        required
                        type="number"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        className="inputTag"
                    />
                </div>

                {/* Designation */}
                <div className="flex gap-x-4 mt-2 items-center">
                    <label htmlFor="designation" className="text-base">Designation</label>
                    <select
                        name="designation"
                        id="designation"
                        className="inputTag text-center"
                        value={formData.designation}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                {/* Gender */}
                <div className="mt-3 flex gap-x-4 items-center">
                    <label htmlFor="gender" className="text-base">Gender</label>
                    <div className="flex gap-x-3">
                        <div className="flex gap-x-2 items-center">
                            <input type="radio" value="M" name="gender" onChange={handleChange} />
                            <p>M</p>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <input type="radio" value="F" name="gender" onChange={handleChange} />
                            <p>F</p>
                        </div>
                    </div>
                </div>

                {/* Course Selection */}
                <div className="mt-3 flex flex-col">
                    <label className="text-base">Courses</label>
                    <div className="flex gap-x-4 items-center">
                        {['MCA', 'BCA', 'BSC'].map((course) => (
                            <div key={course} className="flex gap-x-2 items-center">
                                <input
                                    type="checkbox"
                                    value={course}
                                    className="cursor-pointer"
                                    checked={formData.courses.includes(course)}
                                    onChange={handleCheckboxChange}
                                />
                                <p className="text-base">{course}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <input type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImage}
                    className="mt-2"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-lg rounded-md flex justify-center items-center mt-4 mx-auto text-white">
                    Submit
                </button>
            </form>
        </div>
    );
}
