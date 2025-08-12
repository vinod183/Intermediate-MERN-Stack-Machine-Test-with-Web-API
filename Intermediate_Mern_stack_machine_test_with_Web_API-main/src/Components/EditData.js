import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { editEmployee } from "../Services/Operations/EmployeeAPI";
import Navbar from "./Navbar";

export default function EditData() {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const navigate = useNavigate();
    const [newImage, setNewImage] = useState(null);
    const refImage = useRef(null);
    const [formData, setFormData] = useState({
        _id: "",
        Name: "",
        email: "",
        mobileNumber: "",
        designation: "",
        gender: "",
        course: [], // Change to array
        image: ""
    });

    useEffect(() => {
        const adminName = localStorage.getItem('adminName');
        if (!adminName) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const storageData = localStorage.getItem("editData");
        const res = storageData ? JSON.parse(storageData) : null;
        setFormData({
            _id: res._id,
            Name: res.name,
            email: res.email,
            mobileNumber: res.mobileNo,
            designation: res.designation,
            gender: res.gender,
            course: res.course, // Assuming this is an array in the response
            image: res.image
        });
        setSelectedCheckboxes(res.course || []); // Initialize with existing courses
    }, []);

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedCheckboxes((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageClick = () => {
        refImage.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.course = selectedCheckboxes; // Use array of selected checkboxes
        if (newImage) {
            formData.image = URL.createObjectURL(newImage);
        }

        try {
            await editEmployee(formData, navigate);
            alert("Updated Successfully");
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
                <p className="text-center text-2xl font-bold mt-2">Update Employee Data</p>

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
                    <label className="text-base">Gender</label>
                    <div className="flex gap-x-3">
                        <div className="flex gap-x-2 items-center">
                            <input type="radio" value="M" name="gender"
                                checked={formData.gender === 'M'}
                                onChange={handleChange} />
                            <p>M</p>
                        </div>

                        <div className="flex gap-x-2 items-center">
                            <input type="radio" value="F" name="gender"
                                checked={formData.gender === 'F'}
                                onChange={handleChange} />
                            <p>F</p>
                        </div>
                    </div>
                </div>

                {/* Course */}
                <div className="mt-3 flex gap-x-4 items-center">
                    <label className="text-base">Course</label>
                    <div className="flex gap-x-4 items-center">
                        {['MCA', 'BCA', 'BSC'].map((course) => (
                            <div key={course} className="flex gap-x-2 items-center">
                                <input type="checkbox" value={course}
                                    className="cursor-pointer"
                                    checked={selectedCheckboxes.includes(course)}
                                    onChange={handleCheckboxChange} />
                                <p>{course}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <div onClick={handleImageClick} className="flex gap-x-2 mt-2 items-center">
                    {newImage ? (
                        <img src={URL.createObjectURL(newImage)} alt="" className="w-24" />

                    ) : (
                        <img src={formData.image} className="w-24" alt={formData.Name} />

                    )}
                    <input type="file"
                        ref={refImage}
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleImageChange} />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-lg rounded-md flex justify-center items-center mt-4 mx-auto text-white">
                    Update
                </button>
            </form>
        </div>
    );
}
