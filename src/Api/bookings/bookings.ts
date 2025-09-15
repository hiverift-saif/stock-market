import client from "../client";

export async function getServices() {
  const res = await client.get('/services');
  // our backend returns CustomResponse => { statusCode, message, result }
  return res.data.result ?? res.data;
}

// month format: "2025-09"
export async function getAvailability(serviceId, month) {
  const res = await client.get(`/availability/${serviceId}?month=${month}`);
  console.log('res availivility',res)
  return res.data.result ?? res.data;
}

// create booking (returns bookingId, amount, paymentRef)
export async function createBooking({ serviceId, slotId, userId, paymentMethod = 'mock' }) {
  const res = await client.post('/bookings', { serviceId, slotId, userId, paymentMethod });
  return res.data.result ?? res.data;
}

// confirm payment
export async function confirmPayment({ bookingId, paymentRef, status = 'success' }) {
  const res = await client.post('/bookings/confirm', { bookingId, paymentRef, status });
  return res.data.result ?? res.data;
}

// get my bookings
export async function getMyBookings(userId) {
  const res = await client.get(`/bookings/user/${userId}`);
  return res.data.result ?? res.data;
}



