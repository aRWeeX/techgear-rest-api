const express = require("express");
const app = express();

const { closeDb } = require("./config/db");

app.use(express.json());

const analysisRoutes = require("./routes/analysisRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/", analysisRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = () => {
  console.log("Shutting down server...");

  try {
    closeDb();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database:", error);
  }

  server.close(() => {
    console.log("Server closed. Exiting process...");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcefully terminating...");
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", () => {
  console.log("SIGINT received. Initiating shutdown...");
  shutdown();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Initiating shutdown...");
  shutdown();
});
