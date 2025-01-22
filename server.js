import express from 'express';
import { configDotenv } from 'dotenv';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import http from 'http';
import { Server } from 'socket.io';

connectDB();
configDotenv();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('welcome', 'Hello from the server!');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}`);
}

})
  

