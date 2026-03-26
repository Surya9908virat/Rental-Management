import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import landlordRoutes from "./routes/landlord.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import PropertyRouter from "./routes/property.routes.js";
import leaseRouter from "./routes/lease.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import maintenanceRouter from "./routes/maintenance.routes.js";
import messageRoutes from "./routes/message.routes.js";
import mongoose from "mongoose";  
import http from "http";
import { Server } from "socket.io";



const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  
  // Join a specific chat room
  socket.on("join-room", (relationId) => {
    socket.join(relationId);
    console.log(`User ${socket.id} joined room: ${relationId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

app.set("io", io); 

app.get("/", (req, res) => {
  res.send("RentWise backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/properties", PropertyRouter);
app.use("/api/leases", leaseRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/messages", messageRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
