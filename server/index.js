require("dotenv").config();

const Complaint = require("./models/Complaint");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const multer = require("multer");
const path = require("path");

const app = express();

const fs = require("fs");

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));


const upload = multer({ storage });

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connect
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB Error:", err);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Test Route

app.get("/test", (req, res) => {
  res.send("TEST WORKING ✅");
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


app.post("/complaint", upload.array("images", 5), async (req, res) => {
  try {
    console.log("REQ RECEIVED 🔥");
    console.log("BODY 👉", req.body);
    console.log("FILES 👉", req.files);
    const imagePaths = req.files ? req.files.map(f => f.filename) : [];

    const newComplaint = new Complaint({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      images: imagePaths
    });

    await newComplaint.save();

    res.json({ message: "ok" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


app.get("/complaints", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "MongoDB not connected ❌" });
    }

    const data = await Complaint.find();
    res.json(data);
  } catch (err) {
    console.log("GET ERROR 👉", err);
    res.status(500).json({ message: err.message });
  }
});


app.put("/complaint/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      data: updated
    });

  } catch (err) {
    console.log(err); // 👈 ये add करो
    res.status(500).json({ message: err.message });
  }
});



app.delete("/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting complaint" });
  }
});


const User = require("./models/User");

// Send OTP
app.post("/send-otp", async (req, res) => {
  const { mobile } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await User.findOneAndUpdate(
    { mobile },
    {
      mobile,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    },
    { upsert: true }
  );

  console.log("OTP 👉", otp); // अभी console में आएगा

  res.json({ message: "OTP sent" });
});


// 🔐 Verify OTP
app.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({
      message: "Login successful ✅",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Google Login
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("https://complaint-system-qpqt-pmq5apjvh-surajsinghnarwariyas-projects.vercel.app/");
  }
);



// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port" + PORT);
});