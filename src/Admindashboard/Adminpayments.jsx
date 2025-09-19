import React, { useState } from "react";

const Adminpayments = () => {
  const [payments] = useState([
    { id: 1, username: "JohnDoe", orderId: "ORD12345", status: "paid" },
    { id: 2, username: "JaneSmith", orderId: "ORD12346", status: "pending" },
    { id: 3, username: "AliceBrown", orderId: "ORD12347", status: "failed" },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="p-3 border">{payment.username}</td>
                <td className="p-3 border">{payment.orderId}</td>
                <td
                  className={`p-3 border font-medium capitalize ${
                    payment.status === "paid"
                      ? "text-green-700"
                      : payment.status === "pending"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Adminpayments;
