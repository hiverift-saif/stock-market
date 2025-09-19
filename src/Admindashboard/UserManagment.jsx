// src/components/KycVerificationAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const KycVerificationAdmin = ({ userId = "68b1a01074ad0c19f272b438" }) => {
  const [kycDetails, setKycDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchKyc = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${config.BASE_URL}kyc/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.statusCode === 200) setKycDetails(res.data.result);
      else setError("Failed to fetch KYC details");
    } catch (err) {
      console.error("Error fetching KYC:", err);
      setError("Something went wrong while fetching KYC details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchKyc();
  }, [userId]);

  const handleUpdateStatus = async (status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${config.BASE_URL}kyc/update-status/${userId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: `KYC ${status}`,
          text: `User KYC has been ${status} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setKycDetails((prev) => ({ ...prev, status }));
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Unable to update KYC status",
        });
      }
    } catch (err) {
      console.error("Error updating KYC status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating KYC",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePreview = (src, label) => {
    Swal.fire({
      title: label,
      imageUrl: src,
      imageAlt: label,
      width: "50%",
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  if (loading) return <p className="text-gray-500">Loading KYC details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!kycDetails)
    return <p className="text-red-500">No KYC details found for this user.</p>;

  const documents = [
    { label: "Aadhaar Front", src: kycDetails.aadhaarFrontDoc },
    { label: "Aadhaar Back", src: kycDetails.aadhaarBackDoc },
    { label: "PAN Front", src: kycDetails.panFrontDoc },
    { label: "PAN Back", src: kycDetails.panBackDoc },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* User Info */}
        <div className="flex-1 space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
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
          <p className="text-sm">
            <span className="font-semibold">Remark:</span>{" "}
            {kycDetails.remark || "No remark"}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Uploaded:</span>{" "}
            {new Date(kycDetails.uploadedDate).toLocaleString()}
          </p>
        </div>

        {/* Documents */}
        <div className="flex gap-6 flex-wrap justify-center">
          {documents.map(
            (doc, idx) =>
              doc.src && (
                <div
                  key={idx}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handlePreview(doc.src, doc.label)}
                >
                  <Eye className="w-6 h-6 text-blue-600 hover:scale-110 transition" />
                  <span className="text-xs mt-1 text-gray-600">
                    {doc.label}
                  </span>
                </div>
              )
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 md:flex-col">
          <button
            onClick={() => handleUpdateStatus("verified")}
            disabled={updating}
            className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 shadow"
          >
            Approve
          </button>
          <button
            onClick={() => handleUpdateStatus("rejected")}
            disabled={updating}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 shadow"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycVerificationAdmin;
