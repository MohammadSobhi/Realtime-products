// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
  }
});

let data = [
  { product : 'Apple', price: "10.99" },
  { product: 'Banana', price: "15.99" },
  { product: 'Galaxy', price: "499.99" }
];

io.on('connection', (socket) => {
  console.log('User connected');
  console.log(data);
  

  // Send initial data to the client
  socket.emit('update', data);

  // Listen for updates from the client
  socket.on('delete', (index) => {
    const newArr = data.slice(0, index).concat(data.slice(index + 1));
    data = newArr
    io.emit('update', data);
    console.log(data)
  });

  socket.on('products', (newProduct) => {
    data.push(newProduct);
    io.emit('update', data);
    console.log(data)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});