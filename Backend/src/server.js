const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config(); // Also check current working dir as fallback

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🌷 Baikology API running at http://localhost:${PORT}`);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error("⚠️ Database connection failed:", error.message);
    console.log("ℹ️ Check that your current IP address is whitelisted in MongoDB Atlas Network Access: https://www.mongodb.com/docs/atlas/security-whitelist/");
  }

  // Graceful shutdown
  process.on("SIGINT", () => {
    server.close(() => {
      console.log("🌷 Baikology API gracefully closed");
      process.exit(0);
    });
  });
}

startServer();
