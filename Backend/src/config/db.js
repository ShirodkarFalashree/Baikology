const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    dbName: process.env.DB_NAME || "baikology",
  });

  console.log("🌷 Connected to MongoDB successfully!");
}

module.exports = connectDB;
