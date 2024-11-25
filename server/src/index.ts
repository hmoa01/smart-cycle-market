import "express-async-errors";
import "src/db";
import express from "express";
import authRouter from "routes/auth";
import productRouter from "./routes/product";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { sendErrorRes } from "./utils/helper";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket-message",
});

app.use(express.json());

app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//API ROUTES
app.use("/auth", authRouter);
app.use("/product", productRouter);

//SOCKET IO
io.on("connection", (socket) => {
  console.log("user is connected");
});

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.use("*", (req, res) => {
  sendErrorRes(res, "Not Found!", 404);
});

server.listen(8000, () =>
  console.log("The app running on http://localhost:8000")
);
