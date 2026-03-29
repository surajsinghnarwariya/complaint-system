import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const navigate = useNavigate();

  // ✅ Send OTP
  const sendOtp = async () => {
    try {
      if (!mobile || mobile.length !== 10) {
        alert("Enter valid mobile number ❌");
        return;
      }

      const res = await axios.post(
        "https://complaint-api-itkm.onrender.com/send-otp",
        { mobile }
      );

      console.log("OTP RESPONSE 👉", res.data);

      alert("OTP Sent 📱 (check Render logs)");
      setIsOtpSent(true);

    } catch (err) {
      console.log("SEND OTP ERROR 👉", err.response?.data || err.message);
      alert("Error sending OTP ❌");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://complaint-api-itkm.onrender.com/verify-otp",
        { mobile, otp }
      );

      console.log("VERIFY RESPONSE 👉", res.data);

      if (mobile === "7354227898") {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.setItem("isAdmin", "false");
      }

      let name = localStorage.getItem("name");

      if (!name) {
        name = prompt("Enter your name 👤");
        localStorage.setItem("name", name);
      }

      localStorage.setItem("userName", name);

      alert("Login Successful ✅");

      navigate("/");

    } catch (err) {
      console.log("VERIFY ERROR 👉", err.response?.data || err.message);
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
        background: "linear-gradient(135deg, #e4a442, #4df158)"
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

          <button
            onClick={() => {
              window.location.assign(
                "https://complaint-api-itkm.onrender.com/auth/google"
              );
            }}
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