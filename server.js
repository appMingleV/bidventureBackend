import { config } from "dotenv";
config();
import express from "express";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import http from "http";
import { Server } from "socket.io";

connectDB();

const app = express({ limit: "300mb" });
const server = http.createServer(app);
server.timeout = 0; // Disable timeout

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use("/api/uploads", express.static("Uploads"));
app.use("/api", routes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit("welcome", "Hello from the ");

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}`);
  }
});
