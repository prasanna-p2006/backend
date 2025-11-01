// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static frontend build (if any) ---
app.use(express.static(path.join(__dirname, "public")));

// --- Connect MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/easepark", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- Import your API routes ---
app.use("/api/slots", require("./routes/slots"));
app.use("/api/vehicle", require("./routes/Vehicle"));

// --- Test route ---
app.get("/", (req, res) => {
  res.send("EasePark API Running ✅");
});

// --- Serve frontend for unknown routes (optional) ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Socket.io setup (for live slot updates) ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🟢 A client connected");
  socket.on("disconnect", () => console.log("🔴 Client disconnected"));
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 EasePark Server running on port ${PORT}`)
);
