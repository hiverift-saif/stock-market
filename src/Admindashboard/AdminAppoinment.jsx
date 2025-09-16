import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Trash2, Edit, Eye } from "lucide-react";

const AdminAppointment = () => {
  const defaultTimes = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [modalData, setModalData] = useState(null); // for view/edit
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSlot = () => {
    if (!selectedDate || !selectedTime || !serviceName || !price) {
      alert("Please fill all fields");
      return;
    }

    const formattedDate = selectedDate.toDateString();

    const newSlot = {
      id: Date.now(),
      date: formattedDate,
      time: selectedTime,
      service: serviceName,
      price: price,
    };

    setSlots([...slots, newSlot]);
    setSelectedTime("");
    setSelectedDate(null);
    setServiceName("");
    setPrice("");
  };

  const handleDeleteSlot = (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      setSlots(slots.filter((s) => s.id !== id));
    }
  };

  const handleViewSlot = (slot) => {
    setModalData(slot);
    setIsEditing(false);
  };

  const handleEditSlot = (slot) => {
    setModalData(slot);
    setIsEditing(true);
  };

  const handleUpdateSlot = () => {
    setSlots(
      slots.map((s) => (s.id === modalData.id ? modalData : s))
    );
    setModalData(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Manage Appointment Slots</h2>

      {/* Add Slot */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-start">
        <div>
          <p className="font-medium mb-1">Select Date:</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            placeholderText="Select a date"
            className="border px-3 py-2 rounded w-full md:w-64"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Select Time:</p>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-64"
          >
            <option value="">Select Time</option>
            {defaultTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="font-medium mb-1">Service Name:</p>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Enter service"
            className="border px-3 py-2 rounded w-full md:w-64"
          />
        </div>

        <div>
          <p className="font-medium mb-1">Price:</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="border px-3 py-2 rounded w-full md:w-64"
          />
        </div>

        <div className="mt-4 md:mt-6">
          <button
            onClick={handleAddSlot}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full md:w-auto"
          >
            Add Slot
          </button>
        </div>
      </div>

      {/* Table of Slots */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">All Slots</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Service</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No slots added yet
                </td>
              </tr>
            ) : (
              slots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{slot.date}</td>
                  <td className="p-2 border">{slot.time}</td>
                  <td className="p-2 border">{slot.service}</td>
                  <td className="p-2 border font-semibold">₹{slot.price}</td>
                  <td className="p-2 border flex gap-2 justify-center">
                    <button
                      onClick={() => handleViewSlot(slot)}
                      className="p-1 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      <Eye size={16} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleEditSlot(slot)}
                      className="p-1 bg-green-100 rounded hover:bg-green-200"
                    >
                      <Edit size={16} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-1 bg-red-100 rounded hover:bg-red-200"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Slot" : "View Slot"}
            </h3>

            {/* Form inside modal */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={modalData.date}
                  onChange={(e) =>
                    setModalData({ ...modalData, date: e.target.value })
                  }
                  className="border w-full px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={modalData.time}
                  onChange={(e) =>
                    setModalData({ ...modalData, time: e.target.value })
                  }
                  className="border w-full px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Service</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={modalData.service}
                  onChange={(e) =>
                    setModalData({ ...modalData, service: e.target.value })
                  }
                  className="border w-full px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={modalData.price}
                  onChange={(e) =>
                    setModalData({ ...modalData, price: e.target.value })
                  }
                  className="border w-full px-2 py-1 rounded"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setModalData(null)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              {isEditing && (
                <button
                  onClick={handleUpdateSlot}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointment;
