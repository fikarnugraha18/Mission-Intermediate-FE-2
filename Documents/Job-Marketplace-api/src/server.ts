import "dotenv/config";
import express from "express";

import authRoutes from "./auth/auth.routes";
import companiesRoutes from "./companies/companies.routes";
import jobsRoutes from "./jobs/jobs.routes";
import applicationsRoutes from "./applications/applications.routes";


console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});


app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(3333, () => {
  console.log("Server running on port 3333");
});
