import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Send OTP
  const sendOtp = async () => {
    try {
      await axios.post("https://complaint-api-itkm.onrender.com/send-otp", { mobile });
      alert("OTP Sent 📱");
      setIsOtpSent(true);
    } catch {
      alert("Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      await axios.post("https://complaint-api-itkm.onrender.com/verify-otp", {
        mobile,
        otp
      });
      localStorage.setItem("isAdmin", "true");
      if (mobile === "7354227898") {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.setItem("isAdmin", "false");
      }
      localStorage.setItem("userName", mobile);
      let name = localStorage.getItem("name");

      if (!name) {
        name = prompt("Enter your name 👤");
        localStorage.setItem("name", name);
      }

      localStorage.setItem("userName", name);
      alert("Login Successful ✅");
      window.location.href = "/";
    } catch {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)"
      }}>
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "320px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}>
          <h2 style={{ marginBottom: "20px" }}>
            🔐 Login
          </h2>

          {/* Google Login */}
          <button
            onClick={() => window.open("http://localhost:5000/auth/google", "_self")}
            style={{
              width: "100%",
              padding: "10px",
              background: "#db4437",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              marginBottom: "20px",
              cursor: "pointer"
            }}
          >
            🔴 Login with Google
          </button>

          {!isOtpSent ? (
            <>
              <input
                type="text"
                placeholder="📱 Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              />

              <button
                onClick={sendOtp}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="🔢 Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  border: "1px solid #ccc"
                }}
              />

              <button
                onClick={verifyOtp}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;