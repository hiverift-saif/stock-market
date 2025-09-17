  import React, { useEffect, useState } from "react";
  import axios from "axios";

  const KycVerificationAdmin = () => {
    const userId = "68b1a01074ad0c19f272b438"; // Default userId for testing
    const [kycDetails, setKycDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchKyc = async () => {
        try {
          const token = localStorage.getItem("accessToken"); // agar token chahiye
          const res = await axios.get(
            `https://www.cakistockmarket.com/api/v1/kyc/status/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            } 
          );
          setKycDetails(res.data.result);
        } catch (error) {
          console.error("Error fetching KYC:", error);
        } finally {
          setLoading(false);
        }
      };

      if (userId) fetchKyc();
    }, [userId]);

    if (loading) return <p className="text-gray-500">Loading KYC details...</p>;
    if (!kycDetails)
      return <p className="text-red-500">No KYC details found for this user.</p>;

    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          KYC Details
        </h2>

        {/* 🔹 Images Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Aadhaar Front
            </p>
            <img
              src={kycDetails.aadhaarFrontDoc}
              alt="Aadhaar Front"
              className="w-full h-28 object-cover rounded-lg border"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Aadhaar Back
            </p>
            <img
              src={kycDetails.aadhaarBackDoc}
              alt="Aadhaar Back"
              className="w-full h-28 object-cover rounded-lg border"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">PAN Front</p>
            <img
              src={kycDetails.panFrontDoc}
              alt="PAN Front"
              className="w-full h-28 object-cover rounded-lg border"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">PAN Back</p>
            <img
              src={kycDetails.panBackDoc}
              alt="PAN Back"
              className="w-full h-28 object-cover rounded-lg border"
            />
          </div>
        </div>

        {/* 🔹 Status & Remark */}
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-700">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                kycDetails.status === "verified"
                  ? "bg-green-100 text-green-700"
                  : kycDetails.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {kycDetails.status}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Remark:</span>{" "}
            {kycDetails.remark || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-700">Uploaded Date:</span>{" "}
            {new Date(kycDetails.uploadedDate).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  export default KycVerificationAdmin;
