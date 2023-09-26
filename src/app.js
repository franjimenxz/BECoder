import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import mongoose from "mongoose";
import * as handlebars from "express-handlebars";
import __dirname from "./utils.js";
import messageRouter, { MessageService } from "./routes/message.router.js";
import { Server } from "socket.io";
import dotenv from "dotenv";
import productsViewRouter from "./routes/productsView.router.js";
import cartsViewRouter from "./routes/cartsView.router.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/products", productsViewRouter);
app.use("/carts", cartsViewRouter);
try {
  const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB}`;
  await mongoose.connect(db);
  console.log("Database connected");
} catch (error) {
  console.log(error);
}
const httpServer = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const ioServer = new Server(httpServer);

ioServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  socket.emit("messageLogs", await MessageService.getMessages());
  socket.on("message", async (data) => {
    let response = await MessageService.sendMessage(data.user, data.message);
    console.log(response);
    socket.emit("messageLogs", await MessageService.getMessages());
  });
});
app.use((req, res, next) => {
  req.io = ioServer;
  next();
});
app.use("/api/chat", messageRouter);
