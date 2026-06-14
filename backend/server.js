const express = require("express");
const cors = require("cors");
require("dotenv").config();


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sosRoutes = require("./routes/sosRoutes");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/sos", sosRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});