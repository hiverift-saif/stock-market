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

  // ✅ Fetch KYC details
  const fetchKyc = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(`${config.BASE_URL}kyc/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.statusCode === 200) {
        setKycDetails(res.data.result);
      } else {
        setError("Failed to fetch KYC details");
      }
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

  // ✅ Update Status
  const handleUpdateStatus = async (status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${config.BASE_URL}kyc/update-status/${userId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKycDetails((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating KYC status:", err);
      alert("Failed to update KYC status");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Eye click hone par modal me image dikhana
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        KYC Verification
      </h2>

      {/* Status & Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-xl border">
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${
              kycDetails.status === "verified"
                ? "bg-green-100 text-green-700"
                : kycDetails.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {kycDetails.status}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border">
          <p className="text-sm text-gray-500">Remark</p>
          <p className="mt-1 text-gray-700">
            {kycDetails.remark || "No remark"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border">
          <p className="text-sm text-gray-500">Uploaded Date</p>
          <p className="mt-1 text-gray-700">
            {new Date(kycDetails.uploadedDate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Documents in single row */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {documents.map((doc, idx) => (
                <th key={idx} className="p-3 border text-center">
                  {doc.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {documents.map((doc, idx) => (
                <td
                  key={idx}
                  className="p-3 border text-center cursor-pointer"
                  onClick={() => handlePreview(doc.src, doc.label)}
                >
                  <Eye className="w-6 h-6 text-blue-600 inline hover:scale-110 transition" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approve / Reject */}
      <div className="flex gap-4 justify-end">
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
  );
};

export default KycVerificationAdmin;
