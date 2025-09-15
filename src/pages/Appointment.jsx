import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// ✅ Custom Toolbar for Calendar
function CustomToolbar({ label, onNavigate, onView }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-1 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("PREV")}
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Next ➡
        </button>
      </div>

      {/* Current Label */}
      <span className="text-lg font-semibold">{label}</span>

      {/* Views */}
      <div className="flex gap-2">
        {["month", "week", "day", "agenda"].map((view) => (
          <button
            key={view}
            onClick={() => onView(view)}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 capitalize"
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(null); // ✅ New state for date
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // ✅ default null
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [events] = useState([
    {
      title: "Consultation with Rajesh",
      start: new Date(2025, 8, 6, 10, 0),
      end: new Date(2025, 8, 6, 11, 0),
    },
  ]);

  const services = [
    { id: 1, name: "Consultation (30 mins)", price: "₹10,000" },
    { id: 2, name: "Webinar Access", price: "₹10,000" },
    { id: 3, name: "1-on-1 Coaching (1 hr)", price: "₹10,0000`" },
  ];

  const timeSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

  const handlePaymentChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    alert(
      `✅ Booking Confirmed!\nService: ${selectedService.name}\nDate: ${moment(
        selectedDate
      ).format("DD MMM YYYY")}\nSlot: ${selectedSlot}\nPayment: Done`
    );
    setStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setPaymentDetails({ cardNumber: "", name: "", expiry: "", cvv: "" });
  };

  return (
    <div className="px-4 pt-5 md:py-12 bg-gray-50 min-h-screen mt-10">
     <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-100 border-r p-4 md:p-6 space-y-4 md:space-y-6">
          {["Service", "Schedule", "Payment", "Confirm"].map((label, i) => (
            <div
              key={i}
              onClick={() => setStep(i + 1)}
              className={`cursor-pointer p-3 rounded-lg text-sm font-medium ${
                step === i + 1
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`cursor-pointer border rounded-lg p-4 text-center ${
                      selectedService?.id === s.id
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <h3 className="font-medium">{s.name}</h3>
                    <p className="text-gray-600">{s.price}</p>
                  </div>
                ))}
              </div>
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg disabled:opacity-50"
              >
                Next: Select Date & Time
              </button>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Choose Date & Time
              </h2>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
                selectable
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(newView) => setView(newView)}
                onSelectSlot={(slotInfo) => {
                  setSelectedDate(slotInfo.start);
                  setSelectedSlot(null);
                }}
                components={{ toolbar: CustomToolbar }}
              />

              {selectedDate && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">
                    Selected Date:{" "}
                    {moment(selectedDate).format("DD MMM YYYY")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedSlot === slot
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Back
                </button>
                <button
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => setStep(3)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-50"
                >
                  Next: Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="Card Number"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="name"
                  value={paymentDetails.name}
                  onChange={handlePaymentChange}
                  placeholder="Cardholder Name"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiry"
                    value={paymentDetails.expiry}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <input
                    type="password"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentChange}
                    placeholder="CVV"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </form>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  Next: Confirm
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                🎉 Booking Confirmed!
              </h2>
              <p className="mb-2">
                <strong>Service:</strong> {selectedService?.name}
              </p>
              <p className="mb-2">
                <strong>Date:</strong>{" "}
                {moment(selectedDate).format("DD MMM YYYY")}
              </p>
              <p className="mb-2">
                <strong>Slot:</strong> {selectedSlot}
              </p>
              <p className="mb-6">
                Your payment has been processed successfully.
              </p>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
