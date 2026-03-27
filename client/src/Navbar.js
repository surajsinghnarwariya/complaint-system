import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [photo, setPhoto] = useState(localStorage.getItem("photo"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const userName = localStorage.getItem("userName");
  const location = localStorage.getItem("location");
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPhoto(url);
    localStorage.setItem("photo", url);
  };

  const handleEditName = () => {
    const newName = prompt("Enter new name 👤");
    if (newName) {
      localStorage.setItem("userName", newName);
      window.location.reload();
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("userName");

    if (user) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <div style={{
      background: "#333",
      padding: "10px 20px",
      height: "100px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",

      position: "fixed",     
      top: 0,                
      left: 0,               
      width: "100%", 
      boxSizing: "border-box",        
      zIndex: 1000          
    }}>
      <h2>🚀 Humari Samasya</h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        marginLeft: "20px"
      }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/complaints" style={linkStyle}>All Complaints</Link>
        {!isLoggedIn && <Link to="/login" style={linkStyle}>Login</Link>}
      </div>

      {isLoggedIn && (
        <>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handlePhoto}
          />

          <div style={{ position: "relative", marginLeft: "15px" }}>

            {/* Profile Image */}
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{ cursor: "pointer", textAlign: "center", lineHeight: "1.1", gap: "2px", flexDirection: "column" }}
            >
              <img
                src={
                  photo ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                style={{
                  width: "45px",
                  height: "45px",
                  marginLeft: "10px",
                  marginTop: "5px",
                  borderRadius: "50%",
                  border: "2px solid white"
                }}
                alt="profile"
              />

              <p style={{ color: "white", fontSize: "12px" }}>
                {userName}
              </p>
              {location && (
                <p style={{ color: "#ccc", fontSize: "11px", margin: "0px" }}>
                  📍 {location}
                </p>
              )}
            </div>

            {/* Dropdown */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  background: "white",
                  color: "black",
                  borderRadius: "10px",
                  padding: "10px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                  width: "150px"
                }}
              >
                <p
                  style={{ cursor: "pointer", marginBottom: "8px" }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  📷 Edit Photo
                </p>

                <p
                  style={{ cursor: "pointer", marginBottom: "8px" }}
                  onClick={handleEditName}
                >
                  ✏️ Edit Name
                </p>

                <div>
                  {/* Add Location */}
                  <p
                    style={{ cursor: "pointer", marginBottom: "5px" }}
                    onClick={() => setShowLocationOptions(!showLocationOptions)}
                  >
                    📍 Add Location
                  </p>

                  {/* Hidden options */}
                  {showLocationOptions && (
                    <>
                      <p
                        style={{ cursor: "pointer", color: "green", marginLeft: "10px" }}
                        onClick={() => {
                          navigator.geolocation.getCurrentPosition(async (pos) => {
                            const lat = pos.coords.latitude;
                            const lon = pos.coords.longitude;

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

                            const finalLocation = `${city}, ${country}`;

                            localStorage.setItem("location", finalLocation);
                            window.location.reload();
                          });
                        }}
                      >
                        📍 Use Current Location
                      </p>

                      <p
                        style={{ cursor: "pointer", color: "blue", marginLeft: "10px" }}
                        onClick={() => {
                          const loc = prompt("Enter your location 📍");
                          if (loc) {
                            localStorage.setItem("location", loc);
                            window.location.reload();
                          }
                        }}
                      >
                        ✏️ Enter Manually
                      </p>
                    </>
                  )}
                </div>

                <p
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  🚪 Logout
                </p>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

const linkStyle = {
  color: "white",
  marginLeft: "20px",
  textDecoration: "none",
  fontWeight: "bold"
};

export default Navbar;