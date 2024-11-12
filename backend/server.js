// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const MongoDBStore = require("connect-mongodb-session")(session);

dotenv.config();

// Inisialisasi Express
const app = express();

// Konfigurasi CORS
const allowedOrigins = ["https://nama-frontend-vercel.vercel.app"]; // Ganti dengan URL frontend Anda di Vercel
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware Keamanan
app.use(helmet());

// Rate Limiting untuk rute /auth/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimum 100 permintaan per IP per windowMs
  message: "Terlalu banyak permintaan dari IP ini, coba lagi setelah 15 menit",
});
app.use("/auth/", authLimiter);

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Konfigurasi penyimpanan sesi dengan MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_URI, // Pastikan MONGO_URI telah diatur di variabel lingkungan
  collection: "sessions",
});

store.on("error", function (error) {
  console.error("Error connecting to MongoDB session store:", error);
});

// Middleware Sesi
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Pastikan SESSION_SECRET telah diatur di variabel lingkungan
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Gunakan cookie aman di lingkungan produksi
      sameSite: "lax", // Atur sesuai kebutuhan
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 minggu
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Konfigurasi Passport
require("./config/passport")(passport);

// Routes
app.use("/auth", authRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
