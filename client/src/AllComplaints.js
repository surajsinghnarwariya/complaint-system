import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Fix localStorage issue
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");
    if (admin === "true") {
      setIsAdmin(true);
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("https://your-backend.onrender.com/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id) => {
    await axios.put(`https://your-backend.onrender.com/complaint/${id}`, {
      status: "Resolved"
    });
    fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #fca34b, #52a24b)",
          padding: "30px"
        }}
      >
        <h2 style={{ textAlign: "center", color: "white" }}>
          All Complaints
        </h2>

        {complaints.length === 0 ? (
          <p style={{ textAlign: "center", color: "white" }}>
            No complaints found ❌
          </p>
        ) : (
          complaints.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#ffffff",
                margin: "20px auto",
                padding: "20px",
                borderRadius: "12px",
                width: "90%",
                maxWidth: "600px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                borderLeft:
                  item.status === "Resolved"
                    ? "6px solid #4caf50"
                    : "6px solid #ff9800"
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <p style={{ fontSize: "13px", color: "gray" }}>
                📍 {item.location}
              </p>

              {/* ✅ Images */}
              {item.images &&
                item.images.map((img, i) => (
                  <img
                    key={i}
                    src={`https://your-backend.onrender.com/uploads/${img}`}
                    alt="complaint"
                    style={{
                      width: "80px",
                      margin: "5px",
                      borderRadius: "6px"
                    }}
                  />
                ))}

              <p
                style={{
                  fontWeight: "bold",
                  color:
                    item.status === "Resolved"
                      ? "#4caf50"
                      : "#ff9800"
                }}
              >
                {item.status === "Resolved"
                  ? "✅ Resolved"
                  : "⏳ Pending"}
              </p>

              {isAdmin && item.status !== "Resolved" && (
                <button
                  onClick={() => handleStatus(item._id)}
                  style={{
                    background: "#4caf50",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Resolve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AllComplaints;