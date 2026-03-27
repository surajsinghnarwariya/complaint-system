import { useState, useEffect } from "react";
import axios from "axios";

function MainPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);

  const fetchComplaints = async () => {
    try {
      await axios.get("http://127.0.0.1:5000/complaints");
    } catch (err) {
      console.log("FETCH ERROR", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            const data = await res.json();

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown";

            const country = data.address.country;

            resolve(`${city}, ${country}`);
          } catch {
            reject("Location fetch failed");
          }
        },
        () => reject("Permission denied")
      );
    });
  };

  const handleSubmit = async () => {
    try {
      if (!title || !description) {
        alert("Please fill title & description ❌");
        return;
      }

      let currentLocation = "";

      try {
        currentLocation = await getLocation();
      } catch (err) {
        alert("Location required ❌");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", currentLocation);

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await axios.post("https://complaint-api-itkm.onrender.com", formData);

      alert("Complaint Submitted ✅");

      setTitle("");
      setDescription("");
      setLocation("");
      setImages([]);

      fetchComplaints();
    } catch (err) {
      alert("Error ❌");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #fca34b, #52a24b)",
      padding: "30px"
    }}>
      <h1 style={{ textAlign: "center", color: "white" }}>
        HUMARI SAMASYA
      </h1>

      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "500px",
        margin: "20px auto",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
      }}>
        <input
          placeholder="📝 Enter complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "95%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <textarea
          placeholder="📄 Describe your problem clearly..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "96%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages(e.target.files)}
          style={{ marginBottom: "15px" }}
        />

        <button
          onClick={handleSubmit}
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
          Submit Complaint
        </button>
      </div>
    </div>
  );
}

export default MainPage;