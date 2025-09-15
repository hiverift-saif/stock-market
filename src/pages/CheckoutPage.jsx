import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaLock,
  FaCheck,
  FaTag,
  FaStar,
  FaTimes,
  FaGift,
  FaMoon,
  FaSun,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";

/**
 * Trending CheckoutPage — Accent color set to:
 *   oklch(85.2% 0.199 91.936)
 *
 * The accent is provided as CSS variable --accent; a darker variant --accent-dark
 * is computed using color-mix (falls back to the same accent when unsupported).
 *
 * Paste into your project. Keep Tailwind installed.
 */

const razorpayKey = "rzp_test_RD67KFzwSW83SE"; // replace when needed
const fallbackThumb = "/fallback-course.png";

function formatINR(v) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v));
  } catch {
    return `₹${v}`;
  }
}

function SafeImg({ src, alt, className }) {
  const [s, setS] = useState(src || fallbackThumb);
  return <img src={s} alt={alt} className={className} onError={() => s !== fallbackThumb && setS(fallbackThumb)} />;
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  function push(message, type = "info", ttl = 3500) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }
  return { toasts, push, remove: (id) => setToasts((t) => t.filter((x) => x.id !== id)) };
}

export default function CheckoutPage() {
  const location = useLocation();
  const course = location.state?.course ?? {
    id: "demo-1",
    title: "Master React — Complete Guide",
    description: "Modern React from zero to pro — hooks, patterns, performance.",
    price: 1299,
    duration: "9h 12m",
    thumbnail:
      "https://images.unsplash.com/photo-1526378726708-81c6b6a3f2c1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c9d4b8d6a1b0b8d6f7ae1f9d7f3a8d6",
    rating: 4.9,
    students: 15840,
  };

  // UI / form states
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState("details"); // details | login | checkout | success
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [address, setAddress] = useState({ firstName: "", lastName: "", email: "", phone: "", fullAddress: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToasts();

  // Derived values
  const net = Math.max(0, (Number(course.price) || 0) - (Number(discount) || 0));
  const formattedNet = useMemo(() => formatINR(net), [net]);
  const studentsDisplay = useMemo(() => (course?.students ?? 0).toLocaleString(), [course]);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    // load Razorpay
    const id = "razorpay-checkout-js";
    if (document.getElementById(id)) {
      setScriptLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setScriptLoaded(true);
    s.onerror = () => {
      setScriptLoaded(false);
      toast.push("Razorpay script failed to load — payment may not work", "error", 5000);
    };
    document.body.appendChild(s);
  }, []); // eslint-disable-line

  // validators and handlers
  const validateLogin = () => {
    const e = {};
    if (!loginData.email || !/^\S+@\S+\.\S+$/.test(loginData.email)) e.email = "Invalid email";
    if (!loginData.password || loginData.password.length < 6) e.password = "Min 6 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const validateAddress = () => {
    const e = {};
    if (!address.firstName) e.firstName = "Required";
    if (!address.lastName) e.lastName = "Required";
    if (!address.email || !/^\S+@\S+\.\S+$/.test(address.email)) e.email = "Invalid email";
    if (!address.phone || !/^\d{7,15}$/.test(address.phone)) e.phone = "Invalid phone";
    if (!address.fullAddress) e.fullAddress = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  function handleLogin(e) {
    e.preventDefault();
    if (!validateLogin()) return toast.push("Fix login fields", "error");
    setIsLoggedIn(true);
    setStep("checkout");
    toast.push("Welcome back — ready to checkout", "success");
  }

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return toast.push("Enter a coupon code", "info");
    if (code === "TREND25") {
      const d = Math.floor(course.price * 0.25);
      setDiscount(d);
      toast.push(`TREND25 applied — ₹${d} off`, "success");
      return;
    }
    if (code === "SAVE100") {
      setDiscount(100);
      toast.push("SAVE100 applied — ₹100 off", "success");
      return;
    }
    toast.push("Invalid coupon", "error");
  }

  function confirmAndPay() {
    if (!validateAddress()) return toast.push("Fix address fields", "error");
    setShowConfirm(true);
  }

  async function handlePayment() {
    setShowConfirm(false);
    if (!scriptLoaded || typeof window.Razorpay === "undefined") {
      toast.push("Payment gateway not ready. Try again.", "error");
      return;
    }
    setLoadingPayment(true);
    const amountPaise = Math.round(net * 100);
    const options = {
      key: razorpayKey,
      amount: amountPaise,
      currency: "INR",
      name: "My Courses",
      description: course.title,
      handler: function (resp) {
        setLoadingPayment(false);
        setStep("success");
        toast.push("Payment successful — welcome aboard!", "success", 4500);
      },
      prefill: { name: `${address.firstName} ${address.lastName}`, email: address.email, contact: address.phone },
      theme: { color: "var(--accent)" },
      modal: { ondismiss: () => setLoadingPayment(false) },
    };
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoadingPayment(false);
      toast.push("Failed to open payment window", "error");
    }
  }

  function resetAll() {
    setStep("details");
    setIsLoggedIn(false);
    setLoginData({ email: "", password: "" });
    setAddress({ firstName: "", lastName: "", email: "", phone: "", fullAddress: "" });
    setCoupon("");
    setDiscount(0);
    setErrors({});
    setShowConfirm(false);
    setLoadingPayment(false);
  }

  return (
    <>
      {/* CSS variables for accent color — using your Oklch value */}
      <style>
        {`
        :root{
          --accent: oklch(85.2% 0.199 91.936);
          --accent-dark: color-mix(in oklch, var(--accent) 72%, black 28%);
          --accent-fg: color-contrast(var(--accent) vs black, white);
        }
        /* Fallbacks when color-mix isn't supported: use same as --accent */
        @supports not (color-mix(in oklch, var(--accent) 72%, black 28%)) {
          :root { --accent-dark: var(--accent); --accent-fg: #000; }
        }
        /* Small animation classes */
        @keyframes pulseSlow { 0%{ transform: scale(1);} 50%{ transform: scale(1.06);} 100%{ transform: scale(1);} }
        @keyframes bounceSlow { 0%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} 100%{ transform: translateY(0);} }
        .animate-pulse-slow{ animation: pulseSlow 2.6s infinite ease-in-out; }
        .animate-bounce-slow{ animation: bounceSlow 2.2s infinite ease-in-out; }
        `}
      </style>

      <div className={`min-h-screen py-12 px-4 ${dark ? "bg-slate-900 text-slate-100" : "bg-gradient-to-b from-pink-50 via-white to-slate-50"}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-xl" style={{ color: "var(--accent)" }}>EduTrend</div>
            <div className="text-sm text-slate-500 hidden sm:block">Checkout</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDark((d) => !d);
                toast.push(dark ? "Light mode" : "Dark mode", "info");
              }}
              className="p-2 rounded-full bg-white/60 dark:bg-slate-800/60 shadow"
              title="Toggle theme"
            >
              {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-700" />}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${"var(--accent)"}33, transparent 70%)`, opacity: 0.08, pointerEvents: "none" }} />
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm">
                <SafeImg src={course.thumbnail} alt={course.title} className="w-36 h-36 rounded-xl shadow-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{course.title}</h1>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 truncate">{course.description}</p>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <div className="px-3 py-1 rounded-full bg-white border text-sm flex items-center gap-2">
                      <FaStar className="text-yellow-400" /> <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/80 border text-sm">{course.duration}</div>
                    <div className="px-3 py-1 rounded-full bg-white/80 border text-sm">{studentsDisplay} students</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-sm text-slate-500 dark:text-slate-300">Price</div>
                  <div className="text-3xl font-bold" style={{ color: "var(--accent)" }}>₹{course.price}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(isLoggedIn ? "checkout" : "login")}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow hover:scale-[1.02] transform transition"
                      style={{ background: "var(--accent)", color: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                    >
                      <FaTag /> Buy Now
                    </button>
                    <button className="px-3 py-2 rounded-full border" onClick={() => toast.push("Preview In Demo", "info")}>Preview</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-300">Complete your purchase</div>
                  <div className="text-lg font-semibold">Fast checkout</div>
                </div>
                <div className="w-48">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-700">
                    <div className={`h-2 rounded-full`} style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))", width: step === "details" ? "33%" : step === "login" ? "66%" : step === "checkout" ? "90%" : "100%" }} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1 text-right">{step.toUpperCase()}</div>
                </div>
              </div>

              {/* DETAILS */}
              {step === "details" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white border hover:scale-[1.01] transition">
                      <div className="font-medium">Post-work projects</div>
                      <div className="text-sm text-slate-500 mt-1">Portfolio-ready apps</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white border hover:scale-[1.01] transition">
                      <div className="font-medium">Lifetime access</div>
                      <div className="text-sm text-slate-500 mt-1">Always available</div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(isLoggedIn ? "checkout" : "login")} className="flex-1 py-3 rounded-xl font-semibold transition" style={{ background: "var(--accent)", color: "white", boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}>
                      Proceed to Checkout
                    </button>
                    <button onClick={() => toast.push("Saved to wishlist", "success")} className="py-3 px-4 rounded-xl border">Wishlist</button>
                  </div>
                </>
              )}

              {/* LOGIN */}
              {step === "login" && !isLoggedIn && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="text-sm text-slate-500 dark:text-slate-300">Sign in to continue</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LabeledInput name="email" value={loginData.email} onChange={(e) => setLoginData((s) => ({ ...s, email: e.target.value }))} icon={<FaEnvelope />} placeholder="Email" />
                    <LabeledInput name="password" value={loginData.password} onChange={(e) => setLoginData((s) => ({ ...s, password: e.target.value }))} icon={<FaLock />} placeholder="Password" type="password" />
                  </div>

                  {errors.email || errors.password ? <div className="text-sm text-rose-500">{errors.email || errors.password}</div> : null}

                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 py-3 rounded-xl" style={{ background: "var(--accent)", color: "white" }}>Login</button>
                    <button type="button" onClick={() => { setIsLoggedIn(true); setStep("checkout"); toast.push("Guest mode enabled", "info"); }} className="py-3 px-4 rounded-xl border">Guest</button>
                  </div>
                </form>
              )}

              {/* CHECKOUT */}
              {step === "checkout" && isLoggedIn && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LabeledInput icon={<FaUser />} name="firstName" value={address.firstName} onChange={(e) => setAddress((s) => ({ ...s, firstName: e.target.value }))} placeholder="First name" error={errors.firstName} />
                    <LabeledInput icon={<FaUser />} name="lastName" value={address.lastName} onChange={(e) => setAddress((s) => ({ ...s, lastName: e.target.value }))} placeholder="Last name" error={errors.lastName} />
                    <LabeledInput icon={<FaEnvelope />} name="email" value={address.email} onChange={(e) => setAddress((s) => ({ ...s, email: e.target.value }))} placeholder="Email" error={errors.email} />
                    <LabeledInput icon={<FaPhone />} name="phone" value={address.phone} onChange={(e) => setAddress((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" error={errors.phone} />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm text-slate-600 dark:text-slate-300">Full address</label>
                    <textarea value={address.fullAddress} onChange={(e) => setAddress((s) => ({ ...s, fullAddress: e.target.value }))} rows="3" className={`mt-2 w-full rounded-lg p-3 border bg-white dark:bg-slate-700 ${errors.fullAddress ? "ring-1 ring-rose-400" : ""}`} placeholder="Street, city, state, postal code" />
                    {errors.fullAddress && <div className="text-rose-500 text-sm mt-1">{errors.fullAddress}</div>}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="sm:col-span-2 flex gap-3">
                      <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (TREND25 / SAVE100)" className="flex-1 p-3 rounded-lg border bg-white dark:bg-slate-700" />
                      <button onClick={applyCoupon} className="px-4 py-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>Apply</button>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                      <div className="flex justify-between text-sm text-slate-600"><div>Subtotal</div><div>₹{course.price}</div></div>
                      <div className="flex justify-between text-sm text-slate-600 mt-1"><div>Discount</div><div>- ₹{discount}</div></div>
                      <div className="flex justify-between text-base font-semibold mt-2"><div>Total</div><div style={{ color: "var(--accent)" }}>₹{net}</div></div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={confirmAndPay} className="flex-1 px-5 py-3 rounded-xl font-bold transform hover:-translate-y-0.5 transition" style={{ background: "linear-gradient(90deg,var(--accent), var(--accent-dark))", color: "white" }}>
                      <span className="flex items-center gap-2 justify-center"><FaGift /> Pay {formattedNet}</span>
                    </button>

                    <button onClick={() => setStep("details")} className="py-3 px-4 rounded-xl border">Back</button>
                  </div>
                </>
              )}

              {/* SUCCESS */}
              {step === "success" && (
                <div className="text-center py-8">
                  <div className="mx-auto w-28 h-28 rounded-full bg-[color:var(--accent)]/10 flex items-center justify-center mb-4 shadow-inner">
                    <FaCheck className="text-[color:var(--accent)] text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold">Payment Complete</h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">You're enrolled — check My Courses to start learning.</p>
                  <div className="mt-6 flex gap-3 justify-center">
                    <button onClick={() => (window.location.href = "/my-courses")} className="py-3 px-6 rounded-xl" style={{ background: "var(--accent)", color: "white" }}>Go to My Courses</button>
                    <button onClick={resetAll} className="py-3 px-6 rounded-xl border">Buy Another</button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800">
                <div className="font-semibold">Trusted</div>
                <div className="text-sm text-slate-500 mt-1">Secure payments & 24/7 support</div>
              </div>
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800">
                <div className="font-semibold">Popular</div>
                <div className="text-sm text-slate-500 mt-1">{studentsDisplay} learners</div>
              </div>
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800">
                <div className="font-semibold">High-rated</div>
                <div className="text-sm text-slate-500 mt-1">{course.rating} star average</div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4">
            <div className="sticky top-28 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
              <div className="flex items-center gap-3">
                <SafeImg src={course.thumbnail} alt="thumb" className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <div className="font-semibold">{course.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-300">{course.duration}</div>
                </div>
              </div>

              <div className="mt-4 relative">
                <div className="rounded-xl p-4" style={{ background: `linear-gradient(180deg, ${"var(--accent)"}10, transparent)`, border: "1px solid rgba(0,0,0,0.04)" }}>
                  <div className="flex justify-between items-start">
                    <div className="text-sm opacity-90">{course.title}</div>
                    <div className="text-xs opacity-80">Order</div>
                  </div>
                  <div className="mt-6 text-2xl font-bold" style={{ color: "var(--accent)" }}>{formattedNet}</div>
                  <div className="mt-4 text-xs opacity-90">Name: {address.firstName ? `${address.firstName} ${address.lastName}` : "—"}</div>
                  <div className="mt-1 text-xs opacity-80">Email: {address.email || "—"}</div>
                </div>

                <div className="absolute -right-4 -bottom-4">
                  <button onClick={() => (isLoggedIn ? confirmAndPay() : setStep("login"))} className="p-3 rounded-full shadow-xl animate-pulse-slow" style={{ background: "var(--accent)", color: "white" }}>
                    {isLoggedIn ? "Pay" : "Login"}
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-300">Secure checkout • Refund policy applied</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow text-sm">
              <div className="font-medium mb-2">Need help?</div>
              <div className="text-slate-500 dark:text-slate-300">Chat with support or email support@example.com</div>
              <button onClick={() => toast.push("Chat started (demo)", "info")} className="mt-3 w-full py-2 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>Live Chat</button>
            </div>
          </aside>
        </div>

        {/* Confirm modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Confirm order</h3>
                <button onClick={() => setShowConfirm(false)} className="p-2 rounded-full border"><FaTimes /></button>
              </div>
              <div className="mt-4 text-sm">
                <div className="flex justify-between"><div>{course.title}</div><div>₹{course.price}</div></div>
                <div className="flex justify-between mt-2"><div>Discount</div><div>- ₹{discount}</div></div>
                <div className="flex justify-between mt-3 font-semibold"><div>Total</div><div style={{ color: "var(--accent)" }}>₹{net}</div></div>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={handlePayment} className="flex-1 py-2 rounded-xl" style={{ background: "var(--accent)", color: "white" }}>{loadingPayment ? "Processing..." : `Pay ${formattedNet}`}</button>
                <button onClick={() => setShowConfirm(false)} className="py-2 px-4 rounded-xl border">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* toasts */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toast.toasts.map((t) => (
            <div key={t.id} className={`min-w-[220px] px-4 py-2 rounded-lg shadow-lg text-sm ${t.type === "success" ? "bg-emerald-50 text-emerald-800" : t.type === "error" ? "bg-rose-50 text-rose-800" : "bg-white text-slate-800"} border`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Helper components */
function LabeledInput({ icon, placeholder, name, value, onChange, type = "text", error }) {
  return (
    <div>
      <div className={`flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-slate-700 ${error ? "ring-1 ring-rose-400" : ""}`}>
        <div className="text-slate-400">{icon}</div>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-transparent outline-none" type={type} />
      </div>
      {error && <div className="text-rose-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
