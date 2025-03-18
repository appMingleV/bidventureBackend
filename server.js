import { config } from "dotenv";
config();
import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import http from "http";
import cors from "cors";
import { getIO, initiateSocket } from "./socket.js";
connectDB();
const app = express();
const server = http.createServer(app);
server.timeout = 0; // Disable timeout
app.use(express.json({ limit: "300mb" }));
app.use(cors());
app.use("/api/uploads", express.static("Uploads"));
app.use("/api", routes);
initiateSocket(server);
const io = getIO();
app.use((req, res, next) => {
  req.io = io;
  req.restaurantSockets = restaurantSockets;
  req.userSocket = userSocket;
  next();
});
server.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}`);
  }
});
