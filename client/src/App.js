import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AllComplaints from "./AllComplaints";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complaints" element={<AllComplaints />} />
      </Routes>
    </Router>
  );
}

export default App;