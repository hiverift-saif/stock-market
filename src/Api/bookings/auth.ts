

  // src/Api/auth.js
import client from "../client";

// Login API
export async function ApiLogin({ username, password }) {
  // यहां backend का सही login endpoint लगाना
  const res = await client.post("/auth/login", { username, password ,role:'user'});

  const data = res.data.result ?? res.data;
  console.log('data is comeing from server',data)
  // token निकालो (backend response के हिसाब से adjust करना पड़ेगा)
  const token =
    data?.token ??
    data?.accessToken ??
    data?.jwt ??
    null;

  if (!token) {
    throw new Error("Login failed: no token received from API");
  }

  // अभी सिर्फ localStorage में save करेंगे
  localStorage.setItem("token", token);

  return data; // return user + token info
}
