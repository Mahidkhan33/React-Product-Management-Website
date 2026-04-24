require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: [
    "http://localhost:5173",
     "https://navttc-assignment-projects-a43j9xvk9-mahids-projects-5669cd1b.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});