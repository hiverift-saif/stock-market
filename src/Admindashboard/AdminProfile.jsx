import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
// import axios from "axios";  // agar API call se data laana ho to

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ Prefill data (ye backend/API se aa sakta hai)
  useEffect(() => {
    // Example static data (baad me API call se replace kar lena)
    const existingAdmin = {
      name: "Shahbaz Khan",
      email: "shahbaz@example.com",
      phone: "9876543210",
      password: "admin@123", // ⚠️ real project me password prefill karna secure nahi hota
    };

    setAdminProfile(existingAdmin);

    // Agar API call karni ho:
    /*
    axios.get("/api/admin/profile").then((res) => {
      setAdminProfile(res.data);
    });
    */
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
    console.log("Updated Admin Profile:", adminProfile);
    alert("✅ Admin Profile Updated!");
    // ✅ API call: axios.post("/admin/updateProfile", adminProfile)
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 container">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
        <User size={20} /> Admin Profile
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Update or edit admin details below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={adminProfile.name}
            onChange={handleProfileChange}
            placeholder="Enter full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={adminProfile.email}
            onChange={handleProfileChange}
            placeholder="Enter email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={adminProfile.phone}
            onChange={handleProfileChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={adminProfile.password}
            onChange={handleProfileChange}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleProfileSave}
          className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium shadow-md transition-all"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
